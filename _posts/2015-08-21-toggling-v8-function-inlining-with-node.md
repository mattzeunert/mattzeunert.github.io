---
layout: post
title: Toggling V8 function inlining with Node
date: 2015-08-21
---

Function inlining means that the content of a function is copied and placed inside the body of the calling function. This makes the code run faster and is done automatically when JavaScript code is converted to machine code.

The V8 JavaScript Engine (which is used by Chrome and Node) supports function inlining as one of many types of optimization. This post demonstrates the effect of function inlining.

As an hypothetical example we're going to calculate the sum of 2 and 5 over and over again. One billion times:

{% highlight javascript %}

    function add(a,b){
      return a + b;
    }
    function calculateTwoPlusFive() {
       var sum;
       for (var i=0;i<=1000000000;i++){
           sum = add(2,5);
       }
    }

    var start = new Date();
    calculateTwoPlusFive();
    var end = new Date();
    var timeTaken = end.valueOf() - start.valueOf();
    console.log("Took " + timeTaken + "ms");

{% endhighlight %}

When I run this with `node calc.js` on my machine it takes 444ms.

Function inlining internally rewrites the code to get rid of the call to `add` inside calculateTwoPlusFive:

{% highlight javascript %}
function calculateTwoPlusFive() {
   var sum;
   for (var i=0;i<=1000000000;i++){
       sum = 2 + 5;
   }
}
{% endhighlight %}

This optimization makes the code a lot faster.

You can see how much faster by passing the `--nouse_inlining` flag to Node:

    node --nouse_inlining calc.js  

Now doing the calculation takes 3.7s, almost 10 times as much as when V8 uses inlining.
