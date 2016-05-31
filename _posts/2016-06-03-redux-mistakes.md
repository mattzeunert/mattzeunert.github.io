---
layout: post
title: Three mistakes I made working with Redux
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

- advantages according to redux docs, and explain how i worked around it
- samples recommend it!!

- most of my actioncreators are the same!

- could instead generate things/maybe use ORM

- btw that samenesss thing also applies to reducers



## 3) Not separating between container and UI components

## Do you even need Redux?

- just global store with mutations in one place
- does perf even matter?
- if you do immutable data you can easily add shouldcompupdate without much cost

## notes

- make sure throughout you descirbe the mistake and what you should have done instead / what you're doing now
