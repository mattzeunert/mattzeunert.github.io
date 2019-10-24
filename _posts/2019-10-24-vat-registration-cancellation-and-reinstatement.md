---
layout: post
title: "HMRC cancelled my VAT registration, and how it got reinstated"
date: 2019-10-24
---

I started my company [DebugBear](https://www.debugbear.com/) a bit over a year ago, and registered for VAT right after. But then HMRC cancelled my registration and and sorting that out was a huge problem that took over 5 months.

## Registering for VAT

You don't have to register for VAT if you're not making much money. But there are two main reasons why I decided to register voluntarily:

1. To be able to reclaim VAT on purchases
2. To be able to buy from EU suppliers that don't sell to consumers

As a B2B company, registering for VAT will usually save you money. If you rent a desk for £480, including 20% VAT, you can go to HMRC and tell them to give you back £80.

You'll also have to charge your customers VAT, but, since they are also VAT-registered businesses, they won't mind paying an extra 20%. They'll just go to HMRC and claim it back.

Why don't some suppliers sell to consumers in the EU? That's because you need to collect VAT at the local rate for each country and make sure the money goes to the right tax office. For VAT-registered companies that's not an issue, you just don't charge them any VAT and tell them to sort it out on their end.

## Submitting my first return and cancellation

I submitted my first VAT return on 7 November 2018. My first period only covered about 45 days, and I didn't have any sales or any VAT to claim back.

In February 2019 I went to the HMRC website to submit my VAT return for the previous quarter. But the option to submit a return wasn't there, and this is what I saw when I looked at my VAT certificate:

![HMRC online saying my company's VAT status is deregistered](/img/blog/vat/deregistered.png)

HMRC can involuntarily deregister your company if they don't think you're a business. Maybe your company has stopped trading, or you were trying to reclaim VAT on your Netflix subscription. I called up HMRC and they said I need to demonstrate intent to trade and send a letter to HMRC's VAT reinstatement unit.

My VAT registration had been cancelled back in November. I remember received a letter from HMRC at the time that looked like duplicate of the confirmation that I was registered, so I threw it outf. That's probably when HMRC told me they were going to cancel my VAT number!

## Asking for reinstatement

I did a bunch of research on what it means to be a [business for VAT purposes](https://www.gov.uk/hmrc-internal-manuals/vat-business-non-business/vbnb22000). The good news is that you don't need to be making any money, you only need to be serious in your intent to sell things to make a profit.

I sent a 26-page letter to HMRC, with a few different pieces of evidence:

1. A brief summary of what the business does
2. A two-page business plan (I wrote it specifically for HMRC)
3. A list of similar businesses, to show it's a thing that people commonly make money from
4. Screenshots of the landing and pricing pages
5. Invoices for ads and other marketing activities
6. Emails demonstrating interest from potential customers

I didn't have any customers yet, so I couldn't show HMRC any sales invoices. But I was able to demonstrate that I was making efforts to sell a product.

HMRC told me it would take about 11 working days to hear back, so I sent off my letter by registered mail and waited.

A month later I still hadn't heard anything, so I called up HMRC. Turns out my letter got lost somehow before entering their internal system 😭

I made a few tweaks and sent my letter again. This time I called them two days later to make sure they received it.

## Being deregistered

There are three main problems with being temporarily deregistered: 

### 1. Your past invoices are now wrong

This could be either because you charged your customers VAT, or because EU suppliers didn't charge you VAT when they should have.

For example, Twitter hadn't charged me any VAT, because I had told them I'm a VAT-registered business. HMRC's opinion was that I needed to convince my past suppliers to charge me VAT on those old invoices. I asked Twitter support and, as expected, they said they can't update past invoices.

I gave up on trying to fix this, since the suppliers don't want to cooperate. Once your VAT number is reinstated everything is fine again anyway.

### You can't buy from some EU suppliers  

In the case of Twitter you can just change your account settings to say you're not a business. With Google Cloud that's not possible, you can't buy from them unless you're registered for VAT.

At first I ignored this issue, but eventually I started paying my Google Cloud bill from another VAT-registered company that I had been using for contract work. I then invoiced my new company for the hosting costs plus 20% VAT.

### You can't collect any VAT on sales yet, but you'll owe VAT on those sales in the future

At first I didn't bother to do anything here, but then my accountant said I'll go to jail if I collect VAT without being VAT-registered. So I updated my website to not charge VAT to UK customers. Luckily I didn't have any customers in the UK yet, so I hadn't collected any VAT at that point.

That's all good until your registration is reinstated, but then you owe VAT to HMRC for all past sales invoices.

Say you sell £100 worth of product to a UK customer. You can't charge them VAT yet, but two months later you're VAT registered again and owe HMRC £20. You can either explain your situation to the customer upfront and get them to pay you £120, but don't mention VAT in the invoice for now. Or you can send them a VAT-only invoice for £20 once you're registered again.

Either way, for a low-touch software product it's a big hassle for you and your customers. I didn't want my customers to have to deal with this extra billing complexity and had only made a few hundred pounds from UK customers while I was deregistered. So I just paid the VAT that was due to HMRC from my own money.

## Waiting to hear back from HMRC

After my initial attempt to get in touch with HMRC failed I started to call about every two weeks to see if there was an update. Once I started making sales I also sent another letter with those invoices as further evidence.

At one point someone had a quick look at my case over the phone and they seemed pessimistic. One thing he pointed to was that when I registered I put my expected turnover for the first year at only £3000. That doesn't actually make any sense though, since it's perfectly fine to register for VAT even if you spend years building a product before making any money.

Nothing much happened until June, and I wasn't able to get anything out of them regarding a potential timeline. I had originally used a forwarding address when registering, and started becoming more worried about that. So I sent another letter asking them to change it.

Eventually someone said that they'll take a look. Apparently they needed to get in touch with the officer who originally deregistered my company, but they'd not heard back from them.

Finally that person replied. I called them on 3 July and was told that it looks like my company isn't involved in any fraudulent activity. On 24 July my online account finally showed my VAT status as registered again 🎉

## Lessons

The cancellation caused a long period of stress and uncertainty, and I spent at least 60 hours sorting this out. There's a few lessons here:

- Use an accountant to handle your VAT if you have the money. Normally this is pretty easy, but if something goes wrong you don't want it to be your fault.
- Read letters from HMRC carefully.
- Call HMRC to check they received important letters.
- Don't use a forwarding address when registering for VAT.
- Consider delaying your VAT registration if you're pre-revenue. Once you're registered you can reclaim the VAT on past expenses.

Finally, I discovered the [website of the British and Irish Legal Information Institute](https://www.bailii.org/). It's an amazing resource of case law and really helped me better understand how the entitlement to VAT registration arises. They block search engines in their robots.txt, so it's not all that easy to find.