---
layout: post
title: Analyzing variable references with Tern
date: 2016-06-10
---

I recently built a Chrome extension that lets you [jump to a variable's definition when viewing JavaScript code on Github](https://github.com/mattzeunert/OctoTern).

The project is based on [Tern](http://ternjs.net/), a code analysis engine for JavaScript. It took me some time to understand how I to use Tern, so this post explains some basic examples.

![Example of jumping to variable definitions with OctoTern](/img/blog/tern/octotern.gif)

## Tern Hello World

Tern uses a server based architecture. Normally, the server runs as a separate process, but we can also run it as part of our Node app. Either way, the way we use Tern is similar: we send JSON to the server and receive a JSON response back.

Here's the simplest Tern example I could come up with:

{% highlight javascript %}
var tern = require("tern")

var ternServer = new tern.Server({})
ternServer.addFile("example.js", "var a = 5; a += 10;")

var requestDetails = {
    query: {
        type: "refs",
        file: "example.js",
        end: 5
    }
}
ternServer.request(requestDetails, function(error, success){
    console.log(success)
})
{% endhighlight %}

This is the response from the server:

{% highlight json %}
{
    refs: [{
        file: 'example.js',
        start: 4,
        end: 5
    }, {
        file: 'example.js',
        start: 11,
        end: 12
    }],
    type: 'global',
    name: 'a'
}
{% endhighlight %}

While most of the code is self-explanatory, it's worth explaining the query we're making.

The type `refs` tells Tern that we're looking for variable references. The `end` parameter lets Tern know what variable we're interested in. It's the character index of the `a` variable in the code that we're passing in.

```
var a = 5; a += 10;
0123456789012345678
```

Once you've got the basic structure working, the [Tern reference manual](http://ternjs.net/doc/manual.html) does a good job of explaining the details.

## Finding where a variable is defined

We can easily change the example above to find a variable's definition:

{% highlight javascript %}
var requestDetails = {
    query: {
        type: "definition",
        file: "example.js",
        end: 12
    }
}
{% endhighlight %}

Index 12 is the second `a` in `var a = 5; a += 10;`. Tern tells us it's defined at character 4:

{% highlight json %}
{
    origin: 'example.js',
    start: 4,
    end: 5,
    file: 'example.js',
    contextOffset: 4,
    context: 'var a = 5; a += 10;'
}
{% endhighlight %}

## Finding all variables in a file

In the examples above we always supplied Tern with a specific character index for our variable. That works well when the end user has selected a specific character and you want to do a lookup.

However, it makes it difficult to find all variables at once. As far as I can tell Tern doesn't include any special features for that use case.

That means you have to traverse the abstract syntax tree (AST) yourself in order to identify variable declarations. Tern provides an event hook called `postParse` that gives us access to the AST.

But variable declarations with `var` aren't the only way to introduce a new variable. You can also use a function parameter, or store the value as an object property.

In the end I just looked for every identifier and tried to resolve it with Tern.

I'm using [estraverse](https://github.com/estools/estraverse) to go through the syntax tree.

{% highlight javascript %}
var tern = require("tern")
var estraverse = require("estraverse")

var ternServer = new tern.Server({})
var identifierPositions = []
ternServer.on("postParse", function(ast){
    estraverse.traverse(ast, {
        enter: function(node){
            if (node.type === "Identifier") {
                identifierPositions.push(node.end)
            }
        }
    })
})
ternServer.addFile("example.js", "var a = 5; a += 10;")

identifierPositions.forEach(function(identifierPosition){
    var requestDetails = {
        query: {
            type: "definition",
            file: "example.js",
            end: identifierPosition
        }
    }
    ternServer.request(requestDetails, function(error, success){
        console.log(success)
    })
})
{% endhighlight %}

Console output:

{% highlight javascript %}
{
    origin: 'example.js',
    start: 4,
    end: 5,
    file: 'example.js',
    contextOffset: 4,
    context: 'var a = 5; a += 10;'
}
{
    origin: 'example.js',
    start: 4,
    end: 5,
    file: 'example.js',
    contextOffset: 4,
    context: 'var a = 5; a += 10;'
}
{% endhighlight %}

Since we've only declared one variable, all declarations point to the same place.

The code above isn't particularly efficient and we could be smarter about what Tern requests we make. For example, we could be more specific instead of collecting all `"Identifier"` type nodes. Or, we could make requests for references instead of definitions, and then skip requests for identifier positions that are already covered by previous requests.

However, for me it's good enough.
