---
layout: notes
permalink: /project-ideas.html
title: Project ideas
---

This is a list of project ideas I've had but never worked on much.
Some of them might be interesting as commercial products while others are just fun things to play around with.

## Commercial ideas

### Excel for hierarchical data

I think of this as a simulation tool mostly for financial data.

Basically you can have groups and sub-groups and sub-sub-groups etc. in one big data tree.

You can then perform operations upwards in the tree, so for example you could take a sum:

       8
    2  3  3
    

Or you could perform a currency conversion so your end result (at the top of the tree) would be in once currency even if one branch of your tree is in another currency.

You could generate pie charts showing how differnt sub-trees contribute to a result.

The user could also toggle trees to simulate how different scenarios impact the outcome.

Individual items could also be tagged and the tag could be toggled - so for example you could preview costs based on whether or not you work with a specific client.

The question is though, do normal people experience a lack of tree structures in their lives?

### Website generator/API for subscription services for physical goods

There's a bunch of websites providing regular deliveries of food or other items. I assume they are currently custom-built and share a lot of functionality. Startup cost could be greatly reduced if the functionality is reduced - this might be via an API since the services are branding intensive and have very custom designs.

There's probably a lot of competition for general subscription services though.

### Fruit delivery to work

Eating enough fruit/vegetables is a major logistical task that many people struggle with. Similar to [The Sandwich Man](https://twitter.com/sandwichman8).

People could buy subscriptions to encourage themselves to stick with it.

Or maybe outsourcing office fruit bowls is a better idea. Companies subscribe to receive a fruit basket once or twice a week.

### Automated usability analysis - help non-designers make websites more user-friendly

Measure basic things like size of clickable areas and hover styles.

Maybe it would also be possible to analyze whether the page has a clear hierarchy, e.g., a few clear call-to-actions, a primary content area and emphasis on a few most used actions.

There could also be non-automated guides that help people look at specific aspects of their website.

Other things that can be detected:
- Never call a button 'Submit'
- Contrast between text

Eventually this would could integrate a whole bunch of more standard things, like 404/500 checking, updating tracking and spelling checks.

### JSON Editor

A tool to let non-technical users edit JSON files inside a Github repo. Some places (marketing agencies in my experience) pay developers to copy and paste from a Word document into a JSON file. Then the content editors make changes in the Word file and developers manually synchronize the data.

### Buy ingredients button

Add a "Buy ingredients" button to recipes to send traffic to online supermarkets (earning a comission on sales or signups).

### BrowserStack for emails

Shows you how emails look in different clients (Gmail, Outlook, Thunderbird, ...). -> This exists and works well already: [Litmus](https://litmus.com/)

## Probably not commercially viable

### Email newsletter with quick 1-minute front-end development tips

Make little videos showing little known features and tools:

- Chrome $0
- IE debug only my code feature
- Using QuickTime recordings
- OS X hex code in Color Meter
- ...

This could possibly be used as a hook for paid (info) products.

### Adblock analytics

Tell website owners how many people on their site use an ad blocker.
Not sure how that's useful, though, but I feel it might be.

### Ticket cost development tracker 

Graph cost of e.g. rail tickets by the number of dates to departure.

## Just for fun projects

### Map travel recommendations.

Find out what countries recommend against travel in certain areas and map/compare that.

### Username analysis

Scrape usernames and answer these questions for different sites:
- How long are people's usernames?
- Do they contain parts of real names? (Use a list of first names from the internet somewhere.)
- Do many usernames contain similar letter sequences (e.g. 'the', 'startup' or 'code')?

### String modification/source tracking

This would be really useful, but also really really hard.

Say my html code shows some data. I want to know why it's not showing what I would expect. I want too click on the html code and it shows me the origin of different parts of it, and then the origin of those parts.

So for example it might show me that some text came from a database query that returned an array, one of the array items was a string, the string was passed to a function that prefixed another string to it and then the template system converted \n line breaks to html \&lt;br\&gt; line breaks.

### Quiz based on Stack Exchange data

The quiz loads a random answered programming question with more than 10 upvotes from StackOverlow and let's the user see if they know the answer (which they can then load).

This would help someone learn more about a programming topic and focus on  problems people encounter most often.

### HackerCrush

I like Patrick McKenzie. I don't want to miss any of his Hacker News comments, podcasts, blog posts, email list content or tweets.

This might you be an email list that's manually curated, with a script that aggregates HN posts/tweets from a username.

## Another thing

I don't understand while restaurants don't just show you pictures of the food  they serve, instead opting for a cryptic description. (I've since been told that it makes the restaurant unsophisticated and touristy.)
