---
layout: post
title: Interactive console logs in Chrome
date: 2017-01-10
---

When building developer tools it's sometimes useful to let developers interact with the console logs to drill down for more detail.

Since logs are usuallly static text, interacticity isn't something that comes easily. But I'll talk about three methods you can use:

- console.group
- Property getters
- Custom object formatters

Except for console.group these aren't really console specific, but also work when the user is hovering over the variable name or when a value is in the DevTools Watch pane.

You could achieve similar results by having the user type in commands requesting specific information into the console. Clicking is easier though, and it makes the possible interactions easier to discover.

## console.group

[console.group]() let's you group and collapse a set of console messages.

To make sure your messages are collapsed before you start interacting with them use `groupCollapsed`

TODO[[[example here]]]

TODO[[left: before expand, right: after expand]]

console.group works well if you want to show a bunch of console message and don't know yet which ones will be relevant to the user.

Because there's nothing hacky about this approach everything a user would normally expect works fine. The expanded content also appears in place, rather than being appended to the console like a new `console.log` call.

However, unlike the next two approaches I'll talk about you'll need to know in advance what needs to be logged. That means logging everything that may interest the person conusming the logs, rather than only logging it what the user requested.

You can't append new messages to a existing group of logs.

## Property getters

log obj rather than text

 sync, but then can log more stuff async

 web urls aren't clickable, file urls aren't either

 or to expand info that may take too long to calc 

 async won't work -- verify this, might just be the web worker

 only a short sync string appears in place, other stuff needs to be logged to bottom... but can sorta avoidable by clicking again and again... that works for async problem too



## Custom Object Formatters

advantage: like conosle.group appears in place, rather than logging new stuff

kinda like an object with getters, but much better UX


## Final thoughts

ultimately trying to force a text ui 

advantages of doing it this way: can be inside console/just see stuff on hover

downside: not best ux, just hacks... can be better to use devtools tab if switching is ok 

