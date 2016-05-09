---
layout: post
title: How FromJS works
date: 2016-10-04
---

When inspecting a page with [FromJS](http://www.fromjs.com/) you can find the JavaScript code that's responsible for a particular part of the UI. This article explains how that works.

We'll take a look at this example. If you're on Chrome Desktop you can [try it online](http://www.fromjs.com/playground/#how-fromjs-works).

{% highlight javascript %}
var greeting = "Hello"
greeting += " World!"
document.getElementById("welcome").innerHTML = greeting
{% endhighlight %}

Inspecting the final body HTML leads us back to the source code:

![](/img/blog/how-fromjs/hello.png)

## Step 1: What are we looking at?

The user has selected an element from the DOM. Its outerHTML looks like this, and the "H" in "Hello World!" is selected.

{% highlight html %}
<div id="welcome">[H]ello World</div>
{% endhighlight %}

The outerHTML came about as the combination of two events:

1. The `<div id="welcome"></div>` in the initial page HTML
2. The `innerHTML` assignment in JavaScript

Since the user clicked on the "H" character in the tag content it's straightforward which event we'll need to look at in more detail: the `innerHTML` assignment.

## Step 2: Finding out where the innerHTML value was set

To track where in the code the `innerHTML` assignment happened we need to run some code every time `innerHTML` is updated.

This is possible by adding a property setter to the `innerHTML` property of `Element.prototype`.

{% highlight javascript %}
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function(html){
        console.log("Assigning html", html)
    }
})
document.body.innerHTML = "Hello" // logs "Assigning html Hello"
{% endhighlight %}

Now, the downside is that we are no longer actually updating the `innerHTML` of our element, because we overwrote the original setter function that did that.

We want to call this native setter function in addition to running our tracking code. The details of a property -  such as its getter, setter, or whether it's enumerable - are stored in something called a property descriptor. We can obtain the descriptor of a property using `Object.getOwnPropertyDescriptor`.

Once we have the original property descriptor we can call the old setter code in the new setter. This will restore the ability to update the DOM by assigning to `innerHTML`.

{% highlight javascript %}
var originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML")
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function(html){
        console.log("Assigning html", html)
        return originalInnerHTMLDescriptor.set.apply(this, arguments)
    }
})
{% endhighlight %}

Now, in the setter we want to record some metadata about the assignment. We put that data into an `__innerHTMLOrigin` property that we store on the DOM element.

Most importantly, we want to capture a stack trace so we know where the assignment happened. We can obtain a stack trace by creating a new `Error` object.

{% highlight javascript %}
{
    set: function(html){
        this.__innerHTMLOrigin = {
            action: "Assign InnerHTML",
            value: "Hello World!",
            stack: new Error().stack,
            inputValues: [html],
        }

        return originalInnerHTMLDescriptor.set.apply(this, arguments)
    }
}
{% endhighlight %}

Let's run the "Hello World!" example code from earlier after overwriting the setter. We can now inspect the `#welcome` element and see where its `innerHTML` property is assigned:

{% highlight javascript %}
document.getElementById("welcome").__innerHTMLOrigin.stack
// Error
//    at HTMLDivElement.set [as innerHTML] (eval at evaluate (unknown source), <anonymous>:6:20)
//    at http://localhost:1234/example.js:3:46"
{% endhighlight %}

<!-- 0__ (fix Atom Markdown highlighting) -->

## Step 3: Going from "Hello World!" to "Hello"

We now have a starting point in our quest to find the origin of the "H" character in the `#example` div. The `__innerHTMLOrigin` object above will be the first step in on this journey back to the "Hello" string declaration.

The `__innerHTMLOrigin` object keeps track of the HTML that was assigned. It's actually an array of `inputValues` - we'll see why later.

Unfortunately, the assigned value is a plain string that doesn't contain any metadata telling us where the string came from. Let's change that!

This is a bit trickier than tracking the HTML assignments. We could try overriding the constructor of the `String` object, but unfortunately that constructor is only called when we explicitly run `new String("abc")`.

To capture a call stack when the string is created we need to make changes to the source code before running it.

### Writing a Babel plugin that turns native string operations into function calls

Babel is usually used to compile ES 2015 code into ES5 code, but you can also write your own Babel plugins that contain custom code transformation rules.

Strings aren't objects, so you can't store metadata on them. Therefore, instead of creating a string literal we want to wrap each string in an object.

Rather than running the original code:

{% highlight javascript %}
var greeting = "Hello"
{% endhighlight %}

We replace every string literal with an object:

{% highlight javascript %}
var greeting = {
    value: "Hello",
    action: "String Literal",
    stack: new Error().stack,
    inputValues: []
}
{% endhighlight %}

You can see that the object has the same structure we used to track the `innerHTML` assignment.

Putting an object literal in the code is a bit verbose and generating code in Babel isn't much fun. So instead of using an object literal we instead write a function that generates the object for us:

{% highlight javascript %}
var greeting = f__StringLiteral("Hello")
{% endhighlight %}

We do something similar for string concatenation.

`greeting += " World!"` becomes `greeting = f__add(greeting, " World!")`. Or, since we're replacing every string literal, `greeting = f__add(greeting, f__StringLiteral(" World!"))`.

After this, the value of `greeting` is as follows:

{% highlight javascript %}
{
    action: "Concatenate String",
    value: "Hello World!",
    stack: `Error
            at f__add (http://localhost:1234/from.js:93754:22)
            at http://localhost:1234/example.js:2:12`,
    inputValues: [
        {
            action: "String Literal",
            value: "Hello"
            stack: `Error
                    at f__StringLiteral (http://localhost:1234/from.js:93709:22)
                    at http://localhost:1234/example.js:1:16`,
            inputValues: []
        },
        {
            action: "String Literal",
            value: " World!",
            stack: `Error
                    at f__StringLiteral (http://localhost:7500/from.js:93709:22)
                    at http://localhost:1234/example.js:2:29`,
            inputValues: []
        }
    ]
}
{% endhighlight %}

`greeting` is then assigned to our element's innerHTML property. `__innerHTMLOrigin.inputValues` now stores a tracked string that tells us where it came from.

## Step 4: Traversing the nested origin data to find the string literal

We can now track the character "H" character in "Hello World!" from the `innerHTML` assignment back to the JavaScript string literal.

Starting from the div's `__innerHTMLOrigin` we navigate through the metadata objects until we find the string literal. We do that by recursively looking at the `inputValues`, until `inputValues` is an empty array.

Our first step is the `innerHTML` assignment. It has only one `inputValue` - the `greeting` value shown above. The next step must therefore be the `greeting += " World!"` string concatenation.

The object returned by `f__add` has two input values, "Hello" and " World!". We need to figure out which of them contains the "H" character, that is, the character at index 0 in the string "Hello World!".

This is not actually difficult. "Hello" has 5 characters, so the indices 0-4 in the concatenated string come from "Hello". Everything after index 4 comes from the " World!" string literal.

The `inputValues` array of our object is now empty, which means we've reached the final step in our origin path. This is what it looks like in FromJS:

![](/img/blog/how-fromjs/full-path.png)

## A few more details

### How do the string wrapper objects interact with native code?

If you actually tried running the code above, you'd notice that it breaks the `innerHTML` assignment. When we call the native innerHTML setter, rather than setting the content to the original string, it's set to "[object Object]".

That's because `innerHTML` needs a string and all Chrome has is an object, so it converts the object into a string.

The solution is to add a toString method to our object. Something like this:

{% highlight javascript %}
document.body.innerHTML = {
    action: "String Literal",
    value: "Hello",
    toString: function(){
        return this.value
    }
}
{% endhighlight %}

When we assign an object to the innerHTML property, Chrome calls `toString` on that objects and assigns the result.

Now when we call code that's unaware of our string wrappers the calls will still (mostly) work.

### Writing the Babel plugin

I won't go into too much detail about this, but the example below should give you a basic idea of how this works.

Babel allows you to specify "visitors" for certain types in the JavaScript parse tree. The function below is called for every string literal that Babel finds in the source code.

{% highlight javascript %}
StringLiteral: function(path) {
    var originalString = path.node
    var call = babel.types.callExpression(
       babel.types.identifier("f__StringLiteral"),
       [originalString]
    )

    path.replaceWith(call)
}
{% endhighlight %}

### Call stacks and source maps

Because Chrome runs the compiled code rather than the original source code, the line and column numbers in the call stack will refer to the compiled code.

Luckily Babel generates a source map that lets us convert the stack trace to match the original code. FromJS uses [StackTrace.JS](http://www.mattzeunert.com/2016/07/07/resolving-minified-production-stacktrace.html) to handle the source map logic.
