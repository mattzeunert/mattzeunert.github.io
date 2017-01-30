---
layout: post
title: Lazy JavaScript Parsing in V8
date: 2017-01-30
---

JavaScript engines use a mechanism called lazy parsing to be able to run code more quickly.

This post will explain lazy parsing, how it's beneficial, and what the potential problems with it are.

## Background

V8 is the JavaScript engine used in Chrome and Node. While this post talks about V8 specifically it's not the only JavaScript engine that uses lazy parsing.

Before JavaScript can be run it needs to be translated into machine code. That's what V8 does.

First, the code is converted to a list of tokens, then the tokens are converted into a syntax tree, and then the machine code is generated from the sytnax tree. 

Parsing is the second step – converting the tokens to an abstract syntax tree (AST). Here's some example source code with the corresponding AST:

![](/img/blog/lazy-parsing-ast.png)

If you're interested in playing around with JavaScript syntax trees try out [AST Explorer](https://astexplorer.net/).

## Pre-parsing and full parsing

Parsing code takes time, so JS engines will try to avoid parsing a file fully.

That's possible because most functions in a JavaScript file are never called, or won't be called until later on, for example when the user interacts with the UI.

So instead of parsing every function most functions are just pre-parsed. Pre-parsing detects syntax errors, but it [won't](http://stackoverflow.com/a/41827253/1290545) resolve the scope of variables used in the function or generate an AST.

By doing less work the pre-parser is about [two times faster](https://docs.google.com/document/d/1dev8h3FtP-BDjcwQosanV9wGy3NyOOpQe3tAIDr7hXc/edit) than the full parser.

However, when you call a function that hasn't been fully parsed yet you need to do a full parse at the time of the function call.

## An example using V8

Let's look at an example of this behavior.

Node has a command-line option called `--trace_parse` that will tell you when scripts or functions are parsed. However, the output can sometimes be quite large because of various internal code that Node runs to bootstrap your program. So instead of Node I'll be using the V8 shell program called `d8`.

Unlike Node, `d8` doesn't have a `console.log` function, so I'm using a function called `print`:

{% highlight javascript %}
function sayHi(name){
    var message = "Hi " + name + "!"
    print(message)
}

function add(a, b){
    return a + b;
}

sayHi("Sparkle")
{% endhighlight %}

I've got two functions here, `sayHi` and `add`. `add` is never called.

```
$ d8 --trace_parse test.js

[parsing script: native datetime-format-to-parts.js - took 0.361 ms]
[parsing function: ImportNow - took 0.014 ms]
[parsing function: InstallFunctions - took 0.044 ms]
[parsing function: SetFunctionName - took 0.015 ms]
[parsing script: native icu-case-mapping.js - took 0.031 ms]
[parsing function: OverrideFunction - took 0.029 ms]
[parsing function: PostExperimentals - took 0.028 ms]
[parsing script: test.js - took 0.058 ms]
[parsing function: sayHi - took 0.009 ms]
Hi Sparkle!
```

There's still some `d8` related logic that's not part of our actual program, but much less than if we were using Node. You can ignore most of the output.

When `test.js` is initially parsed the `sayHi` and `add` functions are only pre-parsed, making the intial script parse faster.

Then, when we call `sayHi`, the function is parsed fully.

Importantly `add` is never parsed fully. That both saves the parser time and reduces the memory consumption of V8.

If we append `add(1, 2)` to our JavaScript code this is the D8 output:

```
[parsing script: /Users/mattzeunert/test.js - took 0.608 ms]
[parsing function: sayHi - took 0.011 ms]
Hi Sparkle!
[parsing function: add - took 0.007 ms]
```

## What's the problem with lazy parsing?

Let's remove the unused `add` functions from the code above.

{% highlight javascript %}
function sayHi(name){
    var message = "Hi " + name + "!"
    print(message)
}

sayHi("Sparkle")
{% endhighlight %}

Output of `d8 --trace_parse test.js`:

```
// ...
[parsing script: /Users/mattzeunert/test.js - took 0.599 ms]
[parsing function: sayHi - took 0.011 ms]
Hi Sparkle!
```

First V8 pre-parses `sayHi`, immediately followed by a full parse. The pre-parse is unnecessary, and our program would run faster without V8's optimization attempts!

Ideally functions that are called right when the JS file is loaded should always be fully parsed, while for other functions pre-parsing is sufficient.

There is actually a heuristic in V8 where functions wrapped in parentheses are always fully parsed. For example, this applies to immediately invoked function expressions (IIFEs):

{% highlight javascript %}
var constants = (function constants(){
    return {pi: 3.14}
})()
{% endhighlight %}

```
$ d8 --trace-parse test.js

[parsing script: test.js - took 0.024 ms]
```

Note how there's no `parsing function: constants`.

## Micro-optimizing JavaScript code

Now let's say we want our `sayHi` example to run quicker. What can we do?

First, let's store `sayHi` as a variable rather than using a function declaration:

{% highlight javascript %}
var sayHi = function sayHi(name){
    var message = "Hi " + name + "!"
    print(message)
}

sayHi("Sparkle");
{% endhighlight %}

V8 is still pre-parsing `sayHi`, but we can prevent that by wrapping the function expression in parentheses.

{% highlight javascript %}
var sayHi = (function sayHi(name){
    var message = "Hi " + name + "!"
    print(message)
})

sayHi("Sparkle");
{% endhighlight %}

Even though it's not an IIFE V8 will apply it's heuristic to do a full parse from the start:

```
[parsing script: /Users/mattzeunert/test.js - took 0.029 ms]
Hi Sparkle!
```

## Optimize-JS

Rather than manually making these optimizations and making our code harder to read we can use a tool called [`optimize-js`](https://github.com/nolanlawson/optimize-js).

In practice a common cause of unnecessary pre-parses is that the minifier UglifyJS removes the parentheses from IIFEs to save bytes:

{% highlight javascript %}
(function(){
    console.log("hi")
})()
{% endhighlight %}

This becomes:

{% highlight javascript %}
!function(){console.log("hi")}();
{% endhighlight %}

That doesn't change the behavior of the code, but it does break Chrome's heuristic.

If you run `optimize-js` on the minified code above the parenthesis are restored: 

{% highlight javascript %}
!(function(){console.log("hi")})();
{% endhighlight %}

Incidentally, the [optimize-js readme](https://github.com/nolanlawson/optimize-js/blob/master/README.md) points out that Chakra, the JS engine used in Edge, is able to correctly detect the `!function(){}()` IIFE syntax and prevent pre-parsing.

That fact also points to one limitation of these optimizations: they depend on the implementation of the JavaScript engine. You can expect their effectiveness to decrease as JavaScript engines become more sophisticated at deciding when pre-parsing is a good idea.

## Are these optimizations worth the effort?

`optimize-js` has a few benchmarks showing impressive speedups around 20%. However, in Chrome on my laptop the actual improvement for a sample React app is only 6ms (script load time goes down from 24ms to 18ms).

The speedup will be more meaningful on slower devices. But not on iPhones: Safari's JavaScriptCore engine shows no improvement for the optimized script.

Most likely there are more impactful things you can do to improve your websites's performance. But if you've run out of ideas it's worth giving `optimize-js` a try and measue if it's a meaningful improvment.