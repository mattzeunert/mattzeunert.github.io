---
layout: post
title: Using CSS to animate element colors in an SVG image
date: 2014-10-24
---

Interactive UI elements can have different states that need to be communicated to the user. For example links change their styling on hover to tell the user that they have reached their mouse target and can now click on the element.

For image buttons or links this is normally done by putting several image states into one sprite image that contains hover and active states below the default state.

However, this means we can't use CSS to animate the icons and the only way to edit the hover state is to edit the image file.

CSS transitions and inline SVGs make it easy to animate the colors when the user hovers over the icon.

Below is an example from the [Shufflehub](https://shufflehub.com/) website. On hover on a category icon the line color changes from black to turquoise.

![](/img/blog/svg-animate/hover.png)
<br>
You can see that the color fades gradually as the user begins to hover over the icon.  
<br>
![](/img/blog/svg-animate/new-hover.png)

## Implementing the icon state changes

### Using inline SVGs

First of all we need some SVGs. SVGs are vector files, so rather than declaring pixel colors they list a bunch of elements and their attributes.

They look very similar to normal HTML:

{% highlight html %}
<svg x="0px" y="0px" width="200px" height="200px">
    <circle cx="60" cy="130" r="50" fill="none" stroke="#555" stroke-width="5"/>
    <polygon points="10,100 60,50 110,100"/>
</svg>
{% endhighlight %}

We don't want to use an image tag but instead but the SVG code directly into our HTML document. This is the result (try it on [jsFiddle](http://jsfiddle.net/zcds4axy/)):

![](/img/blog/svg-animate/svg-example.png)

### Updating icon styles on hover

For the most part we can style the SVG elements in the same way as normal HTML elements.

This CSS code adds a hover style. We identify the element's tag name and then specify what properties we want to update (fill and stroke respectively).

{% highlight css %}
svg:hover polygon {
    fill: green;
}
svg:hover circle {
    stroke: lime;
}
{% endhighlight %}

The icon is then highlighted when the user hovers over it.

![](/img/blog/svg-animate/example-on-hover.png)

If you only want to restyle parts of the SVG you can do that by adding classes to the SVG elements and singling them out them in the CSS selector.

### Animating the color transition

Like with other styling we can add a transition to the changed CSS of the SVG image.

{% highlight css %}
svg * {
    transition: all 0.5s;    
}
{% endhighlight %}

The code above acts as a catch all: every element inside the svg will be animated and all CSS properties will be updated gradually. In practice that means we don't have to specify the type of SVG component (poloygon, circle, ...) in the inline SVG or what the respective properties are (stroke and fill).

![](/img/blog/svg-animate/begin-hover-example.png)

Now when you start hovering on the icon the color animates towards the green value. [Try out the end result](http://jsfiddle.net/t32x1evu/).

## Browser support

All modern browser support both inline SVGs and transitions. IE8 however [doesn't support SVGs](http://caniuse.com/#feat=svg) and [IE9 won't show the transition states](http://caniuse.com/#feat=css-transitions).

## Using Grunt to concatenate SVG icons and save them as a Javascript file

Since the Shufflehub website uses a lot of category icons we don't load them individually but put them into a Javascript object during our Grunt build process (which also compresses the icons).

We use [Grunt ngTemplates](https://www.npmjs.org/package/grunt-angular-templates) for both our HTML templates and the SVG files. The website then loads the icons in the same Javascript file as the HTML templates and normal Javascript code.
