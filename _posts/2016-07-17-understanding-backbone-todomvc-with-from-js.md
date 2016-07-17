---
layout: post
title: Using FromJS to understand Backbone TodoMVC
date: 2016-07-17
---

I recently started working on a developer tool called [FromJS](http://www.fromjs.com/). The aim is to help developers learn about the codebase they are working with.

It's quite far from ready, but I've got a working [demo](http://www.fromjs.com/todomvc/) that you can use to learn more about how [Backbone TodoMVC](http://todomvc.com/examples/backbone/) works.

This post walks through that demo, to clarify the functionality and purpose of FromJS.

## Getting started

At the moment, FromJS lets you do precisely one thing: you can select a character from the page HTML and find out where that character came from in either the code or in any data loaded by the app.

Let's go through some examples.

## Where does the todo item data come from?

After loading the demo app you can see two todo items. To find out how the data for the todo items came from we can click on one of the items.

![Selected "Buy milk" todo item in FromJS](/img/blog/fromjs-demo/todo-item-selected.png)

FromJS selects the "B" character of "Buy milk" buy default and shows where it came from in a sidebar.

The selected HTML element is at the top of the sidebar, with the inspected character highlighted.

Below it you can see the path it travelled before it reached the screen.

The first item shows that the todo item data was originally loaded from localStorage using `localStorage.getItem`.

The last item shows how the string was added to the DOM, in this case by an `innerHTML` assignment in jQuery.

![FromJS sidebar showing "Buy milk" origin](/img/blog/fromjs-demo/sidebar-after-selecting-todo-item.png)

## Where does the label tag come from?

Selecting a character in the `<label>` tag allows me to see why that tag was created. It comes from a [script tag](http://stackoverflow.com/questions/4912586/explanation-of-script-type-text-template-script) in the index.html file.

!["b" character in label comes from index.html file](/img/blog/fromjs-demo/label-tag-origin.png)

I'm hiding a lot of steps between the template and the insertion of the code into the DOM.

It can sometimes be quite confusing to look at, but in this case there are two interesting bits of information we can get by looking at them.

### Finding where the template is read from the script tag

First of all, we can see where in the code the template is read from the `script` tag.

![Read innerHTML FromJS step](/img/blog/fromjs-demo/read-element-innerhtml.png)

This is happening in jquery.js, but by clicking the arrow in the top right we can see the full call stack.

In this case we can see the `$(el).html` call in todo-view.js that's used to get access to the template string (which is then passed into `_.template`).

![Full call stack and code inside todo-view.js](/img/blog/fromjs-demo/read-element-innerhtml-todo-view.png)

### Finding where Underscore converts the template string into a template function

Scrolling further down we can also see that at some point Underscore is parsing the template and using it to create a new dynamic function.

(The `new Function()` syntax is similar to calling `eval`.)

![Underscore creating a new function based on the template](/img/blog/fromjs-demo/dynamic-script.png)

## Where is "Buy milk" marked as done?

Each todo item in TodoMVC appears as an `<li>` tag in the DOM. It's hard to select the `<li>` tag by clicking on it, but we can navigate to it using the element up button.

![Going up the DOM tree](/img/blog/fromjs-demo/up-button.png)

By clicking on the class name we can see where the `<li>` tag was marked as completed. The class is added in todo-view.js if the view's model has been marked as completed.

![Completed class origin](/img/blog/fromjs-demo/completed-class-origin.png)

## Going beyond the demo

FromJS currently only works with a small subset of JavaScript features - the ones used by Backbone TodoMVC.

It'll take me a while to make it work for other apps. [Sign up for updates on the FromJS website](http://www.fromjs.com/).

If you have any thoughts or feedback please leave a comment or [create an issue on Github](https://github.com/mattzeunert/fromjs).
