---
layout: post
title: Filtering users by how often they triggered an event in Mixpanel
date: 2014-09-01
---

Mixpanel's UI consists of two main sections: Engagement and People.

Engagement allows you to see how often an event occurs

People on the other hand let's you keep track how individuals use your product. You can also filter by a user's properties to learn more about who is using your product.

## Filtering people by their engagement data

Often you will want to find out how many of your user's reached a certain milestone in using your product. Using Funnels or Segmentation can give you an idea of how many people did something at least once or the average number of times a user triggered an event.

However you can't see individual users in this report and unfortunately there's no easy way to combine the engagement and people data.

When a feature is central to a website's value proposition the site needs to be built in a way that allows as many visitors as possible to discover that feature and learn to use it.

I asked the Mixpanel support team how to best collect and extract this information. This was the response I received:

 > There's a bit of separation between our events and people data sets and in some cases you'll need to duplicate data to have access to it on both platforms. You'll need to add a counter for that property on the people side and you'll be able to select for users based on their counts for different events.

The [Mixpanel Javascript API](https://mixpanel.com/help/reference/javascript) provides a `mixpanel.people.increment` function that we can use to store the number of times a user has triggered an event.

We can then use this person-specific data to filter by event count in our People report.

## Implementing an event counter for individual users

The easiest way to increment a property on the current user every time you track an event is to call it alongside `mixpanel.track('eventName')` and increment a value called something like `eventName-Count`.

Instead of calling `mixpanel.track` directly write a new function that wraps around it:

{% highlight javascript %}
function logMixpanel(event, data){
    mixpanel.track(event, data);
    mixpanel.people.increment(event + '-Count')
}
{% endhighlight %}

When calling this function with the event name 'Search Trips' a new property will be added to person details in Mixpanel, called 'Search Trips-Count'. You can then filter by this property in Mixpanel's people report.

## Another approach: using the data export API

One limitation of this approach is that you can't filter by any of the event data in the people tab. For example, I can see how many people used the search feature more than 3 times, but even though I might be logging it with the event I can't see how many of them specified a category in their search.

If you are willing to put in the extra effort Mixpanel let's you download all your data via their API and you can use that data to filter by any value you're interested in.


