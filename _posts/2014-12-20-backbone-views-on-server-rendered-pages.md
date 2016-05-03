---
layout: post
title: Using Backbone Views on server rendered pages
date: 2014-12-20
---

When developing a website with complex client-side functionality Backbone helps keep the source code maintainable. It's often used for single page apps where all content is rendered by JavaScript inside the browser.

Most apps however are still rendered on the backend initially, especially since it's advantageous for SEO.

This article describes a technique to link Backbone Views to their server rendered HTML elements and passing additional data into them.

## Initializing Views after loading the page

Your page probably consists of different components types with their own DOM structure and styling. If each component has a CSS class and a Backbone View you can connect the two and initialize a View instance for each time the component is used on the page.

This is an example for the type of configuration data that would be required:

{% highlight javascript %}

var componentTypes = [
    {
        selector: '.todo-item',
        view: TodoItemView
    }
];

{% endhighlight %}

Once the pages has finished loading you can bootstrap the views by iterating over all the component types, finding where the component is used on the page, and then creating an instance of the View for every component instance.

{% highlight javascript %}

// Initialize Backbone views for all component types
$.each(componentTypes, function(i, componentType){
    // Find all component instances by the component's selector
    $(componentType.selector).each(function(i, el){
        el = $(el);
        new componentType.view({el: el});
    });
});

{% endhighlight %}

### Improving this structure

The structure above has one drawback: it uses a centralized list of component types.

To avoid this issue a `registerComponent` function that appends the new view type can be added. After each declaration of a Backbone view `registerComponent` would be called with the view and DOM element selector.

## Passing data into the views

It's best to avoid passing data through the DOM to avoid essentially scraping the current page in JavaScript. Element attributes or classes also can't cleanly store more complex data or differentiate between different data types (e.g. the string "5" and the number 5).

The solution is to include a bit of JSON in the component code that contains the data needed for the View. This is the new DOM for the component:

{% highlight html %}

<div class="todo-item">
    <script type="text/data">
        {
            "id": 8934
            "votes": 20
        }
    </script>
    <!-- Component's HTML code goes here -->
</div>

{% endhighlight %}

The code for bootstrapping the views needs to be updated to retrieve the data from the DOM and forward it to the view instance:

{% highlight javascript %}

$.each(componentTypes, function(i, componentType){
    $(componentType.selector).each(function(i, el){
        el = $(el);
        // Get JSON data from the component
        var jsonData = el.children('script[type="text/data"]').html();
        var data = jsonData ? JSON.parse(jsonData) : {};

        // Pass parsed data object into the view, alongside the element
        new componentType.view($.extend({el: el}, data));
    });
});

{% endhighlight %}



Note that the code uses `el.children` rather than `el.find` - this allows for nested components/views.





