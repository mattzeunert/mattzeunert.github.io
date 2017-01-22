


When building developer tools it's sometimes useful to let developers interact with the console logs to drill down for more detail.

Logs aren't meant to be used to build an interactive UI, but I'll talk about three methods you can use:

- console.group
- Property getters
- Custom object formatters

Except for console.group these aren't really console specific, but also work when the user is hovering over the variable name or when a value is in the DevTools Watch pane.

You could achieve similar results by having the user type in commands requesting specific information into the console. Clicking is easier though, and it makes the possible interactions easier to discover.

## console.group


## groupcollapsed not supported in chrome

## Logging objects

Another way to achieve interactivity is by logging an object. You could do something similar

One difference however is that 

## Property getters

= A plain object with pre-defined values won't add anything over 

 interactivity is using property getters.

can use them as buttons.

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

