---
layout: post
title: "Migrating your Webpack TypeScript build to babel-loader"
date: 2019-10-23
---

I recently changed my Webpack config to compile Typescript using `babel-loader` instead of `ts-loader`.
Most of this was straightforward, but there were a few snags I hit.

## Why use babel-loader instead?

In my case, because I wanted to take advantage of [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env). You pass in a list of browsers you want to support and Babel will only compile the language features that your target browsers don't support. It will also make sure to include the required polyfills.

## Basic TypeScript setup with babel-loader

First of all, I needed to install a bunch of dependencies. I use React for my front-end code, so I'm including it here too. I'm also installing `babel-preset-env`.

```
npm install \
    @babel/core \
    @babel/plugin-proposal-class-properties \
    @babel/plugin-proposal-object-rest-spread \
    @babel/preset-env \
    @babel/preset-react \
    @babel/preset-typescript \
    babel-loader \
    @babel/plugin-syntax-dynamic-import \
    --save-dev
```

Then we need to tell Babel what plugins and presets to use. At first I created a `.babelrc` file, but I got this error: 

> Support for the experimental syntax 'exportDefaultFrom' isn't currently enabled

The solution seems to be to use a `babel.config.js` file instead:

```
module.exports = function (api) {
  api.cache(true);

  return {
    "presets": [
      ["@babel/env", { "targets": "> 0.25%" }],
      "@babel/preset-react",
      ["@babel/preset-typescript", { "allExtensions": true, "isTSX": true }],

    ],
    "plugins": [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread"
    ]
  }
}
```

Note how we pass `isTSX` to the TypeScript preset, so that files ending with `.tsx` are processed by that preset.

`{ "targets": "> 0.25%" }` means we want to support browsers with more than 0.25% market share.

Now all that's left to do is updating the Webpack config file. For me that just meant replacing `ts-loader` with `babel-loader`, so that my config looks something like this now:

```
 module: {
  rules: [
    {
      test: /\.tsx?$/,
      use: {
        loader: "babel-loader",
      },
      exclude: [/node_modules/]
    }
  ]
 }

```

Now you should be able to do a build!

## Removing Babel Polyfill

If you've been using `@babel/polyfill` you can now remove it. It's deprecated, and `babel-preset-env` will make sure the right polyfills are automatically included.

## Fixing a build failure

After the initial setup I also got an error message like this:

```
ERROR in ./file.ts
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: file.ts: Unexpected token (168:10)
```

Unfortunately the line number didn't point to anything useful. Eventually I figured out that the problem was caused by using `<any>(sth)`, changing it to `sth as any` fixed it.