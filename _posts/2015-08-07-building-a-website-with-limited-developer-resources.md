---
layout: post
title: 6 tips for building a website with limited developer resources
date: 2015-08-07
startups: true
---

For a non-technical founder, paying a developer to create a website is likely to be the biggest cost when starting out.

Based on my experiences working with early-stage startups as a developer, I've put together a list of tips to help reduce the amount of (front-end) dev work that's required to build your website.

## 1. Build on what you have

When part of your website isn't as good as it should be, it's tempting to create a new design for it.

However, rather than starting from scratch look at the current page and come up with a few key changes that can be made to improve it.

It's much easier development-wise to tweak what's already out there than it is to implement a whole new design.

Make a list of improvements you want to make and order them by how important they are. 

## 2. Have a consistent design

Limiting the number of different colors and sizes across your website not only helps make your design look cleaner, it also reduces the amount of developer effort that's required to implement it.

For example, every page should have the same overall width. If you have a sidebar it should also be the same width on all pages.

Your website most likely has to adjust its layout on smaller screens, such as smartphones. Pick one or two screen widths (called [breakpoints](https://developers.google.com/web/fundamentals/layouts/rwd-fundamentals/how-to-choose-breakpoints?hl=en)) where the layout changes, and follow those widths consistently across all pages.

## 3. Think in re-usable components

Identify components that could be re-used across different pages. For example, a user profile can have the same format and functionality in a search result as it does in a list of featured profiles.

The fewer components need to be created, the less work there is to do for the developer.

If you have two similar designs that need to be different you can also create two versions of the same component. That way, your developer can still re-use most of the code, while adapting the design based on where on the site the component is being used.

## 4. Use existing UI controls

Whenever possible avoid custom UI controls and stick to the functionality that's native to the browser.

For example, stick to native checkboxes instead of creating a custom style:

![Native checkbox and a custom checkbox](/img/blog/low-resource-dev/checkbox.png)

Unfortunately, sometimes UI controls that aren't built into the browser are necessary to achieve a good user experience.

For example, you might want a calendar control to select a date.

Before designing anything yourself, google for "jQuery [name of UI control]". Look through the results of existing controls that other people have published and see what you like.

For example, if you search for "jQuery calendar", this is the first result:

![jQuery UI datepicker documentation](/img/blog/low-resource-dev/jquery-ui-datepicker.png)

It might not be exactly what you were looking for, but it's already fully built!

Ask your developer to have a look and see how easy it is to change the styling.

Find a compromise between a UI control you can find online and tweaks that are specific to your website.

## 5. Release early and iterate

Putting your website on a publicly accessible server gives you more confidence about how close you are to launching your site.

A release doesn't have to be public. You can publish on a subdomain like beta.mystartup.com before going live on your real domain.

The point is to confirm that you could launch if you needed to. If your developer suddenly has a lot less availability than before you don't want to be stuck with a website that's not ready to go live.

## 6. Ask your developer for the easiest solution

When deciding what to build, work closely with your developer.

They know what the options are and how difficult each option is to implement. They also have lots of experience building websites and can help you with the concept, design and development process for your project.
