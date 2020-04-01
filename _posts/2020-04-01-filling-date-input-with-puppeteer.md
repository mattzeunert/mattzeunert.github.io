---
layout: post
title: "Adventures in filling out a date input with Puppeteer"
date: 2020-04-01
---

As part of an end-to-end test I recently need to fill out an `input type="date"` field in Chrome using [Puppeteer](https://github.com/puppeteer/puppeteer).

Fundamentally it's pretty straightforward, just type in the numbers like you would as a user. The slashes are handled by the browser:

```
await page.type("input", "01042020") // 1st of April 2020
```

This will work fine on my laptop with a UK locale. But it will break on the CI server in the US, which needs the month before the day: `04 01 2020`.

To get the localized format we can use `toLocaleDateString`:

```
await page.type("input", date.toLocaleDateString().replace(/\//g, ""))
```

Except that [Node doesn't ship with with different locales](https://github.com/nodejs/node/issues/8500#issuecomment-246432058) and `toLocaleDateString` will always use the US format.

Luckily we're already using Puppeteer and have a Chrome instance running. We can use `page.evaluate` to get the localized date string from inside the browser:

```
let dateString = await page.evaluate(
    d => new Date(d).toLocaleDateString(),
    // pass date value from Node to Chrome as `d` parameter
    date.toISOString()
);
await page.type("input", dateString)")
```

We've now got a localized date string – in the US it's going to look like this: `4/1/2020`.

But when you type `4 1 2020` into the date field the browser doesn't know if there are one or two digits for the month. So if we enter this string in the US the final date will be `4/12/0020`. Not quite what we wanted!

Luckily `toLocaleString` allows us to customize the date format and make sure leading zeros are added.

```
let dateString = await page.evaluate(
    d => new Date(d).toLocaleDateString(navigator.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }),
    date.toISOString()
);
await page.type("input", dateString)")
```

And this finally worked both on my computer and in CI!