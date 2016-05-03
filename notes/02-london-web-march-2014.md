---
layout: notes
permalink: /london-web-march-2014.html
title: London Web Meetup March 2014
group: notes
date: 20 March 2014
---

## Architecting is Difficult (by [*Jack Franklin*](https://twitter.com/jack_franklin))


How to architect large systems that grow over time and are written by many people.

### Writing good code

- Write tests
    - Drive API design by exploring modelling business domain
    - Easier to test means easier to user
- Naming conventions
    - Prefer verbose variable names
    - Use consistent vocabulary (don't mix user, member, etc - unclear if they're the same)
- Coding standards
    - [Editorconfig](http://editorconfig.org) to set up text editor
    - Pick one standard and stick with it
- Single responsibility priciple
    - E.g. don't mix email generation and sending
    - Easier to test
- Decoupled components
    - Avoid tight integration, models shouldn't know about each other existence
    - Have a parent the uses both models
    - Changes to one component don't affect others
- Separate aggressively
    - Create new classes liberally

### Refactoring (altering code without changing behavior)

- You have to have tests
    - Change code without breaking things
- Code smell
    - Indicate larger issues, don't mean a fix is needed by themselves
- Data clumps
    - Continually passing around groups of related arguments that should be one object
- Magic numbers
- Control coupling
    - Parameter change means all method calls across the application have to be updated
    - Prefer passing parameter objects rather than individual arguments
- Publish and Subscribe
    - Rather than passing subscribers to an object use a central event object (EventAggregator)
- The Law of Demeter
    - Methods should only call methods on parameters, itself, objects it creates, its direct components
    - Easy way to spot: multiple dots - User.blogs.posts.get()
    - Prevent duplication of knowledge about data structure

### Approaches to maintaining code

- Every time you work with code leave it a tiny bit better (Boy Scout Rule: "Leave the campground cleaner than you found it.")
- Todos never actually get done
- Keep friction to running tests low -> should run on every file save
- Code reviews


