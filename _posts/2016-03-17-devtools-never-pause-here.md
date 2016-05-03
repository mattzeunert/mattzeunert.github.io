---
layout: post
title: "Chrome DevTools: Never Pause Here"
date: 2016-03-17
---

The "Never Pause Here" feature can prevent Chrome's JavaScript debugger from pausing on the same line again and again.

This makes it easier to work with behavior-based breakpoints and provides a way to temporarily disable `debugger` statements.

## How to use Never Pause Here

To tell Chrome to never pause on a specific line, right-click on the line number and select "Never pause here":

![Never Pause Here](/img/blog/never-pause-here/context-menu.png)

A new orange breakpoint will appear:

![New "Never Pause Here" breakpoint](/img/blog/never-pause-here/after-selecting-never-pause-here.png)

Now click the Resume button and the debugger will stop pausing on that line.

## Never Pause Here when working with behavior-based breakpoints

Behavior-based breakpoints (Chrome calls them [conditional breakpoints](https://developers.google.com/web/tools/chrome-devtools/debug/breakpoints/add-breakpoints?hl=en#create-conditional-breakpoints)) allow you to pause execution when certain events occur in the browser:

- An exception is thrown
- The DOM is modified
- A DOM event is triggered (e.g. when the user click on a button)
- An Ajax request is made

However, in a more complex application some of these events are likely to occur quite frequently.

For example, you can tell Chrome to pause on all exceptions, including ones that are inside a `try...catch` block.

(Ideally you only want to pause on uncaught exceptions. Unfortunately sometimes the original error is caught by a template engine, UI framework or test runner and it's not possible to pause in the right place.)

You should avoid using exceptions for normal code flow, but sometimes it can save time and make development easier.

This function determines whether the string that's passed into it represent a valid JSON object.

{% highlight javascript %}
function isJSON(string){
    try {
        JSON.parse(string);
        return true;
    } catch (err) {
        return false;
    }
}
{% endhighlight %}

If `JSON.parse` doesn't throw an error we know the string is valid JSON. If it does throw an error we know it's invalid.

However, with "Pause on all exceptions" enabled, Chrome will pause every time you call `isJSON` with a non-JSON string.

Since this makes it difficult to find the genuinely buggy code you can tell Chrome not to pause when that particular line throws an exception:

![Never pause on a particular caught exception](/img/blog/never-pause-here/pause-on-caught-exceptions.png)

You can then continue execution and wait until Chrome reaches the correct breakpoint.

Try it with this [demo code](https://github.com/mattzeunert/devtools-never-pause-here-demo), or watch this [screencast](https://youtu.be/f3ft1dvauEs).
