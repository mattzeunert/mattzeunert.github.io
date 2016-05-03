---
layout: nontechies
permalink: /web-development-for-non-techies/what-are-html-and-css.html
title: What are HTML and CSS?
group: nontechies-1000
prev: Mobile websites vs. apps
prevLink: /web-development-for-non-techies/mobile-websites-vs-apps.html
next: What is JavaScript?
nextLink: /web-development-for-non-techies/what-is-javascript.html
---

Together HTML and CSS define what a website looks like. HTML specifies the structure of a page and the text content it consists of. CSS specifies how the content is displayed visually, for example by setting colors and sizes.

## HTML

What does HTML code look like? Here's an example.

{% highlight html %}
<h1>What does HTML stand for?</h1>
<p>
    HTML stands for HyperText Markup Language.
    Learn more on <a href="http://en.wikipedia.org/wiki/HTML">Wikipedia</a>.
</p>
{% endhighlight %}

This is all the code that the browser needs to show this website:

![HTML demonstration](/img/non-techies/html.png)

You can see that the browser just takes the text in the HTML code and displays it on the websites.

What about the stuff in angle brackets? These are **tags** and they let developers group content into logical sections.

For example, the `h1` tag is used for the main (number 1) heading of a page. `p` stands for paragraph, containing a section of text that is shown in the body of the document.

The `a` tag is used for links, in this case directing the user to the Wikipedia page about HTML. The `href=` is called an **attribute** and it allows additional data to be added to the tag. In this case it contains the URL that is loaded when a user clicks on the link.

## CSS

CSS is used to implement a website's design.

Did you think the website above looked a bit old-fashioned? That's because it is unstyled and uses the default styling for the different tags. You can see that even though we didn't tell the browser to do it the heading is shown bigger than the paragraph.

With a bit of CSS we can make it look a little more modern - the "SS" in CSS stands for style sheets:

![CSS demonstration](/img/non-techies/css.png)

This is the CSS code that I used for that website. Note that it refers back to the tag names from the HTML code: h1, p and a.

{% highlight css %}
h1 {
    font-family: Arial;
    color: navy;
}
p {
    font-family: Arial;
}
a {
    color: navy;
}
{% endhighlight %}

After each tag name there is a list of design properties enclosed in curly braces.

First of all I've changed the font to "Arial" for both the heading and the paragraph.

The color for the heading and the link is set to navy. This styling applies to all tags on the page - if I add another link it will also be navy.

## Spend an hour playing around with HTML and CSS

HTML and CSS are the tools that are used to implement to specify the page content and design. It's worth spending an hour or two creating a simple website to get a feel for these two technologies.






