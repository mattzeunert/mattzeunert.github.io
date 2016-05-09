---
layout: post
title: Using FromJS to understand Backbone TodoMVC
date: 2016-07-17
---

I recently started working on a developer tool called [FromJS](http://www.fromjs.com/). The aim is to help developers understand the codebase they're working with.

It's far from finished, but I've got a working [demo](http://www.fromjs.com/todomvc/) that lets you learn more about how [Backbone TodoMVC](http://todomvc.com/examples/backbone/) works.

This post walks through that demo and clarifies the functionality and purpose of FromJS.

## Getting started

At the moment, FromJS lets you do precisely one thing. You can select a character from the page HTML and find out where that character came from. That can either be code, like a string literal in a JavaScript file, or a data source such as local storage.

Let's go through some examples.

## Where does the todo item data come from?

The demo app shows two todo items. We can click on one of them to find out where the data for it came from.

![Selected "Buy milk" todo item in FromJS](/img/blog/fromjs-demo/todo-item-selected.png)

FromJS selects the "B" character of "Buy milk" by default and shows its origin.

![FromJS sidebar showing "Buy milk" origin](/img/blog/fromjs-demo/sidebar-after-selecting-todo-item.png)

At the top is the selected HTML element, with the inspected character highlighted.

Below it you can see the path the character traveled before reaching the screen.

The first step shows that the todo item was originally loaded from localStorage using `localStorage.getItem`.

The last step shows how the string was added to the DOM, in this case by an `innerHTML` assignment in jQuery.

## Where does the label tag come from?

Selecting a character in the `<label>` tag lets you to see why that tag was created. It comes from a [script tag template](http://stackoverflow.com/questions/4912586/explanation-of-script-type-text-template-script) in the index.html file.

!["b" character in label comes from index.html file](/img/blog/fromjs-demo/label-tag-origin.png)

I'm hiding a lot of steps between the script template tag and the insertion into the DOM.

The steps can sometimes be confusing to look at, but in this case there are two interesting bits of information we can get by viewing all of them.

### Finding where the template is loaded

First of all, we can see where in the code the template is read from the `script` tag.

![Read innerHTML FromJS step](/img/blog/fromjs-demo/read-element-innerhtml.png)

This is happening in jquery.js, but by clicking the arrow in the top right we can see the full call stack.

The `$("#item-template").html` call in todo-view.js is used to get access to the template string (which is then passed into `_.template`).

![Full call stack and code inside todo-view.js](/img/blog/fromjs-demo/read-element-innerhtml-todo-view.png)

### Finding where Underscore parses the template

Scrolling further down we can also see that at some point Underscore parses the template and uses it to create a new dynamic function.

(The `new Function()` syntax is similar to calling `eval`.)

![Underscore creating a new function based on the template](/img/blog/fromjs-demo/dynamic-script.png)

## Why is "Buy milk" marked as done?

Each todo item in TodoMVC appears as an `<li>` tag in the DOM. It's hard to select the `<li>` tag by clicking on it, but we can navigate to it using the Element Up button.

![Going up the DOM tree](/img/blog/fromjs-demo/up-button.png)

By clicking on the class name we can see that the "completed" class was added to the `<li>` tag because the model's `completed` property was `true`.

![Completed class origin](/img/blog/fromjs-demo/completed-class-origin.png)

## Going beyond the demo

FromJS currently only works with a small subset of JavaScript features - the ones used by Backbone TodoMVC.

It'll take me a while to make it work for other apps. You can [sign up for updates on the FromJS website](http://www.fromjs.com/).

If you have any thoughts or feedback please leave a comment or [create an issue on Github](https://github.com/mattzeunert/fromjs).
