---
layout: nontechies
permalink: /web-development-for-non-techies/front-end-vs-backend.html
title: Front-end vs. backend
group: nontechies-1000
prev: What is JavaScript?
prevLink: /web-development-for-non-techies/what-is-javascript.html
next: What is an API?
nextLink: /web-development-for-non-techies/what-is-an-api.html
---

When working with developers you will often hear the terms fron-end and backend. What is the distinction between them?

**Front-end** code is run in the browser (on the visitor's computer). All HTML and CSS is front-end code.

**Backend** code is run on the web server (owned by the organization running the website). Common backend programming languages are PHP, Ruby, Python and Java.

The server is centralized and can communicate with several clients. It can be used to store data it receives from clients and then allow other clients to access it. (For example, in a commenting system under a blog post.)

Front-end code is also called client-side code, backend code is server-side code.

**Full-stack** developers work on both front-end and backend code.

## HTML is generated on the backend and run on the front-end

When you load a web page the browser contacts the server for that web address

To load a page the user's browser sends a request to the server on the backend. The server responds with an HTML document that can be displayed in the browser.

This process usually involves the use of **templates** on the server. Templates allow developers to reuse HTML code they've writting before. For example the header of the website will always look the same and the header template can be included in the HTML code of all other pages.

Templates also allow for incorporating data into the HTML before sending it to the client. For example the title of a blog post could be automatically inserted into the correct place. The same could be done with the post body and author name, since these will always appear in the same place for each blog post.

![HTML generation on the server](/img/non-techies/server.png)

Why is HTML front-end code even though it's generated on the server? The reason is that it only matters where the code is run. HTML, CSS and JavaScript are all fetched from the server but ultimately run in the browser.

## Is JavaScript front-end code?

Most of the time JavaScript is front-end code, although it can be both.

The JavaScript language was originally created to allow richer user interaction in the browser.

With the success of the web more and more developers started using JavaScript. This made JavaScript more attractive as a backend language since developers were already familiar with it.  
Developing the front-end and backend using the same programming language can make development easier and allow code to be reused.

The system that allows JavaScript to run on the server is called **Node.JS**.
