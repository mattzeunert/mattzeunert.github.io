---
layout: nontechies
permalink: /web-development-for-non-techies/what-is-javascript.html
title: What is JavaScript?
group: nontechies-1000
prev: HTML and CSS
prevLink: /web-development-for-non-techies/what-are-html-and-css.html
next: Front-end vs backend
nextLink: /web-development-for-non-techies/front-end-vs-backend.html
---

HTML and CSS define how the website looks like. JavaScript can be used to make changes to the HTML code without reloading the page.

The "without reloading the page" bit is important here. The server that runs the website can always send different HTML with the next request, but JavasScript allows HTML changes to happen without a page reload.

The reason page refreshes are avoided is because they take time and prevent the user from further interacting with the page. This matters especially if the user interacts a lot with the page, imagine for example ticking off several items on a Todo list.

Below are some examples of functionality that requires JavaScript to implement.

## Changing text on the page

Facebook's "Like" button changes to "Unlike" when the user clicks on it:

![Javascript Facebook Like](/img/non-techies/javascript-facebook-like.png)

## Calculating a value

Image a checkout form selling 10 items for $2, giving a total of $20.

Now the customer updates the number of products they want to buy to 20. JavaScript allows a website to

1. Detect this change
2. Multiply the new number of products by the price per item
3. Update the text inside of the HTML tag for the total price

## Implementing a "Load More" button

When viewing a long list it is often easier and more efficient to start by only showing the first few items.

JavaScript makes it possible to build a "Load More" button that loads more items dynamically and appends them to the existing list.

Similarly **infinite scrolling** can also be implemented using JavaScript. Infinite scrolling means that the website automatically loads more content when the user reaches the bottom of the page.

## The role of triggers

These are just a few simple examples of what is possible with JavaScript.

You may have noted a pattern: JavaScript code is often triggered by a user interaction.

The most common trigger is a mouse click. There's a "Post Comment" button and after writing their comment the user clicks on it.

There are also other user interaction based triggers like keys being pressed or the cursor moving across the page.

On touch devices triggers can be when the user starts or stops touching the screen.

JavaScript can be used to attach actions to these triggers. In the Facebook Like example the user clicks on the "Like" button and the associated action is to save this information on the Facebook servers and change the text to "Unlike".

In addition to user interaction JavaScript supports two other types of triggers:

- Timed triggers, for example to update a clock every second
- Network triggers, for example when after Facebook confirms that the Like has been saved
