---
layout: nontechies
permalink: /web-development-for-non-techies/what-are-sass-and-less.html
title: What are Sass and Less?
group: nontechies-2000
prev: What is an API?
prevLink: /web-development-for-non-techies/what-is-an-api.html
---

CSS is the language that's used to implement the design of a website. However, today many developers rarely write CSS directly. Instead they use languages like [Sass](http://sass-lang.com/) or [Less](http://lesscss.org/) that are then translated into CSS.

Sass and Less code is easier to write, read and maintain than CSS.

Because browsers only understand CSS a program is used to automatically generate CSS based on the Sass or Less code developers write.

Sass and Less are also called **CSS preprocessors**.

## How do CSS preprocessors help write more maintainable code?

Using a preprocessor has three main benefits:

### Reusing values across the website

"**Variables**" make it possible to easily change a design property like a color or font size in different places across the site.

For example a website design is usually based on a color scheme where the same colors are used for different components on the site.

For example Youtube has a red color that is used throughout the site:

![Youtube Color Scheme](/img/non-techies/color-scheme.png)

With variables you can give the color a name (like "Main Brand Color") and then use that name when setting the color of a box, text or icon on the page.

Now, if the design changes only the value for "Main Brand Color" needs to be updated, rather than every place that uses that color.

### Mixins

"Mixins" are short and simple bits of code that become more complex when they are converted into CSS.

A common use case for mixins are **vendor prefixes**: newer browser features to have slightly different names in different browsers.

For example the "border-radius" CSS property adds rounded corners to UI elements. However older browsers don't support this property and instead have a browser specific name. In Firefox this is "-moz-border-radius", in Chrome "-webkit-border-radius" and in Opera "-o-border-radius".

Rather than repeating all these rules developers can use a mixin to do this for them. This Sass code could be used to set the border-radius of an element on the page:

{% highlight scss %}
    @include border-radius(8px);
{% endhighlight %}

The generated CSS that the browser can use would be longer than the Sass code:

{% highlight css %}
-moz-border-radius: 8px;
-webkit-border-radius: 8px;
-o-border-radius: 8px;
border-radius: 8px;
{% endhighlight %}

Now if the designers want to change how round the corners are the developers only need to update the value "8px" in one place rather than in 4 different places.

### More meaningful code structure

Preprocessors allow developers put styling rules for different pages or components into separate files. This makes it easier to navigate around the code base and find what you're looking for.

Sass and Less also allow **selector nesting**. [HTML has a nested structure](/web-development-for-non-techies/what-are-html-and-css.html). A page can contain a big box with some text in it. The text in turn can contain a link to another page.

CSS does not have a nested structure and preprocessors add this feature. Nesting makes it easier to group design rules that should only apply to a part of a website, for example a sidebar.

## What is the difference between Sass and Less?

Sass and Less have the same purpose. There are just two languages that solve the same problem. While they look different their functionality has a lot of overlap.

## What is Compass?

[Compass](http://compass-style.org/) is a tool that is used alongside Sass.

Sass allows developers to create mixins, but it doesn't provide any mixins itself. Compass provides a library of common mixins.

For example Compass provides mixins for different vendor prefixes, like the "border-radius" mixin above. It also makes it possible to generate different shades of a color and provides a way to improve image loading on websites (called "sprites").

## What is the difference between Sass and Scss?

Scss and are Sass are often used synonymously. They have the same features but use slightly different code formatting.

While I technically always work with Scss I usually say I work with Sass, simply because it's easier to say than S-C-S-S.


