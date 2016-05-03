---
layout: post
title: Stylesheet architecture and directory layout
date: 2014-01-10
---

Medium-sized Sass or Less codebases can become easily become messy and cause conflicts when styles are applied. 

## Folder structure

I generally use this directory structure for Sass projects:

- main
	- _elements.scss
	- _layout.scss
	- _variables.scss
- libs
- components
- mixins
- site.scss (includes all other files)

### The main folder

This folder contains site-wide styles, like the page layout, element styling (e.g. all links might be bold) and SassScript variables.

### Libraries

Plugin CSS code goes in the libs folder, for example for jQuery UI or a grid system.

### Components

These are elements that are used in various places throughout the site. For example styles for a carousel or specific table layout are put in this folder.

A page can also be a component. I used to have pages and components separate, but found that over time pages tend to turn into components.

I tend to use Angular directives for pages and components, so each directive has its own stylesheet.

### Mixins

For custom Sass or Less mixins - if any and they aren't specific to a component or section.

## Variables

The _variables.scss makes colors and widths globally adjustable.

I usually end up naming colors by their name (e.g. $green) rather than their function, since it tends to be tricky to find names that adequately describe the color's role. While this means that they might later contradict their meaning (e.g. the value of green might be "red") they do work very well in general as they are easily understood. Plus, colors like $white or $black are unlikely to lose their meaning.

## Namespaces and naming conventions

The code inside components is wrapped in a selector for the component. For example a carousel might look like this:

{% highlight css %}
.app-carousel {
	h3 {
		letter-spacing: 1px;
	}
}
{% endhighlight %}

This prevents collisions between different stylesheets declaring styles for h3 tags. The app prefix prevents collisions with the component name. (It's chosen based on the project name).

Global classes, for example to hide certain elements on small screens, also use the app prefix.

(For sections it is the same.)

Body classes are camelcase.

### CSS class prefixes

Component container classes have a project-specific prefix, so class names look like `abc-user-list`.
This means that there are no collisions between elements inside components and broader component styling.

*js-* Classes with names like js-carousel shouldn't be used for styling, and can't be removed without affecting behavior. (Angular mostly works around this with directives.)

*_* These are modifier classes, e.g. _green. They often share names (e.g. colors or _wide) and have no meaning without another class also being present.


