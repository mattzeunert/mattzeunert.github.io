---
layout: post
title: Trying to generate source maps by performing dynamic analysis on the compiler
date: 2016-08-19
---

Sometimes the source maps Babel generates aren't super accurate. Then you get something like this:

![](/img/blog/dynamic-analysis-sourcemaps/breakpoint-moves.gif)

Often this isn't actually Babel's fault, but rather a problem with the Babel plugin that does the transformation.

## Generating source maps through dynamic analysis

The project I'm working on, [FromJS](http://www.fromjs.com/), collects information about JavaScript code while it's running. Specifically, it allows you to see how two strings relate to each other.

By running Babel while FromJS is tracing it I can find out how the compiled code relates to the original source code.

For example, let's compile the arrow function `var square = x => x * x`. I can look at the compiled code and see where the `square` variable was defined in the original code.

![](/img/blog/dynamic-analysis-sourcemaps/mapping-s.png)

And I can do the same for the `x` parameter.

![](/img/blog/dynamic-analysis-sourcemaps/mapping-x.png)

Using the [source-map](https://www.npmjs.com/package/source-map) package on NPM I can then piece the individual mappings together into [a source map](http://sokra.github.io/source-map-visualization/#base64,dmFyIHNxdWFyZSA9IGZ1bmN0aW9uICh4KSB7CiAgcmV0dXJuIHggKiB4Owp9Owp2YXIgZm91ciA9IHNxdWFyZSgyKTsKCnZhciB3aHkgPSAnZW1wdHkgc3BhY2UgdG8gc2VlIHdoYXQgaGFwZW5zJzsKd2h5ICs9ICchJzsKLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGlsZWQuanMubWFw,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFJO1NBQUssRUFBRSxFQUFFOztJQUNsQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztJQUlkLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZVJvb3QiOiIuLyJ9,dmFyIHNxdWFyZSA9IHggPT4geCAqIHgKdmFyIGZvdXIgPSBzcXVhcmUoMik7CgoKCnZhciB3aHkgPSAnZW1wdHkgc3BhY2UgdG8gc2VlIHdoYXQgaGFwZW5zJzsKd2h5ICs9ICchJw==).

![](/img/blog/dynamic-analysis-sourcemaps/sourcemap.png)

## Does it work?

A little bit, maybe.

As I showed above, the mappings tend to work on literals or variable identifiers. But if you look at something like a variable declaration you can see that the `"var"` string isn't taken directly from the uncompiled source code.

Rather, `"var"` appears directly in the source code for the compiler. (The Babel code is in sm-test-compield.js).

![](/img/blog/dynamic-analysis-sourcemaps/mapping-var.png)

So in practice I have to discard a lot of the collected data, because the relationship it describes isn't the relationship between the original code and the compiled code.

While stepping through certain parts of the code works well, there are other parts where the source map doesn't work at all.

## Improving Babel source maps

My original idea wasn't to generate complete source maps from scratch. Rather, I wanted to find problems in the normal source maps generated by Babel and improve them with the data I collected.

However, I think most of the places where I can collect mapping data are already well covered by Babel. The problems with Babel source maps seem to come mostly from new code that was generated, rather than code that's based directly on the input source code.

Overall, it was a fun experiment, but it doesn't seem useful in practice.
