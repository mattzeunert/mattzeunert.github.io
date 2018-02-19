---
layout: post
title: When to write tests
date: 2018-02-19
---

When is the right time to write tests? I can think of three approaches: proactive, reactive, and passive.

## Proactive: Writing tests before there's a bug

When developing a new feature you write tests to check that feature works. If you later break this functionality you'll find out right away!

This is clearly the best way to ensure you don't release bugs to production.

However, doing this will result in a large number of tests that need to not just be written but also maintained.

Many of these tests might not be necessary and test functionality that will never actually break in practice. But of course it's hard to tell which tests those are!

## Reactive: Writing tests after a bug is found

After finding a bug you not only fix that bug but also write a test for the functionality that broke.

This ensures that the same defect won't be introduced twice, while avoiding the upfront cost of proactive testing. Your efforts are focused on areas of your product that are known to be at risk of breaking.

Doing this will however result in more bugs reaching production than testing proactively.

There's still room for flexibility here. You might only write tests after a bug already happened in production. Or you can write tests for bugs that happened during user acceptance testing. Or you can even write a test if you notice you made a mistake while testing in your local development environment.

You'll need to look a the cause of the bug, check if you can make similar bugs less likely, and ask yourself if you should write a test that will catch the re-introduction of this defect.

## Passive: Not writing tests when a bug is found

You fix any bugs you find but don't write any tests to prevent similar problems in the future.

The obvious advantage here is that you don't need to spend time on the tests. Hopefully, your bugfix can identify and fix the root cause of the bug and fix any code that's confusing or unclear. So next time you work on that part of the code you hopefully won't introduce another defect.

But you won't know whether or not you broke it again! You risk breaking the same functionality over and over again.

Every time you find a bug you gain some knowledge about what functionality is more or less fragile. If you just fix the bug and do nothing else that knowledge is lost into the void.

Even if you can't write tests right now, consider keeping track of common defects that can be tested in the future.

## So, what's the right approach?

If you should write a test depends on a few things: 

- How much damage can this bug cause?
- Has this been broken more than once? Could it break again?
- How many people were or could be affected?
- Are there more important things for your team to work on?

Except in rare cases you can never test every scenario. When building an important new feature in a mature organization and with a large user base you can easily justify writing tests upfront. But if you're a small startup and find a minor bug caused by code that's rarely touched then you might not bother writing a test for it.

Whether to write tests will also depend on how much staff you have available and what your business priorities are. A project in maintenance mode with declining usage and without anyone allocated to work on it full-time might not justify the investment in better testing.

Still, being confident your changes won't break production always feels good.
