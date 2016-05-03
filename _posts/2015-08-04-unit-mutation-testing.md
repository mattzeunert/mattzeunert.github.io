---
layout: post
title: A non-technical explanation of unit and mutation tests
date: 2015-08-04
---

## What are unit tests?

Unit tests are a way to validate that a piece of code is working correctly.

They are run automatically by the computer, so they don't take away time from manual testers.
However, they do require initial setup by a developer.

Unit tests work by running an example scenario and checking that the observed outcome of the scenario matches the expected outcome.

For example, a piece of code might be written to calculate the sum of two numbers. If in the example scenario the two numbers are 3 and 5, then the expected result is 8.
If the code also calculates the value as 8, then the test succeeds.
However, If the resulting value is 7, then the test fails, and the developer is notified that a defect has been found in the code.

## How unit tests help create reliable software

Unit testing helps identify problems in a piece of software.

It's especially useful when software functionality is modified, as unit tests can verify that the existing functionality isn't impacted by the changes.

## Unit don't guarantee that software is free of defects

However, unit tests don't guarantee that all defects will be identified.

If they are badly written, they can give a false sense of security.

A defect can exist but not surface in the example scenario that is being tested.

## Increasing unit test quality with mutation testing

One remedy to this is mutation testing.

Mutation testing works by randomly modifying the code that is being tested. The assumption is that after this random modification the code is no longer working correctly.

As a result of that, the unit test for that piece of code should fail after the modification has been made.

If that isn't the case it is an indicator that the unit test might be low quality and should be improved.

### An example of a mutation test

For example, imagine we used a low quality scenario to test our addition functionality.

Instead of picking the numbers 3 and 5, we might pick the numbers 4 and 0. The expected result would be 4.

A modification test might randomly change a plus sign in the code to a minus sign. Now our code is subtracting the two numbers instead of adding them. It's calculating 4 - 0, rather than adding up the two numbers.
Even though our code is no longer working correctly, the result is still 4, which is what the expected result is.

This means the unit test continues to succeed, when it should it be failing.

The mutation test has uncovered that the scenario doesn't reliably test the bit of code, and the developer can modify the unit test accordingly.
