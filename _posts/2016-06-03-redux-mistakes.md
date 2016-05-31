---
layout: post
title: Two mistakes I made working with Redux
date: 2016-05-31
---

I've been working on a project using Redux for about 6 months. It was my first major project using React/Redux and I did a bunch of things wrong.

## 1) Not denormalizing store data in mapStateToProps

In Redux you will generally use normalized data in your store. So your store will look like this:

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

The equivalent denormalized data would look like this:

{% highlight javascript %}
{
    posts: [
        {
            title: "Redux mistakes",
            author: {
                name: "Matt Zeunert"
            }
        }
    ]
}
{% endhighlight %}

It makes sense to store the store data in a normalized way, since it means updates only have to be applied once and then automatically propagate once.

Where I screwed up was passing normalized data deep down into the component tree. This has two downsides.

The main one is that I now have to pass both the post and the users list into my `<Post>` component. And that data (both the posts and the users) needs to be passed through at every level, from `<TopPostsPage>` to `<PostsList>` before finally reaching `<Post>`.

That makes any code change very tedious to work with. Adding new data to one component means I have to go through all parent components to pass the data through from the upper-most component that has access to the store.

### What I should have done

I should have denormalized my data inside `mapStateToProp`.

My components would then have had direct access to the data they need, rather than having to assemble the data themselves.

Doing the denormalization in mapStateToProp instead of in the components also makes it much easier to re-use denormalization code and create selectors that are used to denoramlize data across different mapStateToProp methods.

In addition to the amount of code required to pass data through the component tree, With normalized data it's also harder to actually get hold of the post author's name. To display the author of a post I have to do this with normalized data:

`users[post.author.id].name`

Whereas if I denormalize the data first the access is simpler:

`post.author.name`

## 2) Exporting action types and creators using ES6 module syntax

Looking through the Redux documentation you will find code like this:

{% highlight javascript %}
export const ADD_TODO = 'ADD_TODO'

export function addTodo(text) {
  return { type: ADD_TODO, text }
}
{% endhighlight %}

This code uses the ES6 module syntax to export values that can then be imported using `import {addTodo} from "./actions.js"`.

This has some advantages that are mentioned in the redux docs, for example it's easy to keep track of all availalble action types. if an action type is mis-typed it will be obvious right away (since the imported value will be undefined, unlike if you typed the string literal every time).

In theory it also allows static import checking, since every exported value is explicitly defined. However I assume most projects don't currently do anything like that.

However I eventually found this structure very limiting. A lot of my actions did similar things to different data types. `ADD_TODO`, `ADD_POST`, `ADD_USER`, etc.

Using the ES6 export made it harder to split up my code into different files and then mass export all imported todo or user related actions.

It also meant that even once I had written a re-usable generator function for actions and actionCreators it still had to manually import them.

### What I should have done

My Redux logic was basically a database running on the front-end. I should have used some kind of ORM, either as a library or just writing my own generator logic from the start.

Rather than separating actions, action creators and reducers I ended up writing a generator function.

I pass the name of the data type (e.g. "users") into the generator function. The generator function is then able to generate common actions like "add" and handle them in the reducer.

I can still create custom action creators when necessary.

I can also add my own action handlers to the generated reducer, but most of the time the generated handler will be sufficient.

I keep track of all action types I create, so I can still do these two things:

- see what actions and actionCreators are available
- check that no reducer is trying to handle an action type that doesn't exist

## Do you even need Redux?

I'm happy with my Redux setup now, and I enjoy working with it. However, it does add a bunch of extra work to make how your app interacts with your data more explicit.

It's easy to get carried away worrying about performance, but unless you are actually running into issues you'll be better off focussing on improving your product.

Before starting on a project, think about whether you really need Redux/Flux, or whether some global state is good enough. Doing a full app re-render might not be so bad, and you can still opt out selectively where appropriate.
