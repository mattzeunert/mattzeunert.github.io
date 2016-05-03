---
layout: post
title: Writing custom formatters for logged objects in Chrome
date: 2016-02-19
---

Custom object formatters give developers control over how objects appear in the debugger and console.

This is useful when working with libraries that wrap around a simpler data structure. For example, Immutable.JS Records or Backbone Models could both be logged as plain objects instead of their more complex representations.

## Enabling custom formatters

Chrome currently doesn't have custom formatters enabled by default. You need to enter the DevTools settings via the menu at the top right of the DevTools panel.

![Entering DevTools settings from the dropdown](/img/blog/custom-formatters/chrome-settings.png)

Then select "General" and enable custom formatters in the "Console" section.

![Custom formatters checkbox in Chrome](/img/blog/custom-formatters/custom-formatters-setting.png)

DevTools will now use custom formatters when displaying an object.

## Writing a simple formatter

Chrome looks for custom formatters in the `window.devtoolsFormatters` array. This array doesn't exist by default, so we need to create it.

{% highlight javascript %}
window.devtoolsFormatters = [{
    header: function(obj){
        return ["div", {}, obj.toString()]
    },
    hasBody: function(){
        return false;
    }
}]
{% endhighlight %}

The formatter itself is an object with up to three functions: `header`, `hasBody` and `body`.

In this example, we only want to show a static summary of the object.

Now, if you type `a = {}` into the console Chrome will log the value as `[object Object]`.`

Chrome passes the object into the `header` function of our formatter. It returns a [JsonML](http://www.jsonml.org/) `[tag-name, attributes, element-list]` tuple that is then converted into a DOM element.

`element-list` represents the content of the DOM element. In this case, it's simply a string, but it could also be another JsonML element.

We don't let the user expand the logged object, so our `hasBody` function returns `false`.

## Another example: writing a formatter for Backbone.Model

Normally a logged Backbone model looks something like this:

![Logged backbone model without custom formatters](/img/blog/custom-formatters/backbone-model.png)

The actual model data is hidden inside the `attributes` property. The following formatter can make the data easier to see:

{% highlight javascript %}
{
    header: function(obj){
        return ["div",{}, JSON.stringify(obj.attributes)]
    },
    hasBody: function(){
        return false;
    }
}
{% endhighlight %}

The model now shows up in the console like this:

![Logged backbone model without custom formatters](/img/blog/custom-formatters/backbone-model-custom.png)

However, all objects that aren't Backbone models now show up as `null`:

![window.Math shows up as null](/img/blog/custom-formatters/non-backbone-models.png)

We can fix this by returning `null` from the `header` function if the object isn't a Backbone Model. Chrome will then not use the custom formatter and instead fall back to the default representation of the object.

{% highlight javascript %}
header: function(obj){
    if (!(obj instanceof Backbone.Model)){
         return null;
    }
    return ["div",{}, JSON.stringify(obj.attributes)]
}
{% endhighlight %}

Now `window.Math` shows up correctly again:

![window.Math shows up as correctly again](/img/blog/custom-formatters/non-backbone-models-fixed.png)

## Formatter body and recursively displaying the object

Let's extend out formatter so we can expand the object tree.

This is the model we're logging:

{% highlight javascript %}
var model = new Backbone.Model({
    title: "Buy milk",
    author: {
        firstName: "John",
        lastName: "Smith",
        address: {
            line1: "55 Greenwood Street",
            city: "London"
        }
    }
})
{% endhighlight %}

And this is how it's going to appear in the console.

![Expandable Backbone Model](/img/blog/custom-formatters/backbone-model-formatter.png)

To achieve this we need to tweak the `header` function and add a `body` function to the object.

We also need to change the `hasBody` function to return `true`. This will make an arrow appear that lets the user expand the object. When the user clicks on the arrow the `body` function is called.

This is the full code, except for support for indentation of nested objects.

{% highlight javascript %}
window.devtoolsFormatters = [{
    header: function(obj, config){
        if (config && config.backboneModelFormatter){
            return ["div", {}, config.key]
        }
        if (!(obj instanceof Backbone.Model)){
             return null;
        }
        return ["div", {}, "Backbone Model with properties " + Object.keys(obj.attributes).join(", ")]
    },
    hasBody: function(){
        return true;
    },
    body: function(obj, config){
        if (obj instanceof Backbone.Model) {
            obj = obj.attributes;
        }

        var elements = Object.keys(obj).map(function(key){
            var child;
            var childObj = obj[key];
            if (typeof childObj === "object"){
                child = ["object", {
                    object: childObj,
                    config: {
                        key: key,
                        backboneModelFormatter: true,
                    }
                }];
            } else {
                child = key + ": " + childObj.toString();
            }
            return ["div", {}, child];
        })

        return ["div", {}].concat(elements);
    }
}]
{% endhighlight %}

Let's try and make sense of the `body` function. The first time `body` is called, `obj` will be the Backbone model and `config` will be undefined.

We then create a child element for each property in the model's attributes.

There are three kinds of child elements:

1. Strings
2. DOM elements
3. Child Objects 

If the child element is a string it will simply be used as the content of the HTML tag.

DOM elements work just like they did in the previous example. If the property value isn't an object we display the property name and value.

Child Objects are more interesting. They allow the user to gradually go deeper into the object tree.

A Child Object looks like this:

{% highlight javascript %}
["object", {
    object: obj,
    config: {}
}]
{% endhighlight %}

Before the Child Object is expanded the `object` is displayed using the `header` function. This if statement inside `header` handles that case:

{% highlight javascript %}
if (config && config.backboneModelFormatter){
    return ["div", {}, config.key]
}
{% endhighlight %}

The Child Object's `config` property is optional, but it lets us pass in additional data the we need to render the object's representation. In this case, we use it to pass in the `backboneModelFormatter` and `key` properties.

When the user clicks on the `header` representation Chrome calls the `body` function to expand it. We treat it just like the Backbone model, so any properties that are objects can again be expanded.

## Supporting indentation

[This Gist](https://gist.github.com/mattzeunert/a9a5aebc736f9f30e53f) shows the complete formatter code, including support for indenting nested objects.

Basically two things are happening:

- We add a `level` value with the config object to control the indentation level. Each time the user goes deeper into the Backbone model we increment the `level` depth.
- Based on the `level` we add a `margin-left` style to each child we return from the `body` function.

## Where Chrome uses custom formatters

Our formatter now correctly outputs the content of the Backbone Model.

In addition to the console, Chrome also uses custom formatters when hovering over variable names in the source code, and in the Watch and Scope panels.

![Custom formatters when hovering over variables](/img/blog/custom-formatters/source-code-hover.png)

![Custom formatters in the scope panel](/img/blog/custom-formatters/scope-panel.png)