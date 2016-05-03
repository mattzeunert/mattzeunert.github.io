---
layout: post
title: Updating Flexslider settings after initialization
date: 2014-01-06
---

[Flexslider](http://flexslider.woothemes.com/) is a jQuery carousel plugin that transforms a list in the DOM tree into an interactive slider. 

## Changing Flexslider options after setup

Flexslider passes a slider argument to its handler function like `start` or `after`. This has a vars property that contains the values that were passed at initialization.

{% highlight javascript %}
$(element).flexslider({
	start: function(slider){
		console.log(slider.vars)
	}
})
{% endhighlight %}

You can now update some of the value, assuming they don't require immediate updates.

![Vars property](/img/blog/2014-01-06-flexslider-vars.png)

## Jumping to a different slide without animation

This allows us to disable transitions in the slider and move around without user-visible delays. We just set the `animationSpeed` to 0, move to the correct slide and then revert `animationSpeed` to the previous value:

	var animationSpeed = slider.vars.animationSpeed;
	slider.vars.animationSpeed = 0;
	slider.flexAnimate(0); // go back to the first slide
	slider.vars.animationSpeed = animationSpeed;

