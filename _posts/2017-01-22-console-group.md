---
layout: post
title: Using console.group to make logs more readable
date: 2017-01-22
---

When you're monitoring and logging a lot of values and events in your program, the output in the console can become difficult to read.

[console.group](https://developer.mozilla.org/en-US/docs/Web/API/Console/group) in Chrome let's you group and collapse a set of console messages.

To make sure your messages are collapsed before you start interacting with them use `groupCollapsed`.

{% highlight javascript %}
console.groupCollapsed("Animals")
console.groupCollapsed("Mammals")
console.log("Panda")
console.log("Horse")
console.groupEnd()
console.groupCollapsed("Birds")
console.log("Owls")
console.log("Pigeon")
console.groupEnd()
console.groupEnd()
{% endhighlight %}

![Expanding console grouped logs in Chrome](/img/blog/console-group/console-group-example.png)

You can't append new messages to a existing group of logs.

## In Firefox

Firefox doesn't support collapsing groups, but it still shows the messages as nested and grouped together:

![](/img/blog/console-group/firefox.png)
