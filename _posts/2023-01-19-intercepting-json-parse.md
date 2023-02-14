---
layout: post
title: Overwriting native JavaScript functions and intercepting JSON.parse
date: 2023-02-14
ogDescription: Overwriting native JavaScript functions is easy. This article looks at three examples where I found wrapping the native JSON.parse method useful.
ogImage: https://user-images.githubusercontent.com/1303660/218879502-9529aef6-ebeb-4ed0-80c2-cee8bcf0ccb8.png

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

When building our [site speed Chrome extension](https://chrome.google.com/webstore/detail/site-speed-by-debugbear/peomeonecjebolgekpnddgpgdigmpblc) we used `JSON.parse` interception to surface additional details that PageSpeed Insights doesn't show by default.

![Additional metrics](https://user-images.githubusercontent.com/1303660/218876603-18df9bbe-4951-4754-a2c5-fe2ba49c2fe0.png)

We just had to add this (simplified) content script:

```javascript
const parse = JSON.parse;
JSON.parse = function () {
  const ret = parse.apply(this, arguments);
  const str = (arguments[0] || "");
  if (str.includes("observedLargestContentfulPaint")) {
    const {
      observedLargestContentfulPaint,
    } = ret.audits.metrics.details.items[0];

    setMetrics({ observedLargestContentfulPaint });
  }

  return ret;
};
```

## Collecting a list of extensions from the Chrome Web Store

Before [testing the performance impact of the 1000 most popular Chrome extensions](https://www.debugbear.com/blog/chrome-extension-performance-2021), I first had to find out what the most popular Chrome extensions are.

To see all extensions you can simply scroll through the category pages on the Chrome Web Store. We can automate that with `setInterval`.

Now we need to pick up the extension – again we can detect when a list of extensions is parsed and then add them to `allExtensions`.

```javascript
setInterval(() => document.documentElement.scrollTop = 999999999999, 2000)

let allExtensions = [];

const nativeJSONParse = JSON.parse;
JSON.parse = function (str) {
  const parsedObj = nativeJSONParse.apply(JSON, arguments);
  try {
    if (parsedObj[0][1][1][0][0].length === 32) {
      const extensions = parsedObj[0][1][1]
        .map((ext) => {
          if (!ext || !ext[0] || !ext[0].length || ext[0].length !== 32) {
            return;
          }
          return {
            id: ext[0],
            name: ext[1],
            author: ext[2],
            smallImage: ext[3],
            description: ext[6],
            category: ext[10],
            rating: ext[12],
            installs: ext[23],
          };
        })
        .filter((e) => !!e);

      allExtensions = [...allExtensions, ...newExtensions];
    }
  } catch (err) {}

  return parsedObj;
};
```

## Overwriting native functions in practice

We've seen three examples where changing native functions is helpful. However there are a few things to be aware of.

First, it's usually important to not change the behavior of the function. That means calling through to the original and making sure to return the return value. You also need to be careful with infinite recursion, for example if you're overwriting `console.log`.

While you can often reassign a function, for property getters and setters you need to use `Object.defineProperty`. For example, that's the case if you want to `Element.prototype.scrollTop`.

Some properties can't be overwritten, for example `location.href`.

```
Object.defineProperty(location, "href", { get: () => "test" })
//  Uncaught TypeError: Cannot redefine property: href
```