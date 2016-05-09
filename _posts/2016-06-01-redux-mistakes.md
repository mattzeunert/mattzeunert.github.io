---
layout: post
title: Two mistakes I made working with Redux
date: 2016-06-01
---

For the last six months, I've been working on a my first major project using React/Redux. I did a bunch of things wrong along the way.

This post will show two things I did wrong and how I could have used Redux more productively.

## 1) Using normalized data throughout the component tree

With Redux your store will generally contain normalized data. Your data might look like this:

{% highlight javascript %}
{
    posts: {
        10: {
            id: 10
            title: "Redux Mistakes"
            author: {id: 50}
        }
    },
    users: {
        50: {
            id: 50,
            name: "Matt Zeunert"
        }
    }
}
{% endhighlight %}

This is the equivalent denormalized data:

{% highlight javascript %}
{
    posts: [{
        title: "Redux mistakes",
        author: {
            name: "Matt Zeunert"
        }
    }]
}
{% endhighlight %}

It makes sense to store keep the store data normalized, since it avoids duplicating data.

If you update a user you only have to make the change in one place. The change then propagates to all posts that reference that user.

Where I screwed up was passing normalized data deep down into the component tree.

That meant I had to pass both the `post` and the `users` list as props into my `<Post>` component. This data needed to be passed through at every level of the component tree, from `<TopPostsPage>` to `<PostsList>` to `<Post>`.

As a result, changes to the data a component required were very tedious. To add data to a component I had to go through all parent components and add the new data as props.

### What I should have done

I should have denormalized my data inside `mapStateToProp`.

My components would have had direct access to the data they needed, rather than having to assemble the data themselves.

Denormalizing data in mapStateToProp instead of in the component's render method would also have made it easier to re-use denormalization code. The code could have been moved into selector functions and used in the `mapStateToProp` function of different components.

In addition to the amount of code required to pass data through the component tree, normalized data also makes it harder to fetch the data in the component's render method. To display the author of a post I have to do this with normalized data:

{% highlight javascript %}

users[post.author.id].name

{% endhighlight %}

Whereas if I denormalize the data first the access is simpler:

{% highlight javascript %}

post.author.name

{% endhighlight %}

## 2) Exporting action types and creators using ES6 named exports

Looking through the Redux documentation you will find code [like this](http://redux.js.org/docs/basics/Actions.html):

{% highlight javascript %}
export const ADD_TODO = 'ADD_TODO'

export function addTodo(text) {
  return { type: ADD_TODO, text }
}
{% endhighlight %}

This code uses the ES6 module syntax to export values that can then be imported individually:

{% highlight javascript %}

import {addTodo} from "./actions.js"

{% endhighlight %}

This has some advantages that [are mentioned](http://redux.js.org/docs/recipes/ReducingBoilerplate.html) in the redux docs. For example, if an action type is mistyped it will be obvious right away, since the imported value will be `undefined`. It also makes it easy to keep track of all available actions since they are explicitly listed.

In theory it also allows static import checking, since every exported value is explicitly defined. But, I suspect most projects don't currently take advantage of that.

I eventually found the suggested structure very limiting. A lot of my actions did similar things to different data types, e.g. `ADD_TODO`, `ADD_POST`, `ADD_USER`, ...

Using the ES6 export made it harder to split my code into different files, import all actions, and then re-export all of them in one go.

It also meant that even when I had written a re-usable generator function for common actions and action creators I still had to manually import them.

### What I should have done

My Redux logic was essentially  a database running on the front-end. I should have used some kind of ORM, either as a library or just writing my own generator logic from the start.

Rather than separating actions, action creators and reducers I ended up writing a generator function that can create all three at once.

I pass the name of the data type (e.g. "users") into the generator function. The generator function is then able to generate common actions like "add" and handle them in the reducer.

Where necessary I can still create my own custom action creators.

I can also add custom handler functions to the reducer, but often the generated handler will be enough.

I keep track of all action types I create, so I'm still able to do all of these things:

- See what actions and action creators are available
- Check that no reducer is trying to handle an action type that doesn't exist
- Check that no action creator is creating an action object with an unknown type

## General Advice

I'm happy with my Redux setup now, and I enjoy working with it. However, it took me a bunch of work to get there. Making how your app interacts with your data more explicit takes time.

It's easy to get carried away worrying about performance and purity. But I found React to be very fast, and re-running some data logic a few times didn't affect my app's performance in a noticeable way. Denormalizing data even when not strictly necessary made it easier to build my app.

For small projects it's also worth asking yourself if you really need Redux. Maybe some global state is enough. Doing a full app re-render might not be so bad, and you can still opt out selectively where appropriate.
