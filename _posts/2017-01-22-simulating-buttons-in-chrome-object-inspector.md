---
layout: post
title: "Simulating buttons in Chrome's object inspector"
date: 2017-01-22
---

When building developer tools it's sometimes useful to let developers request more information about an object.

For example, imagine a tool that can calculate the sum of all property values for an object:

{% highlight javascript %}
var obj = {a: 4, b: 22}
obj.getSum()
// => 26
{% endhighlight %}

I've added a `getSum` function to `Object.prototype`, so you can now easily get this value.

However, in order to call `getSum` a two things are needed:

- A reference to the object in the console
- The user needs to know about the `getSum` function

Ideally we should just be able to calculate the value every time we inspect an object:

![](/img/blog/object-inspector-buttons/object-inspector.png)

To do that we can add a getter to `Object.prototype`:

{% highlight javascript %}
Object.defineProperty(Object.prototype, "sum", {
    get: function(){
        return this.getSum()
    }
})
{% endhighlight %}

Now when we view the object we'll see a sum property with an ellipsis. If we click the ellipsis the getter is invoked and the sum is calculated.

![](/img/blog/object-inspector-buttons/getter.png)

## Handling asynchronous values

While we can calculate the sum for the object synchronously, what happens if the response can't be synchronous? In that case a simple getter won't work.

However, we can still use a getter as a button and then print the asynchronous response to the console.

For example, [Object History Debugger](https://github.com/mattzeunert/Object-History-Debugger) adds an asynchronous `prettyPrint` function to certain objects. Because of this, the getter merely calls `prettyPrint` and then returns a message saying the response will apppear in the console.

{% highlight javascript %}
Object.defineProperty(PropertyHistory.prototype, "clickDotsToPrettyPrint", {
    get: function(){
        this.prettyPrint()
        return "See console, note that pretty print is asynchronous"
    },
    enumerable: true
})
{% endhighlight%}

![](/img/blog/object-inspector-buttons/click-dots.png)

Shortly after the user clicks on the ellipsis the requested information appears:

![](/img/blog/object-inspector-buttons/console-output.png)

This is a bit hacky, since the object inspector isn't designed to let you build a custom UI, but it works well enough.

## Asynchronous values without printing to the console

Printing to the console made sense for the example above, but if you'd rather keep the value in the inspector there is a way that sort of works.

We can return a new getter that the user needs to manually click until the response is ready. Because of the manual user interaction that's required I think this is only viable if the response becomes available in less than half a second. Otherwise the user would have to click again and again and again.

![](/img/blog/object-inspector-buttons/nested-getters.png)

Here's the code, even though the UX is pretty terrible:

{% highlight javascript %}
var obj = {}
Object.defineProperty(obj, "clickMe", {
    get: function(){
        var value = null;
        doAsyncThing(function(val){
            value = val
        })
        return waitFor(function(){
             return value
        })
    }
})

function waitFor(getValue){
    var waitForObject = {message: "Please wait"}
    Object.defineProperty(waitForObject, "checkIfReady", {
        get: function(){
            var value = getValue();
            if (value !== null){
                 return {value: value}
            } else {
                 return waitFor(getValue)
            }   
        }
    })
    return waitForObject
}

function doAsyncThing(callback){
    setTimeout(function(){
        callback(123)
    }, 2000)
}
{% endhighlight %}

Every time the user clicks `checkIfReady` we check if we have a result yet (`getValue`) and if yes we return the result. Otherwise we return another `waitForObject` with a `checkIfReady` getter.

## Custom Object Formatters

DevTools also has a feature called [Custom Object Formatters](http://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html) that gives you more control about how an object should appear in the console, although it still doesn't allow non-hacky interactivity.

The main reason I'm not using them is because they have to be enabled in the DevTools settings, and I didn't want that extra complication in the setup process for my tool.
