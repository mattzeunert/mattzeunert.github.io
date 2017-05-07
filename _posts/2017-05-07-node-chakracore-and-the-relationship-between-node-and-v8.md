---
layout: post
title: Node-ChakraCore and the relationship between Node and V8
date: 2017-05-07
---

I've been looking at the ChakraCore source code recently, and I realized that before I didn't have a good grasp of how JavaScript engines and browsers (or Node) actually relate to each other.

I'll try and explain that relationship in this post, and explain how Node-ChakraCore fits into the picture.

## What's the relationship between Node and V8

V8 is essentially an independent C++ library that's used by Node or Chromium to run JavaScript code. 

Similar to a JavaScript library, V8 exposes an API that other code can use. If you have a C++ program you can embed V8 in it and run JavaScript that way. That's what Node or Chrome do.

Embedders can access the values used inside V8, for example to add custom APIs. Chrome adds APIs for the DOM and Web Workers. Node allows programs to access the file system. Both provide `console` and `setTimeout` APIs. 

D8 is a minimal shell for running JavaScript programs using V8. It doesn't have APIs like `console.log` that JS developers are used to, instead it provides a minimal set of custom APIs. For example, you can use `print` to write logs to the console.

You can find the source code and full set of D8 commands [here](https://cs.chromium.org/chromium/src/v8/src/d8.cc?l=1546&rcl=dabdeb4d7d6bc090233f756d160a622be5266611). This is an example, adding the `print` function to the global object: 

{% highlight c++ %}
global_template->Set(
      String::NewFromUtf8(isolate, "print", NewStringType::kNormal)
          .ToLocalChecked(),
      FunctionTemplate::New(isolate, Print));
{% endhighlight %}

`Print` is defined further up in the `d8.cc` file:

{% highlight c++ %}
void Shell::Print(const v8::FunctionCallbackInfo<v8::Value>& args) {
  WriteAndFlush(stdout, args);
}

void WriteAndFlush(FILE* file,
                   const v8::FunctionCallbackInfo<v8::Value>& args) {
  WriteToFile(file, args);
  fprintf(file, "\n");
  fflush(file);
}
{% endhighlight %}

There's also a simpler [Hello World example](https://chromium.googlesource.com/v8/v8/+/branch-heads/5.8/samples/hello-world.cc) showing how to embed V8 in a C++ app.

## How does Node-ChakraCore fit into the picture

Node-ChakraCore allows you to run Node programs using ChakraCore as the JavaScript engine, rather than using V8.

However, the Node codebase depends on V8's APIs:

```
       V8 APIs
Node ==========> V8
```

Because of this, Node-ChakraCore needs to translate between the V8 instructions and ChakraCores's API. That's what ChakraShim does:

```
       V8 APIs                ChakraCore APIs
Node ===========> ChakraShim ==================> ChakraCore
```

This way, Node can use the V8 API without being aware that it's using ChakraCore under the hood.

## SpiderNode

[SpiderNode](https://github.com/mozilla/spidernode) is a project similar to Node-ChakraCode to run Node programs with Mozilla's SpiderMonkey JavaScript engine. Like Node-ChakraCore it provides a V8 interface that Node can use (SpiderShim).

