---
layout: post
title: Proxy objects, symbols, and string conversions
date: 2016-07-20
---

Here's a fun bug I ran into.

I was trying to build a wrapper around a JavaScript string that allows me to see when methods are called on it or when a character at a specific index is accessed.

You can do that using an [ES2015 Proxy object](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

Proxy objects are worth reading more about, but fundamentally they let you intercept object property access on an object.

They're similar to `Object.defineProperty(obj, propertyName, {get: ...})`, but rather than specifying a `propertyName` in advance you pass in a function that handles access to any property on the object.

{% highlight javascript %}
var stringWrapper = {
    str: "Hello",
    toString: function(){
        return this.str
    }
};

var p = new Proxy(stringWrapper, {
    get: function(target, name){
        var nameIsCharacterIndex = !isNaN(parseFloat(name))
        if (nameIsCharacterIndex){
            return stringWrapper.str[name]
        }
        return stringWrapper[name]
    }
});

console.log("First character: ", p[0])
p + " world!"
{% endhighlight %}

Looking up the chracter works fine, but then I get an error:

```
First character:  H
VM4178:10 Uncaught TypeError: Cannot convert a Symbol value to a string
    at parseFloat (native)
    at Object.get (<anonymous>:10:43)
    at <anonymous>:19:3
```

What's going wrong here? I'm not using [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) in any way!

(Symbols are a special data type that you can use as an object property name, except it's not a string.)

This behavior is especially odd if we take a look at the call stack.

![Paused on parseFloat(name)](/img/blog/proxy-symbol-tostring/parse-float.png)

![Paused on p + " world!"](/img/blog/proxy-symbol-tostring/concatenation.png)

Somehow Chrome is doing an object property lookup, even though there isn't one in the code. I was getting the same behavior in Firefox.

## What's going on?

It turned out that the implicit conversion of the object to a string was the problem.

Writing `p.toString() + " world!"` works fine!

So what happens when Chrome tries to convert an object to a string? Let's log all property access on an object.

{% highlight javascript %}
var p = new Proxy({}, {
    get: function(target, name){
        console.log(name)
    }
})
p + ""
{% endhighlight %}

```
Symbol(Symbol.toPrimitive)
Proxy String:3 valueOf
Proxy String:3 toString
Proxy String:6 Uncaught TypeError: Cannot convert object to primitive value
```

It turns out that `toString` isn't the first thing Chrome tries when stringifying an object.

[Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) is particularly interesting.

Here's a list of steps a JavaScript engine goes through when converting an object to a string. It's based on the [ES2015 spec](http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive), but I've cut out the steps that aren't important to this article.

1. Let exoticToPrim be GetMethod(input, @@toPrimitive).
2. ReturnIfAbrupt(exoticToPrim).
3. If hint is "string", then
    a. Let methodNames be «"toString", "valueOf"».
4. Else,
    a. Let methodNames be «"valueOf", "toString"».
5. For each name in methodNames in List order, do
    a. Let method be Get(O, name).
    b. ReturnIfAbrupt(method).
    c. If IsCallable(method) is true, then
         i. Let result be Call(method, O).
         ii. ReturnIfAbrupt(result).
6. Throw a TypeError exception.

If you compare that to the console output above you can see that they match.

## Looking at the code

When investigating this issue I didn't actually run straight to the spec. First, I narrowed down the issue in my code by cutting chunks of it and seeing if the I kept getting the Symbol lookup.

After that I had a look at the [Chrome source code](https://cs.chromium.org/chromium/src/v8/src/objects.cc?q=CannotConvertToPrimitive&sq=package:chromium&dr=C&l=8072). The online UI makes it really easy to search and navigate.

A good starting point when looking at the Chrome code is an error message. Try searching for ["Cannot convert object to primitive value"](https://cs.chromium.org/chromium/src/v8/src/messages.h?q=%22Cannot+convert+object+to+primitive+value%22&sq=package:chromium&l=103&dr=C).

The main reason why I wanted to point out the source code is because I was surprised how remarkably similar it is to the spec.

Check out `OrdinaryToPrimitive`:

{% highlight cpp %}
MaybeHandle<Object> JSReceiver::OrdinaryToPrimitive(
    Handle<JSReceiver> receiver, OrdinaryToPrimitiveHint hint) {
  Isolate* const isolate = receiver->GetIsolate();
  Handle<String> method_names[2];
  switch (hint) {
    case OrdinaryToPrimitiveHint::kNumber:
      method_names[0] = isolate->factory()->valueOf_string();
      method_names[1] = isolate->factory()->toString_string();
      break;
    case OrdinaryToPrimitiveHint::kString:
      method_names[0] = isolate->factory()->toString_string();
      method_names[1] = isolate->factory()->valueOf_string();
      break;
  }
  for (Handle<String> name : method_names) {
    Handle<Object> method;
    ASSIGN_RETURN_ON_EXCEPTION(isolate, method,
                               JSReceiver::GetProperty(receiver, name), Object);
    if (method->IsCallable()) {
      Handle<Object> result;
      ASSIGN_RETURN_ON_EXCEPTION(
          isolate, result, Execution::Call(isolate, method, receiver, 0, NULL),
          Object);
      if (result->IsPrimitive()) return result;
    }
  }
  THROW_NEW_ERROR(isolate,
                  NewTypeError(MessageTemplate::kCannotConvertToPrimitive),
                  Object);
}
{% endhighlight %}

Thanks to [Gideon Pyzer](https://twitter.com/gidztech) for helping me debug this issue.
