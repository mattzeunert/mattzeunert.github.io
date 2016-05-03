---
layout: post
title: Tracking anonymous users with Mixpanel People Analytics
date: 2014-10-29
---

Mixpanel People Analytics allows you to view the events a particular user has triggered, as well as store data alongside that user.

Normally you would call [`mixpanel.identify(userId)`](https://mixpanel.com/help/reference/javascript#storing-user-profiles) when someone creates a new account. But what if you want to track user's that don't have an account yet?

The easiest way to do this is to generate a random ID and assign it to the user, as Mixpanel only list a user profile if you've explictly called the `identify` function. You can put the ID into localStorage to check whether the user just came to the site.

{% highlight javascript %}
var userId = localStorage.getItem('userId');
if (!userId){
  userId = 'anonymous' + Math.round(Math.random() * 1000000000)
  userId = userId.toString()
  localStorage.setItem('userId', userId)
}
mixpanel.identify(userId);
mixpanel.people.set_once('$first_name', userId);
{% endhighlight %}

This way you get user profiles like this and you can see how engaged each user was.

![](/img/blog/2014-10-29-mixpanel-people-analytics.png)

When the user creates an account you use `mixpanel.alias(newId)` to connect the two IDs and pass the new user ID to `mixpanel.identify` every time they log in.
