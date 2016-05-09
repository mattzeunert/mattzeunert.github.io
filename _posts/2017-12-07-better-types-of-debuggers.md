---
layout: post
title: Better types of debuggers
date: 2017-12-07
---

<style>
@media screen and (max-width: 600px) {
    img {
        max-width: 100% !important;
        margin: 0 !important;
    }
    #intro {
        margin-bottom: 10px !important;
    }
}
</style>

<img style="float: right;
    max-width: 370px;
    margin: 10px;" src="/img/blog/types-of-debuggers/better-debuggers.png" id="intro"/>

It would be nice to have better debuggers.

Today debuggers tell you the state of your program at a given point in time. They are value-aware.

But I want to know the origin of my values. How was this string constructed? How was this number calculated? Where was this property assigned?

Ideally, the debugger should tell me why a value is what it is. What code affected it, and why isn't it what I expect?

## An example

What can the debugger tell me when it hits the breakpoint at the end of this script?

{% highlight javascript %}
 1| let greeting = "Good"
 2| 
 3| if (new Date().getHours() > 18) {
 4|    greeting += " night!"
 5| } else {
 6|    greeting += " day!"
 7| }
 8| 
 9| console.log(greeting)
10| debugger
{% endhighlight %}

### Value-aware debugger

Tells me:
- `greeting` has the value `"Good night!"`.

Here's a screenshot from Chrome DevTools:

<img src="/img/blog/types-of-debuggers/value-aware-debugger.png" style="max-width: 300px;" />

### Origin-aware debugger

Tells me:
- `greeting` was constructed by concatenating `"Good"` and `" night!"` on line 4
    - `"Good"` comes from a string literal on line 1
    - `" night!"` comes from a string literal on line 4

If you're working with an object that has the wrong data, an origin-aware debugger can show you where in the code the API to fetch the data was made.

You can inspect an HTML server response and and see what code rendered the element you're looking at.

I tried to build [something like this](http://www.fromjs.com/) last year. It didn't work too well though – turns out building JS debuggers should be done at the JS engine level, not inside the JS code itself.

<img src="/img/blog/types-of-debuggers/origin-aware-debugger.png" style="max-width: 500px;" />

Just having a debugger that lets you [step backwards](http://www.mattzeunert.com/2016/12/22/vs-code-time-travel-debugging.html) would be a good start.

### Cause-aware debugger

Tells me:
- `greeting` is `"Good night!"`
  - because the if statement on line 3 evaluated to true
    - because `new Date().getHours()` evaluated to 21

Doing this is more tricky.

Suppose I'm expecting `"Good day!"` instead of `"Good night!"`. Looking at the origin of `"night"` is likely misleading. In a real application, `"night!"` will be created in a completely different place from where the faulty concatenation happens. And the concatenation itself could be far from the if statement I need to fix.

But the debugger could try to figure out what went wrong.

If I tell the debugger what I was expecting, it can toggle all conditions in the path of the string construction and see if any mutation will result in the correct value.

The debugger can also look at diffs of previous execution history and tell me where execution diverged. For example, there might be logs from the last time my code ran successfully.

So while this isn't straightforward, it still sounds worthwhile.