---
layout: nontechies
permalink: /web-development-for-non-techies/what-is-an-api.html
title: What is an API?
group: nontechies-1000
prev: Front-end vs. backend
prevLink: /web-development-for-non-techies/front-end-vs-backend.html
next: What are Sass and Less?
nextLink: /web-development-for-non-techies/what-are-sass-and-less.html
---

The term API is used to describe several related concepts. Their shared characteristic is that they allow different systems to interface with each other.

This article focusses on REST APIs that allow a client to exchange data with a server over the network.

## What is a (REST) API?

Normally web servers return HTML that contains the text that is displayed on the page and the basic page structure. APIs however only return the data and leave the presentation up to the client.

For example, when you're reading a blog post and then move on to a different one the new page has the same header and page structure. The only things that are different are the post title and body text.  
Instead of providing the entire HTML code for the page an API would only return the title and text of the blog post.

This is what an API response in the common **JSON** data format would look like:

{% highlight json %}
{
    "title": "My big red velvet cake adventure",
    "bodyText": "I discovered some beautiful red velvet cake..."
}
{% endhighlight %}

## Why build an API?

The most common reason for a website to have an API is because it allows pages to fetch new data from the server instead of requesting an entire new page. This JavaScript feature to load additional content from the server is called **Ajax**.

As an example, this could be used to implement a "Load More" button. Since the structure of the content is already known only additional data needs to be retrieved from the API and added to the page.

APIs can also be used to allow different systems to integrate. For example the Twitter API lets developers to retrieve recent tweets by an account. While Twitter's HTML pages are tied to Twitter's design the API response is much less likely to change over time.

