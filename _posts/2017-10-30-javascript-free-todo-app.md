---
layout: post
title: How to write a JavaScript-free todo app using just HTML and CSS
date: 2017-10-30
---

I wrote a todo app. Unlike [TodoMVC](http://todomvc.com/) (where I took the design from) it doesn't use JavaScript and instead all interactions are driven by CSS.

<div style="max-width: 500px;margin: auto;">
    <img src="/img/todo-css/todo-css.gif"/>
</div>

How does this work? Here's the short version: it uses a combination of pre-rendered HTML, the CSS sibling combinator (`~`), CSS counters, and the `:checked`, `:target` and `:required` pseudo selectors. The rest of this post will go into more detail.

[Try out the app](http://www.mattzeunert.com/TodoCSS/#/)  
[Read the full source](https://github.com/mattzeunert/CSS-Todo-App)

What works:

- Add new todo item (up to 50 items)
- Mark items as done
- Delete items
- Filter items (done/not done)
- Show number of items left to do
- Don't allow adding empty items

What doesn't work:

- Persistence after page reload
- Mark all as done
- Create item by pressing enter

## Contents

<!--
generate TOC with 
copy(Array.from($("h2")).map((h2) => `<a href='#${h2.id}'>${h2.innerText}</a>`).join("\n<br>"))
-->
<a href='#showing-and-hiding-content-with-the-checked-pseudo-selector'>Showing and hiding content with the :checked pseudo selector</a>
<br><a href='#applying-the-showhide-logic-at-a-larger-scale'>Applying the show/hide logic at a larger scale</a>
<br><a href='#filtering-todo-items-by-completedactive'>Filtering todo items by completed/active</a>
<br><a href='#appending-todos-at-the-bottom-when-the-input-is-at-the-top'>Appending todos at the bottom when the input is at the top</a>
<br><a href='#counting-how-many-items-are-left-to-do'>Counting how many items are left to do</a>
<br><a href='#preventing-the-user-from-creating-empty-items'>Preventing the user from creating empty items</a>
<br><a href='#could-you-implement-adding-todo-items-by-pressing-enter'>Could you implement adding todo items by pressing enter?</a>
<br><a href='#can-mark-all-as-done-be-implemented'>Can ‘mark all as done’ be implemented?</a>
<br><a href='#how-could-server-persistence-be-implemented-without-javascript'>How could server persistence be implemented without JavaScript?</a>
<br><a href='#closing-thoughts'>Closing thoughts</a>

## Showing and hiding content with the :checked pseudo selector

If our app should be interactive we need some way to store and modify state and then react to it in CSS. Normally that state would be in the HTML, but without JavaScript we can't modify the DOM stucture.

To get around that we can use a checkbox form field to store the state and then access that state using the `:checked` [pseudo selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes).

Here's a [simple example](https://codepen.io/anon/pen/yPLZpw):

{% highlight html %}
Toggle content: <input type="checkbox"></input>
<div id="content">
  Hello world!
</div>

<style>
  #content {
    display: none;
  }
  input:checked ~ #content {
    display: block;
  }
</style>
{% endhighlight %}

<img src="/img/todo-css/checkbox-toggle.gif"/>

The code also uses the CSS [general sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_selectors): `~`. It matches all following siblings of our checked input – in this case the div we want to show or hide. (The sibling selector does not match elements that appear in the DOM before the input element.)

Before going on, make sure you're also aware of the `for` attribute of the HTML `label` tag. It allows us to position the button that switches the checkbox state independently of the checkbox itself.

{% highlight css %}
<input type="checkbox" id="toggle-box"></input>
<label for="toggle-box">Toggle!</label>
<div id="content">
  Hello world!
</div>
{% endhighlight %}

## Applying the show/hide logic at a larger scale

Now that we have a way to store state we can build a todo app. Each todo item has three checkboxes to store:

1. whether the todo has been created
2. whether the todo has been marked as done
3. whether the todo has been deleted

#1 might give you a clue of how the todo app will work. Without JavaScript we have no way to modify the DOM. That means all todo items have to be part of the initial page HTML. If you view the source of the page you'll find it already contains 50 pre-rendered todo items.

CSS is used to show and hide parts of each todo item's.

The DOM is structured as follows: the first todo item contains all other todo items. The second todo item contains all todo items from the third item to the 50th.

```
.todo#todo-1
    input.created-checkbox
    .todo#todo-2
        input.created-checkbox
        .todo#todo-3
            ...
```

This is a partial screenshot of the full todo list HTML:

<div style="max-width: 500px;margin: auto;">
    <img src="/img/todo-css/todo-list.png"/>
</div>

An individual todo item looks like this:

![](/img/todo-css/todo-item.png)

Let's take a closer look at how deleting an item works. First of all we have a checkbox to store the `deleted` state:

{% highlight html %}
<input type="checkbox" class="deleted-checkbox" id="deleted-checkbox-3">
{% endhighlight %}

Then we have a label to delete the todo item:

{% highlight html %}
<label for="deleted-checkbox-3" class="deleted-checkbox-label">×</label>
{% endhighlight %}

If the checkbox is `:checked` we want to hide all parts of that item. But since each todo item contains all following todo items we have make sure to keep the next `.todo` visible.

{% highlight css %}
.deleted-checkbox:checked ~ :not(.todo) {
    display: none !important;
}
{% endhighlight %}

In order for this to be relatively easy the checkboxes are positioned first in the todo item DOM. Therefore all visible UI is matched by the `~` combinator which matching *following* siblings.

## Filtering todo items by completed/active

TodoMVC gives you the option to only view completed or uncompleted todo items. We could implement this using checkboxes as well, but there's a neater way using the URL hash.

The filter link looks like this:

{% highlight html %}
<a class="filter-active" href="#/active">Active</a>
{% endhighlight %}

When you click on the link the browser will scroll to the element with the id `/active`. But, more importantly, that element will now match the `:target` pseudo selector.

{% highlight html %}
<div id="/completed" class="completed-filter">
    <!-- Todo items -->
</div>
{% endhighlight %}

We can match the children that have been created but not yet marked as done and hide them.

{% highlight css %}
.completed-filter:target
    .created-checkbox:checked
    ~ .done-checkbox:not(:checked)
    ~ .todo-input {
    display: none !important;
}
{% endhighlight %}

So, in addition to checkboxes we can also store and access state in the URL!

## Appending todos at the bottom when the input is at the top

This is pretty simple. All todo items that have not been created are hidden, except for the last uncreated todo item whose parent has been created.

That last uncreated item is then moved to the top of the list with `position: absolute`, and it's "Add" button is shown.

## Counting how many items are left to do

CSS has a lovely feature called [Counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters). They let us count how many items matching a CSS selector exist.

We can use that to display how many todos are left to be done.
 
![](/img/todo-css/items-left.png)

Here's the full CSS:

{% highlight css %}
body {
    counter-reset: items-left;
}
.created-checkbox:checked
    ~ .deleted-checkbox:not(:checked)
    ~ .done-checkbox:not(:checked)
    ~ .items-left-counter-helper {
    counter-increment: items-left;
}
#items-left:before {
    content: counter(items-left);
}
{% endhighlight %}

We want to count items that:

- have been created
- have not been deleted
- have not been marked as done

Instead of counting `.items-left-counter-helper` couldn't we just count `.mark-undone-checkbox-label`? I tried that at first, but CSS counters don't count hidden elements, so the `items left` value was 0 when applying the completed filter (since all uncompleted items were invisible).

## Preventing the user from creating empty items

Again this works thanks to a pseudo selector: `:required`!

HTML has basic [form validation features](https://webdesign.tutsplus.com/tutorials/bring-your-forms-up-to-date-with-css3-and-html5-validation--webdesign-4738). For example, we can mark a text field as required:

{% highlight html %}
<input required type="text" value="" class="todo-input">`
{% endhighlight %}

We can then use CSS to check if the field has been filled out and thus has a valid value:

{% highlight css %}
input:not(:valid) ~ .created-checkbox-label {
    pointer-events: none;
}
{% endhighlight %}

With [`pointer-events`](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events) we can disable mouse interactions like clicking or hovering.

## Could you implement adding todo items by pressing enter?

This is how TodoMVC normally works, but since that's difficult to do I'm using an "Add" button instead.

However, I wonder if something like this could work:

- use a textarea and then validate it somehow when `\n` is entered
- use a font that hides the `\n` (only needed if todos are editable)

## Can 'mark all as done' be implemented?

This is tricky, because it either means flipping multiple checkboxes with one click, or having another checkbox that overrides the `done` value.

Creating multiple checkboxes with the same id doesn't work. You also can't nest `label` tags so that multiple checkboxes are targeted at once.

The latter option also isn't so simple, because newly created items should not be marked as done, or items could be marked as not done anymore.

## How could server persistence be implemented without JavaScript?

I wonder if this can be done. I had an idea, but then realized it won't work.

You could enable certain background images in CSS when items are created or modified. Then resulting image request would notify the server of the state change.

However, what's tricky is sending the input text, since we can't directly pass that as part of a background URL, and there are two many possible values to match against one by one.

My idea involved using CSS attribute selectors.

When the todo is created we can load a background image `todo-created.png`. The server now knows of the new todo item and wants to know it's contents. If our initial page HTML contains a large number of long polling `link` tags the backend can send down a stylesheet asking about the first character.

Suppose we had an alphabet that consisted of only "a" and "b". The `^=` selector matches an attribute starting with the specified string.

{% highlight stylesheet %}
input[value^='a'] { background-image: url('first-letter-is-a') }
input[value^='b'] { background-image: url('first-letter-is-b') }
{% endhighlight %}

If the first letter is "b" the backend would send something like this next time:

{% highlight stylesheet %}
input[value^='ba'] { background-image: url('second-letter-is-a') }
input[value^='bb'] { background-image: url('second-letter-is-b') }
{% endhighlight %}

And so on and so on, until the server knows every character the user entered.

Why did I say I used to think this might work? Because `input[value^='a']` matches the HTML attribute value starting with "a", no the actual input field value. Editing the name of the todo item does not change the attribute though.

## Closing thoughts

If you want you can look at the [source code](https://github.com/mattzeunert/CSS-Todo-App).

One interesting thing I realized is that the `~` combinator works really well to separate todo items in selectors.

When I started out I generated a lot of selectors like `deleted-checkbox-34` for each todo item, alongside with some respective CSS. The resulting CSS was pretty huge. But in the end I could [get rid of all of those index specific style rules](https://github.com/mattzeunert/CSS-Todo-App/blob/master/todo.css) and use just general selectors. Now I only use id's to target the checkbox labels.

Obviously you're not going to write a production code using mostly CSS. But it was a fun exercise and made me better understand some CSS features.