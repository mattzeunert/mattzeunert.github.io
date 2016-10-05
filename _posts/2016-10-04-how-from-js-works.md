---
layout: post
title: How FromJS works
date: 2016-10-04
---

[FromJS](http://www.fromjs.com/) can find the JavaScript source that was used to create the DOM content.
This article will explain how that works.

We'll take a look at this example:

{% highlight javascript %}
var greeting = "Hello"
greeting += " World!"
document.getElementById("welcome").innerHTML = greeting
{% endhighlight %}

Inspecting the final body HTML lets us go back to the source code:

![](/img/blog/how-fromjs/hello.png)
<br/>
![](/img/blog/how-fromjs/world.png)

## Step 1: What are we looking at?

The user has selected an element from the DOM. Its outerHTML looks like this, and the "H" in "Hello World!" is selected.

{% highlight html %}
<div id="welcome">[H]ello World</div>
{% endhighlight %}

The outerHTML came about as the result of two things:

1. The `<div id="welcome"></div>` in the initial page HTML
2. The `innerHTML` assignment

Given that the user clicked on the "H" character it's pretty straightforward what we'll need to look at: the `innerHTML` assignment.

## Step 2: Finding out where the innerHTML value was set

In order to track where in the code the assignment happened we need to run some code every time `innerHTML` is updated.

This is possible by adding a property setter to the `innerHTML` property of `Element.prototype`.

{% highlight javascript %}
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function(html){
        console.log("Assigning html", html)
    }
})
document.body.innerHTML = "Hello" // logs "Assigning html Hello"
{% endhighlight %}

Now, the downside is that we are no longer actually updating the `innerHTML` of our element.

We want to call the original setter function in our own setter function. The details of a property -  such as its getter, setter or whether it is enumerable - are described in something called a property descriptor. We can obtain the descriptor of a property using `Object.getOwnPropertyDescriptor`.

Once we have the original property descriptor we can call the original setter method that updates the DOM.

{% highlight javascript %}
var originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML")
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function(html){
        console.log("Assigning html", html)
        return originalInnerHTMLDescriptor.set.apply(this, arguments)
    }
})
{% endhighlight %}

Now, in the setter we want to record some metadata about the assignment. We put that data into an `__elOrigin` object that we store on the DOM element.

Most importantly, we want to capture a stack trace so we know where the assignment happened. To create a stack trace we create an `Error` object and read its `stack` property.

{% highlight javascript %}
{
    set: function(html){
        this.__elOrigin = {
            action: "Assign InnerHTML",
            value: "Hello World!",
            stack: new Error().stack,
            inputValues: [html],
        }

        return originalInnerHTMLDescriptor.set.apply(this, arguments)
    }
}
{% endhighlight %}

Going back to the "Hello World!" code above we can now inspect the `#welcome` element and see where its `innerHTML` property was assigned:

{% highlight javascript %}
document.getElementById("welcome").__elOrigin
// Error
//    at HTMLDivElement.set [as innerHTML] (eval at evaluate (unknown source), <anonymous>:6:20)
//    at http://localhost:1234/example.js:3:46"
{% endhighlight %}

<!-- this.__ (fix Atom Markdown highlighting)-->

## Step 3: Going from "Hello World!" to "Hello"

We now have a starting point in our quest to find the origin of the "H" character in the `#example` div.

The metadata `__elOrigin` object above is the first step in our journey to the "Hello" string definition.

In our `__elOrigin` object we keep track of the value that was assigned. It's actually an array of `inputValues` - we'll see why later.

Unfortunately, our `html` value doesn't contain any metadata that tells us where it comes from. Let's change that!

This is a bit trickier than tracking the HTML assignments. We could try overriding the constructor of the `String` object, but unfortunately that constructor is only called when we explicitly run `new String("abc")`.

To capture a call stack when the string is created we need to make changes to the source code before it's run.

### Writing a Babel plugin that turns native string operations into function calls

Babel is mostly used to compile ES 2015 code into ES5 code, but you can also write your own Babel plugins that change your code in the way you want.

Strings aren't objects, so you can't store metadata on them. Instead of creating a string literal we want to create a wrapper objects for each string.

So, instead of running this:

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

Putting a string literal in the code is a bit verbose and generating code in Babel isn't much fun. So instead of generating an object literal we instead call a function that generates the object for us:

{% highlight javascript %}
var greeting = f__StringLiteral("Hello")
{% endhighlight %}

We do something similar for string concatenation. `greeting += " World!"` becomes `greeting = f__add(greeting, " World!")`. Or, since we're replacing every string literal, `greeting = f__add(greeting, f__StringLiteral(" World!"))`.

After this the value of `greeting` would be:

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

We can now trace back the character from the UI to the string literal. The user wants to inspect the "H" character in "Hello World!".

Our first step is the `innerHTML` assignment. It only has one input value - the `greeting` value above - so we can easily find out that the next step must be the string concatenation above.

The concatenation has two input values, "Hello" and " World!". We need to figure out which of them contains the "H" character, that is, the character at index 0.

This is not actually difficult. "Hello" has 5 characters, so the indices 0-4 in the concatenated string come from "Hello". Everything after index 4 comes from the " World!" string literal.

The `inputValues` array of our object is now empty, which means we've reached the final step in our origin path. This is what it looks like in FromJS:

![](/img/blog/how-fromjs/full-path.png)

### How do the string wrapper objects interact with native code?

If you actually tried running the code above you'd notice that it breaks the `innerHTML` assignment. When we call the native DOM, rather than setting the innerHTML content to the original string it's set to "[object Object]".

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

Now when we call code that's unaware of our string wrappers the calls will still (mostly) work.

### Call stacks and source maps

Because Babel modifies the source code, the line and column numbers in the captured call stack refer to the converted code, not the original code.

Luckily Babel generates a source map that lets us convert the call from to refer to the original code. FromJS uses [StackTrace.JS](http://www.mattzeunert.com/2016/07/07/resolving-minified-production-stacktrace.html) to handle the source mapping logic.

### Writing the Babel plugin

I won't go into too much detail about this, but the example below shoudl give you a basic idea.

Babel allows you to specify "visitors" for certain types in the JavaScript parse tree. The function below is called for every string literal that Babel finds in the original code.

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
