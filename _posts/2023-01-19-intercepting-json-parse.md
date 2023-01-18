---
layout: post
title: Overwriting native JavaScript functions and intercepting JSON.parse
date: 2023-01-18
ogDescription: Overwriting native JavaScript functions is easy. This article looks at three examples where I found wrapping the native JSON.parse method useful.
---

One thing I enjoy about working with JavaScript is how easy it is to override native methods. If you want to you can just overwrite `document.createElement`, `window.setTimeout`, or `Element.prototype.scrollTop`.

This article describes three times I found overwriting `JSON.parse` useful:

- Measuring time spent parsing JSON
- Showing additional data on PageSpeed Insights
- Collecting a list of extensions from the Chrome Web Store

## Measuring time spent parsing JSON

Parsing a few megabytes of JSON can take a bunch of time, but if most of your test data is small it can be hard to notice the impact. `JSON.parse(JSON.stringify)` is also a popular way to clone an object, which usually is just fine.

```javascript
const MIN_DURATION_MS = 50;

const nativeParse = JSON.parse;
JSON.parse = function (json) {
  const start = Date.now();

  const result = nativeParse.apply(this, arguments as any);
  const duration = Math.round((Date.now() - start) * 100) / 100;
  if (duration >= MIN_DURATION_MS) {
    console.log(
      "JSON.parse took " + duration + "ms",
      Math.round((json || "").length / 1024) + "KB",
      (json || "").slice(0, 100).replace(/\n/g, " ")
    );
  }
  return result;
};
```

Now when a large JSON object is parse you'll get a log like this, making you aware of the issue and helping you identify the slow code.

> JSON.parse took 65ms 1155KB { "networkEvents": [{"type": "Network.requestWillBeSent"

You can do the same for `JSON.stringify`.

## Showing additional data on PageSpeed Insights

aa

## Collecting a list of extensions from the Chrome Web Store


benchmark

find api data

collect chrome extensions


## Overwriting native functions in practice, limits (history), 