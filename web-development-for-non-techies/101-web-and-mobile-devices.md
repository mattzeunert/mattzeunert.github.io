---
layout: nontechies
permalink: /web-development-for-non-techies/mobile-websites-vs-apps.html
title: Mobile websites vs. apps
group: nontechies-1000
prev: What is web development?
prevLink: /web-development-for-non-techies/what-is-web-development.html
next: What are HTML and CSS?
nextLink: /web-development-for-non-techies/what-are-html-and-css.html
---

Smartphone browsers let us access the internet from mobile devices. The web technologies HTML, CSS and Javascript can also be used to build mobile apps.

## Mobile websites

Like with desktop sites you first have to open a browser like Safari or Chrome to access a mobile website.

Mobile websites can generally have similar capabilities as desktop sites. Desktop sites can be viewed on smartphone browsers, but most websites require mobile optimization to work well on smartphones.

The image below shows a desktop website viewed on a mobile device on the left and a mobile optimized site on the right. 

![Mobile Optimization](/img/non-techies/mobile-optimization.png)

While the desktop site on the left is functional it is hard to use and requires zooming. As part of mobile optimization the layout of a website will often need to be adjusted.

Mobile sites may also require performance optimizations as phones have less processing power. A common example are heavy visual effects that feel sluggish on smartphones.

**Responsive** websites aim to reduce extra work when optimizing a website for smartphones by keeping the amount custom code required minimal.  
Other websites aren't responsive and have two completely separate code bases for the mobile and desktop UI.

## Native mobile apps

Usually smartphone **apps** are built for one specific platform. If you have an iPhone app it doesn't run on an Android device.

These apps are called **native** because they use they use technologies that are specific to their device's operating system.

Native Android apps are commonly written in a programming language called Java. The main language for iOS development is ObjectiveC.

## HTML5 apps

Suppose you already have a mobile-optimized website. Creating apps for each platform would be a lot of work. Your web development team probably doesn't know much about the required technologies either.

Enter HTML5 apps.

Imagine an app that does nothing but open the browser and navigate to your company's homepage. Now add a feature to remove the address bar. Essentially, that's an HTML5 app.  
They can be built using web technologies because they use the browser to convert HTML and CSS to something the phone's operating system can understand.

The codebase for an HTML5 app tends to be different from that of the website, for example because the app should still work without an internet connection.But you can probably reuse some of the existing code. There's also no need to hire new developers that are familiar with the platform-specific technologies - after all it's just HTML, CSS and JavaScript.

Remember that the browser [doesn't trust the website it's displaying](/tech-for-non-techies/what-is-web-development.html)?  
For example this means that the browser won't let the website read data from the phone's storage.

To reach beyond the security restrictions that browsers impose HTML5 apps need another component that works around them, for example [PhoneGap](http://phonegap.com/).

## Disadvantages of HTML5 apps

There are two main downsides to HTML5 apps.

First of all they are slower because instead of running on the phone directly they run inside a browser wrapper.

They also aren't built with the target platforms design principles in mind, which can be confusing to users and look less appealing.

However, HTML5 apps can be a great choice if resources are limited.
