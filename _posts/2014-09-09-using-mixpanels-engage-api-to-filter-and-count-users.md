---
layout: post
title: Using Mixpanel's Engage API to filter and count users
date: 2014-09-09
---

Most of the time Mixpanel's web interface makes it easy to filter and visualize your analytics data. However sometimes it too cumbersome to use or you need to collect data from a large number of different query settings. In these cases you can use [Mixpanel's Data Export API](https://mixpanel.com/docs/api-documentation/data-export-api).

The Data Export API is different from the tracking API and allows you to query your dataset with a script.

## Using the API when the documentation doesn't help

The API supports all functionality that's available on the website. Actually the website uses the same API and you can [look at the requests it makes](http://stackoverflow.com/questions/12568109/mixpanel-data-export-api-gives-different-results-and-ranges-to-the-web-dashboar/12571752#12571752) when you aren't sure how to structure your query.

![](/img/blog/mixpanel-api/stackoverflow.png)

For example the website makes a request to this URL when fetching user's who are using Firefox (I've removed some parameters like the API key):

{% highlight bash %}
https://mixpanel.com/api/2.0/engage?selector=((properties%5B%22%24  
browser%22%5D+%3D%3D+%22Firefox%22))&sort_key=properties%5B%22%24last_seen  
%22%5D &sort_order=descending&limit=10000
{% endhighlight %}

Let's run the selector parameter through decodeURIComponent:

{% highlight bash %}
((properties["$browser"]+==+"Firefox"))
{% endhighlight %}

You can pass that as the selector to the API, using spaces instead of plus signs.

## Downloading the Python API handler

You can use the API directly via HTTP, but Mixpanel has written a [Python wrapper](https://mixpanel.com/site_media//api/v2/mixpanel.py) for it. Note that this export API wrapper is different from the mixpanel-py package that's used for tracking.

## A simple program to get the total number of users

Save the mixpanel.py file in the same directory as your Python script. Then add the following code to your script to display the total number of users:

{% highlight python %}
from mixpanel import Mixpanel

api = Mixpanel(
  api_key = 'KEY',
  api_secret = 'SECRET'
)

response = api.request(['engage'], {})
print response['total']
{% endhighlight %}

The `api.request` method returns a dictionary containing the API response.

In addition to the total count the response also contains a `results` value, listing each individual user with their properties (up to 1000 users at a time).

## Filtering by browser

Now let's use the selector parameter to replicate what we did in the web UI earlier fetch all Firefox users.

{% highlight python %}
response = api.request(['engage'], {
  'selector': 'properties["$browser"] == "Firefox"'
})
{% endhighlight %}

The `properties` list lets you filter by user values, either the default ones logged by Mixpanel or using the `mixpanel.people` Javascript API.

The property names are slightly different from the way they appear in the web interface. However when you click on a user's property Mixpanel shows the complete property name and value.

![](/img/blog/mixpanel-api/property-names.png)

The screenshot above shows the name of the Country property with the value United Kingdom.

## Combining filters

You can combine filters with "and" or "or", as well as group them with brackets.

Read the [Segmentation Expressions](https://mixpanel.com/docs/api-documentation/data-export-api#segmentation-expressions) section in the API documentation to see what syntax selectors support.

![](/img/blog/mixpanel-api/selector-syntax.png)

## Filtering by date

Mixpanel query selectors also support a datetime function that can be passed an ISO date string or Javascript integer timestamp:

{% highlight python %}
response = api.request(['engage'], {
  'selector': 'properties["$last_seen"] > datetime("2014-09-9")'
});
{% endhighlight %}





