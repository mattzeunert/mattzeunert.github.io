---
layout: post
title: Understanding the size of an object in Chrome/V8 
date: 2017-03-29
---

When looking at an object in a DevTools heap snapshot it's not always clear why an object has a certain (shallow) size.

The size of an object will depend on the JavaScript engine that's running your code. In Chrome that's V8, and this article will look at an object and explain it's size based on the implementation details of V8.

I've also made a [video](https://www.youtube.com/watch?v=Tdii56Whkdo) with basically the same content as this article. However the video doesn't have the section on object literals.

![DevTools heap snapshot](/img/blog/v8-object-size/heap-snapshot.png)


## A simple example, and a naive guess

Let's create a simple object. How much space do you think it will take up in memory?

{% highlight javascript %}
function Thing(){
    this.a = "a"
    this.b = "b"
}
window.oneThing = new Thing()
{% endhighlight %}

At a minimum V8 needs to store two references to `a` and `b`. So, how big is a reference? We need to point to an address in memory and on a 64 bit system we use 64 bits to point to a memory location. So we need 64 bits or 8 bytes to store a reference.

Since we have two references, we should expect the size of our object to be around 16 bytes.

To create this object V8 also needs to allocate two string objects. However, while the memory used to store the strings is counted towards the retained size of `oneThing`, they are not included in the shallow size.

## Measuring object size with the DevTools heap inspector

To measure how much memory is used to store an object we can use the Heap Inspector tool in the DevTools Profiles tab. (If you have a newer version of Chrome this tab might be called Memory.)

We can use the "Class filter" field to only show objects that were created using a constructor called `Thing`.

![Simple object in Chrome heapsnapshot, 140 bytes](/img/blog/v8-object-size/initial-object.png)

Turns out our `Thing` is more than six times larger than we expected, taking up 104 bytes. Why's that?

## How V8 optimizes default object sizes

When V8 creates a new object instance it has to decide how much memory to allocate. However, that's not so easy. While in a static programming language it's known in advance how many properties an object will have, dynamic languages like JavaScript are a little more tricky.

As a result V8 is quite generous when first allocating memory for a new object.

But as you create more objects V8 learns more about how much memory is actually necessary to store a `Thing`. After creating 8 objects V8 decides it has enough information and allocates a more reasonable amount of memory.

{% highlight javascript %}
// Create 7 more objects, so we have 8 in total
for (var i=0; i<7; i++) {
    window[i] = new Thing()
}
{% endhighlight %}

Running this code shrinks the size of each `Thing` down to 40 bytes.

![40 bytes after Chrome has information about objects with that constructor](/img/blog/v8-object-size/informed-default-size.png)

We still have a 24 byte difference, but that can be explained by three additional properties that are stored with each object.

## Hidden classes

Let's click on the arrow next to one of the `Thing` objects to see what values V8 says it stores on this object.

![The expanded item shows a Map property](/img/blog/v8-object-size/thing-expanded.png)

`a` and `b` are what we would expect. But what about `map` and `__proto__`?

Since JavaScript is a dynamic language it's possible to assign any property to any object. So the natural data structure for objects would be a dictionary, maybe implemented as a hash table.

However, that's not very performant. Rather than just having one object type V8 uses a concept called [hidden classes](http://richardartoul.github.io/jekyll/update/2015/04/26/hidden-classes.html) to give a type to each object. Internally, V8 refers to hidden classes as Maps.

What does a hidden class look like?

![Hidden class/map](/img/blog/v8-object-size/hidden-class.png)

There are a few things you can notice in this screenshot:

- A list of the object's properties is stored in `descriptors`
- The object ID (`@208315`) of the hidden class is the same for each `Thing` instance (but that doesn't always have to be the case, only if the `Thing` objects have the same properties and the properties were assigned in the same order)
- The hidden class stores a reference to the prototype, and the object ID is the same as for `__proto__`

Given that the hidden class already stores a reference to the prototype, what's the point of `__proto__`? I [don't think there is one any more](http://stackoverflow.com/questions/42224098/whats-the-meaning-of-proto-in-the-devtools-heap-snapshot#comment71666726_42224222) and it's not actually stored on the object.

So the hidden class accounts for another 8 bytes, and `__proto__` doesn't take any space directly on the object.

## Extra properties

Further up I talked about how V8 learns how much space is required to store an object with a certain constructor. But what if later on I add more properties to my `Thing` objects?

{% highlight javascript %}
window.oneThing.c = "c"
{% endhighlight %}

V8 doesn't have enough space to store the new value on the object. To avoid re-allocating the object and giving it more space V8 objects can have a `properties` property where additional values are stored.

![Thing has a property called properties](/img/blog/v8-object-size/extra-properties.png)

The reference to the object that stores the extra values takes up another 8 bytes. Only another 8 bytes left to go!

## Numeric elements 

Finally, V8 gives special treatment to numeric properties, such as used for array indices.

{% highlight javascript %}
window.oneThing[4] = "four"
{% endhighlight %}

Like extra properties, values at numeric indices are stored in a special `elements` object.

![Thing has a property called elements](/img/blog/v8-object-size/numeric-properties.png)

## Summary

We need space for 5 references on the object:

- a reference to the `a` string
- a reference to the `b` string
- a reference to the hidden class
- space for a reference to an extra properties object
- space for a reference to an elements object

5 references at 8 bytes each gives us a total object size of 40 bytes.

## How does this apply to object literals?

I've not read anything about how V8 handles object literal internally. However, I did play around in the console for a bit.

It seems that every empty object literal (`{}`) will be allocated 56 bytes. You can then add 4 property values to it until new property references will be stored in the `properties` value instead of directly on the object.

However, if your initial object literal already has some properties V8 will allocate just enough memory to store those properties. The shallow size of `{a: "a"}` will be 32 bytes, for `{a: "a", b: "b", ..., e: "e"}` it will be 64 bytes.

Creating multiple objects at the same place in the code does not bring down the object size. That means after running this each object still takes 56 bytes, rather than being shrunken down to 32 bytes:

{% highlight javascript %}
function makeObj(){
    var obj = {}
    obj.a = "a"
    return obj
}
for (var i=0; i< 100; i++) {
   window["o" + i] = makeObj()
}
{% endhighlight %}

If you'd like to do your own tests, I suggest wrapping the objects you create in another object with a named constructor, so you can search for it in the heap snapshot:

{% highlight javascript %}
var container = new (function Searchable(){})()
function makeObj(){
    var obj = {a: "a"}
    return obj
}
container.o = makeObj()
{% endhighlight %}

## More information

If you want to learn more about V8 object representation there's a [fantastic blog post by Jay Conrod](http://jayconrod.com/posts/52/a-tour-of-v8-object-representation).
