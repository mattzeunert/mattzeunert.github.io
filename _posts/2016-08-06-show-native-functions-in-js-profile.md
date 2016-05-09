---
layout: post
title: "Chrome DevTools: Show native functions in JS Profile"
date: 2016-08-06
---

Chrome has a setting that allows you to include native functions when running the profiler.

![Chrome DevTools Profiler settings](/img/blog/profile-native-functions/profiler-settings.png)

Native functions are part of the JavaScript language, rather than custom application code. Normally they are filtered out when viewing the call stack in the profiler, presumably because you 'd expect to only see code that's actually part of your application.

When capturing a call stack Chrome doesn't actually capture stack frames for functions that are written in C++. However, some native functions are actually [written in JavaScript itself](http://v8project.blogspot.co.uk/2016/02/v8-extras.html).

> V8 implements a large subset of the JavaScript language’s built-in objects and functions in JavaScript itself. For example, you can see our promises implementation is written in JavaScript. Such built-ins are called self-hosted.

If you enable the "Show native functions" setting Chrome will show these functions in the profiler output.

## A note on how the Chrome profiler works

To find out where your code is spending the most time, the profiler captures a stack trace every 100 μs.

This means that, if a function only takes 50 μs to execute, it may not show up in the profiler at all!

When profiling for more than a few milliseconds you'll get an accurate understanding of where your app is spending the most time. However, as you zoom in, the information becomes less accurate.

The profiler isn't consistent either. It will produce a slightly different result every time you run it. Sometimes a very short function call may be recorded, other times it may be missed.

For the purposes of this blog post I'm showing the profiles that are most convenient to demonstrate capturing native functions. When you run the code yourself the results may look different.

## Array.join

So let's try this out! This is the code I'm running:

{% highlight javascript %}
var arr = []
for (var i=0; i<1000; i++){
    arr.push(i)
}
console.profile("Array.join")
arr.join(",")
console.profileEnd("Array.join")
{% endhighlight %}

Select the "Chart" view in the profiler.

![](/img/blog/profile-native-functions/profiler-chart.png)

First, without "Show native functions" enabled:

![](/img/blog/profile-native-functions/array-join-no-native.png)

Then after enabling it:

![](/img/blog/profile-native-functions/array-join-native.png)

When we hover over the individual function call we can get a more detailed location in the source code.

![](/img/blog/profile-native-functions/array-join-more-exact.png)

We can now head over to the [Chrome code search](https://cs.chromium.org) and look for "array.js". The line number won't be exact though, since the code Chrome is running is likely slightly older than what you find on the Chromium master branch.

You can see that `ArrayJoin` is calling through to `InnerArrayJoin`:

{% highlight c %}
function ArrayJoin(separator) {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.join");

  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);

  return InnerArrayJoin(separator, array, length);
}
{% endhighlight %}

`InnerArrayJoin` calls `Join` which calls `DoJoin`.

`DoJoin` then calls `%StringBuilderJoin`, which is implemented in C++.

### Sparse Arrays

We're steering a bit off-topic, but I think it's quite fascinating how V8 deals with sparse arrays (`new Array(n)`).

![](/img/blog/profile-native-functions/join-sparse-arrays-profiled.png)

### Why is this useful?

What does this code do?

{% highlight javascript %}
arr = new Array(10000000)
for (var i=0; i<10000; i++){
    arr.push(i)
}
console.profile("arr + arr")
arr + arr
console.profileEnd("arr + arr")
{% endhighlight %}

It's not immediately clear. You don't normally perform an addition on two arrays. But for some reason some code I looked at recently did that.

Without being able to see native functions all you get is an anonymous function call.

![](/img/blog/profile-native-functions/array-add.png)

However, native functions reveal that a whole lot is going on. Chrome is stringifying the array by calling `join` on it.

![](/img/blog/profile-native-functions/array-add-native.png)

## Error().stack

Let's look at a different example. In JavaScript you can use `Error().stack` to obtain a stack trace at the currently running function.

Two separate things happen when we run that code. First we create a new `Error` object, then we access its `stack` property.

![](/img/blog/profile-native-functions/new-error-stack.png)

Obtaining the string version of the stack trace takes a significant amount of time.

I was able to speed up some code I was working on by obtaining an `Error` object, but only resolving its `stack` property when I wanted to display the stack trace.

### Inaccuracy

At the top of my post I mentioned how looking at small intervals gives inaccurate results. Just to illustrate that, here's another profile I captured running `Error().stack`.

`FormatErrorString` didn't show up in the previous example!

![](/img/blog/profile-native-functions/new-error-stack-2.png)

(The total execution time here is ~1ms, which means Chrome took 10 samples of the call stack. The example above took ~10ms because I called `Error().stack` 10 times in a loop.)
