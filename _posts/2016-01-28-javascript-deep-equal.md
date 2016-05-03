---
layout: post
title: JavaScript deep object comparison - JSON.stringify vs deepEqual
date: 2016-01-28
---

Checking if two JavaScript objects are equal to see if you need to update the UI is a common task in React. (Ideally you wouldn't mutate your objects, but oh well.)

This post compares Node's [deepEqual](https://www.npmjs.com/package/deep-equal) with a `JSON.stringify` based comparison in terms of performance and behavior.

# Reference equality, shallow equality and deep equality

First of all, let's look at why we need a deep comparison instead of just using `===`.

In this example I'm using the [shallowEquals](https://github.com/hughsk/shallow-equals) and [deepEqual](https://www.npmjs.com/package/deep-equal) libraries. Since `deep-equal` on NPM requires a module loader I've used the [bower version](https://github.com/stutrek/node-deep-equal/blob/master/index.js) instead.

{% highlight javascript %}
user1 = {
    name: "John",
    address: {
        line1: "55 Green Park Road",
        line2: "Purple Valley"  
    }
}
{% endhighlight %}

This is the object we are going to compare against. 

{% highlight javascript %}

user2 = user1;
console.log("user1 === user2", user1 === user2);
console.log("shallowEqual(user1, user2)", shallowEqual(user1, user2));
console.log("deepEqual(user1, user2)", deepEqual(user1, user2));

// user1 === user2 true
// shallowEqual(user1, user2) true
// deepEqual(user1, user2) true

{% endhighlight %}

Since both `user1` and `user2` ultimately refer to the same object all our comparisons return true.

However, there are many cases where two objects have the same content but don't reference the same object.

{% highlight javascript %}
user2 = {
    name: "John",
    address: user1.address
}
console.log("user1 === user2", user1 === user2);
console.log("shallowEqual(user1, user2)", shallowEqual(user1, user2));
console.log("deepEqual(user1, user2)", deepEqual(user1, user2));

// user1 === user2 false
// shallowEqual(user1, user2) true
// deepEqual(user1, user2) true
{% endhighlight %}

Here the objects have the same data but are not referentially equal.

Finally, let's not directly re-use any references from `user1` and just re-type the same object literal.

{% highlight javascript %}
user2 = {
    name: "John",
    address: {
        line1: "55 Green Park Road",
        line2: "Purple Valley" 
    }
}
console.log("user1 === user2", user1 === user2);
console.log("shallowEqual(user1, user2)", shallowEqual(user1, user2));
console.log("deepEqual(user1, user2)", deepEqual(user1, user2));

// user1 === user2 false
// shallowEqual(user1, user2) false
// deepEqual(user1, user2) true
{% endhighlight %}

`shallowEqual` works by comparing each object property of the two users using `===`. That means that when it reaches the `address` object, it doesn't go deeper to compare the contents and relies on the two objects having the same reference.

As a result `shallowEqual` thinks the two objects are equal in the second example but not in the third.

`deepEqual` on the other hand goes deeper into the object when it reaches the address. It compares the strings for `line1` and `line2` with `===` and decides that the two objects are equal.

## Checking for equality with JSON.stringify

Another way to compare two objects is to convert them to JSON and check if the resulting strings are equal:

{% highlight javascript %}
function jsonEqual(a,b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
jsonEqual(user1, user2) // true in all three cases above
{% endhighlight %}

Like `deepEqual` this method cares about the contents of the object, rather than referential equality.

## Comparing the performance of JSON.stringify and deepEqual

I created a [performance comparison between `jsonEqual` and `deepEqual`](http://jsperf.com/object-deep-equal/4).

This was the result:

![deepEqual is 42% slower than a comparison with JSON.stringify](/img/blog/deep-equal-performance.png)

What a surprise! The reason I was using `deepEqual` was that I thought `jsonEqual` would be an order of magnitude slower. Turns out it's actually faster!

## Caveats to the performance comparison

However, on the whole it's still much better to use `deepEqual`. (It's only 42% slower anyway.)

There are two cases where `deepEqual` is faster than a JSON comparison.

1. if the two objects are referentially equal `jsonEqual` will still generate the two complete JSON strings. `deepEqual` on the other hand will immediately see that the two options are the same and [finish 8000 times more quickly](http://jsperf.com/object-deep-equal/5).

2. While `jsonEqual` is faster at confirming that two objects are equal, `deepEqual` is much faster at finding out that they aren't. As soon as it finds two properties that don't match up it returns `false`, rather than continuing to look for differences.

## Differences in behavior between the two methods

A big problem with `jsonEqual` is that it can report false negatives. For example it would say that these two objects aren't equal:

{% highlight javascript %}
jsonEqual({a: 1, b: 2}, {b: 2, a: 1}); // false
{% endhighlight %}

Deep equal is much more robust and doesn't rely on the ordering of the properties.

Another difference between the two methods is that `JSON.stringify` does not serialize functions.

{% highlight javascript %}
jsonEqual({a: 5, b: function(){}}, {a: 5}); // true
{% endhighlight %}

`deepEqual` will instead check for reference equality between a function and its counterpart in the other object.
