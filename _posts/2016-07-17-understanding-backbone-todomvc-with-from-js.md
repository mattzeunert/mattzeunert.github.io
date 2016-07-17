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
