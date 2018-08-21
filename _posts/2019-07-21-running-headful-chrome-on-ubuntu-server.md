---
layout: post
title: "Running headful Chrome on an Ubuntu server with Xvfb"
date: 2018-07-21
---

Running headless Chrome with Puppeteer on a server is super easy, but it doesn't support Chrome extensions. Since I wanted to test my Chrome extension in CircleCI I had to run Chrome in normal headful mode instead.

If you just disable the `headless` flag you'll get a "Chrome failed to launch" message. That's because on the server there's no window environment to render Chrome in.

We need something called an X display server, and since we don't have an actual monitor we can use [xvfb](https://en.wikipedia.org/wiki/Xvfb) (X virtual framebuffer) to simulate one.

I'm using the `circleci/node:10` Docker image from CircleCI, where xvfb is already installed. Otherwise run `sudo apt-get install xvfb`.

Then finally run `xvfb-run -a --server-args="-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR" command-that-runs-chrome`. In my case the command that runs chrome is `npm run test`.

I'm using the server args above because they are used in the [`xvfb.py`](https://chromium.googlesource.com/chromium/src/+/6a162e1ce238e83145921cf55e1477d33d7ba7a1/testing/xvfb.py#92) file in the Chrome source code, so I figure they should work.

## My full CircleCI config.yml

```
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:10-browsers

    working_directory: ~/repo

    steps:
      - checkout
      # For puppeteer
      - run: sudo apt-get update; sudo apt-get install -yq --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libnss3
      - run: npm install
      - run: xvfb-run npm run test
```

Looking at it now I only needed to do two things:

- Add `xvfb-run` in front of `npm run test`
- Start Chrome with the `--disable-gpu`, `--no-sandbox`, and `--disable-setuid-sandbox` flags

That sounds pretty simple, but I still spent 7 hours trying to make it work. Here are some of the problems I ran into.

## Xlib: extension "RANDR" missing on display ":100".

Even though we explicitly enabled the RANDR extension it still says it's missing. I spent a bunch of time trying to fix this, and here's my solution: just ignore the message. It doesn't seem to matter and it's not what's causing Chrome to crash.

## [ERROR:desktop_window_tree_host_x11.cc(1111)] Not implemented reached in virtual void views::DesktopWindowTreeHostX11::InitModalType(ui::ModalType)

I was getting this because I was trying to load a Chrome extension, but hadn't run the build step for it yet. So Chrome tried to show a "Failed to load extension. Manifest file missing or unreadable." dialog.

Building the Chrome extension before launching the test fixed the problem.

## [FATAL:proc_util.cc(97)] Check failed: fstatat(proc_self_fd, de->d_name, &s, 0) == 0

There are two reasons for this:

### Missing Chrome flags

You need to start Chrome with the `--no-sandbox` and `--disable-setuid-sandbox` flags. Throw in `--disable-gpu` to be on the safe side.

### Mismatched Chrome version

At some point I noticed that the normal Google Chrome install was fine, but the Puppeteer one in `node_modules/puppeteer/.local-chromium` was failing. That's because Puppeteer usually only supports [one version of Chromium](https://github.com/GoogleChrome/puppeteer#q-why-doesnt-puppeteer-vxxx-work-with-chromium-vyyy).

In my case Puppeteer Chromium was version 70, and stable Chrome was version 68. Setting the executablePath to stable Chrome caused the fstatat error.

My solution was to downgrade Puppeteer to version 1.4, which uses Chrome 68. (However I've tried upgrading back to 1.7 now and it's fine.)

## Unable to get session bus: Unknown or unsupported transport 'disabled' for address 'disabled:'

This also doesn't seem to cause the crash.

I don't know what I'm doing, but maybe try this and see if it helps:

```
sudo apt-get install openbox obmenu tint2 xfce4-panel xfce4-notifyd xfce4-whiskermenu-plugin wget unzip compton feh conky-all curl
openbox &
sudo service dbus restart
export $(dbus-launch)
```
