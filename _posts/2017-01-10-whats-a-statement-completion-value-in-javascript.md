---
layout: post
title: What's a statement completion value in JavaScript?
date: 2017-01-10
---

Paul Irish posted a question [on Twitter](https://twitter.com/paul_irish/status/818568243350630401) yesterday.

![](/img/blog/statement-completion-value/paul-irish-tweet.png)

Instead of `"omg"` you'd expect the resulting value to be `undefined`, since that's what `var x = 4` evaluates to.

Brandan Eich, the creator of JavaScript, [answered the question](https://twitter.com/BrendanEich/status/818570098998800388):

![](/img/blog/statement-completion-value/brendan-eich-tweet.png)

But why does it matter that it's a statement completion value rather than a return value?

## What is a statement completion value?

Intuitvely, a statement completion value is what you get when evaluating a chunk of code, for example in the console:

![](/img/blog/statement-completion-value/statement-completion-values-in-the-console.png)

In practice, the only way to access a statement completion value within JavaScript is through the return value of an `eval` call:

![](/img/blog/statement-completion-value/eval.png)

However, statement completion values aren't just plain JavaScript values. Instead JavaScript engines have a [Completion type](http://www.ecma-international.org/ecma-262/6.0/#sec-completion-record-specification-type) that acts as a wrapper around the completion value.

In addition to normal JavaScript values the Completion type is able to store an `empty` value. For example, variable statements complete with `empty`. But `empty` isn't part of the JavaScript language, so `eval("var a")` returns `undefined` instead of `empty`.

To understand the code at the top of the post we need to look at how statement lists handle this special `empty` type.

## How do statement lists behave?

This is what the [spec](http://www.ecma-international.org/ecma-262/6.0/#sec-block-runtime-semantics-evaluation) says about the completion value of a list of statements:

<p style="background: #fafafa; padding: 10px;padding-left: 30px;">
The value of a StatementList is the value of the last value producing item in the StatementList. For example, the following calls to the eval function all return the value 1:<br><br>
<code>eval("1;;;;;")</code><br>
<code>eval("1;{}")</code><br>
<code>eval("1;var a;")</code>
</p>

`eval("1;;;;;")` consists of an expression statement (`1;`) and 4 empty statements (`;;;;`). Empty statements complete with (big surprise) `empty`. That means `1;` is the only statement that produces a non-empty value. Therefore it's also the last value producing item and the statement list completes with the value `1`.

In the second example from the spec it may look like it should return an empty object. However, the `{}` actually represents an empty block statement, which also completes with `empty`.

Finally, the last example is very similar to what we saw at the top of the post.

`"omg"; var x = 4;` is a statement list with two statements. Since the completion values are `"omg"` and `empty`, the code evaluates to `"omg"` as the last non-empty value.

## Changes in ES2015

ES2015 has changed the completion values of some statements. Here's an example comparing current Chrome and Firefox.

![](/img/blog/statement-completion-value/es2015-chrome-firefox.png)

Firefox follows ES5 rules where the completion value of the if statement is the completion value of the block statement. In this case the block statement is empty, so `"Hi"` is the last non-empty value.

However, this behavior has [changed](http://www.ecma-international.org/ecma-262/6.0/#sec-if-statement-runtime-semantics-evaluation) and if statements in ES2015 always complete with `undefined`. As the screenshot shows, Chrome seems to have implemented this change.

Here's [some more background on completion changes in ES2015](http://wiki.ecmascript.org/doku.php?id=harmony:completion_reform).