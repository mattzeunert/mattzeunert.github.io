---
layout: post
title: "Getting users to talk to you when building a software product"
date: 2019-09-17
---

You've built a product and got a few signups. How do you find out what your users think? Why aren't they upgrading? Or even, why *are* they upgrading?

Ideally, users would just reach out to talk about what their needs and any issues they ran into when trying out your your product. In practices that's pretty rare, especially if your product doesn't yet look promising enough for the user to invest their time in.

I've been working on a [website monitoring tool called DebugBear](https://www.debugbear.com) for the past year, and this article describes some of the strategies I've learned to start a conversation with a user.

## 1. Connect with users on LinkedIn

A few months after launching, I met a marketing consultant and he recommended looking up each person who signed up on LinkedIn and connecting with them there.

That way you learn more about the work they do, remind them of your product, and establish another communications channel. Lots of SaaS companies send a "Message from the CEO" email after signing up, but LinkedIn is more personal and there's a limit to how many connection requests a user can send, so it's less likely to be automated.

I usually do this about a week after a user signs up. Before sending the message I check out their account to see if there's anything specific they need help with. Otherwise I just thank them and ask about their experience in general and if I can help them get set up.

Most of the time people don't reply to the message you sent with your connection request. In that case I message them a couple days later. (At least I try to, I forget to do this a lot.)

If you don't hear from the person who created the account, check with any team members they've added to the project. I had one customer sign up for the Corporate plan only to cancel a month later. Even though they had accepted my connection request I didn't hear a word from them. Then I messaged one of their other team members on LinkedIn and found out they only wanted to monitor their website during a one-off front-end performance project.

How effective is this? I just went through 20 signups from a few months ago: 

- I could find a relevant LinkedIn account for 65% of signups
- 46% of those people accepted my invitation
- 50% of users who accepted my invitation messaged me

So in total 15% of people who signed up ended up talking to me on LinkedIn.

After going through my LinkedIn messages my key takeaway is that I don't follow up enough after people connect and if they messaged back I don't check in with them again a week or two later.

You can find people's LinkedIn profiles by email using the [sales navigator link](https://www.linkedin.com/sales/gmail/profile/viewByEmail/matt@mostlystatic.com). If that doesn't work, just search for their name.

## 2. Ask people why they signed up in your welcome email

I got this tip from [a Groove article](https://www.groovehq.com/blog/email-onboarding-optimization). Instead of giving general advice and inviting users to contact you with questions, try to start a conversation with your customer. Asking users why they signed up is something they definitely know the answer to, and knowing that helps you understand what you can do to make the product work for them.

This is what I put in my welcome emails:

> If you wouldn't mind, I'd love if you answered one quick question: why did you sign up for DebugBear?  
> I'm asking because knowing what made you sign up is really helpful for us to make sure you get
the most out of DebugBear.

Having had one human-to-human exchange also helps get feedback from them in the future.

## 3. Proactively message users by chat when they're online

I got this tip from Matthew Skilton of [Appointment Reminder](https://appointmentreminder.com/). Instead of waiting for your customers to start a conversation with you you can message them first. It sounds very obvious, but it somehow blew my mind!

For example, Intercom lets you messages users when they're online, and it'll look like this:

![](/img/blog/talking-to-users/intercom-message.png)

Here are some example uses cases where I might message people:

- Server errors, to let them know you're working on fixing the issue
- Seeing users struggle with getting set up, to offer help or suggest a feature
- When a customer unsubscribes from email notifications or removes a Slack integration, to find out what I can do to make the alerts more useful

Because these messages are directly relevant to the user's task it's clear they're not just automated messages, so people respond to them most of the time.

## 4. Send notifications from a different email address than onboarding or manual emails

If your product sends a lot of notification emails, make sure they don't use the same "from" address as when you are talking directly to a user. For example, DebugBear sends an email when there's a performance regression on a monitored site. Github sends an email every time someone replies to an issue or pull request you're subscribed to. Depending on what you're subscribed to there can be a lot of emails, and not all of them will be directly actionable.

When I first started sending notification emails I sent them from my normal "matt@" email address. But a lot of people group these emails and put them into a separate folder in their inbox. And then the personal emails you're sending also end up there and risk going unread.

I've now changed it to send performance alerts from an "alerts@" address so that it's easier for people to put those emails into a separate folder.

## 5. Two things that didn't work

There are two other things I tried to get feedback from people.

About 10 days after their free trial ended I sent an email asking if they're still interested in monitoring site performance and if they have any feedback. Nobody ever replied.

I also put a feedback form at the bottom of the overview page. The idea was that it would work without needing to enter an email address or commit to a conversation. But nobody ever used it.

![](/img/blog/talking-to-users/feedback-form.png)

## What is too much outreach?

There are two concerns to keep in mind when messaging users: could it come accross as spammy or creepy?

If someone isn't replying to your messages, maybe they're busy, maybe they didn't see the message, or maybe they just don't want to talk to you.

Make your outreach proportional to the user's investment in the service. If someone just signed up once and never came back you it makes sense to give up earlier than if you're trying to talk to a paying customer.

Messaging users on Intercom is a great in this regard, because it's clearly human and targeted to what they're working on right now. The message is related to what they're already doing and won't clutter up their inbox.

On the other hand, it does involve observing user behavior and checking their account. For a B2B website monitoring tool I don't see it as much of an issue. If your service has access to code or API keys looking through their account could be more concerning. A B2C tool might again be different.

## Closing thoughts

These are a few tips for reaching out to users. Make sure you also have your email address and chat widget on your site so they can reach out to you!

When writing a message, try to gather as much information from their account as you can. Did they have to do a lot of work to set up their account? Are they getting good results? What might they be struggling with? If you know they're having an issue you can just fix it without needing to bother them.

Have a system in place so you get notified of server errors and others issue that indicate your user might need help in real time.

One thing I want to do more: automatically ask for feedback contextually in the app. For example, when a user subscribes from notifications I could ask them why the alerts they got weren't actionable and what I can do to make them more useful.


