---
layout: post
title: Should B2B SaaS businesses accept payment by bank transfer?
date: 2022-01-20
ogDescription: SaaS billing is usually self-service and paid by credit card. But sometimes customers ask to pay by bank transfer instead. This article looks at the downsides of that and how to handle those requests.
---

Many Software-as-a-service (SaaS) apps are entirely self-service: customers buy a subscription by entering their credit card details, without ever talking to anyone at the company.

However, **sometimes customers ask to pay by bank transfer instead**. Payment ["by invoice"](https://en.wikipedia.org/wiki/Invoice_processing) usually means the same thing – which I think is confusing and gives the invoice undue credit in the payment process.

I run a site speed monitoring SaaS called [DebugBear](https://www.debugbear.com/), and in the past **I have frequently underestimated the hassle associated with bank transfer payments** and manual invoicing.

This post will:

- discuss the downsides of letting customers pay by bank transfer
- look at situations where manual payment methods make sense
- explains how to deal with customer asking to pay by invoice
- take a look at the policies some other businesses use

This is written mostly from a European perspective, but I assume also applies to US ACH/wire transfers.

## Why payment by bank transfer is generally worse than by card

### It requires time to handle

This is my current process for credit card payments:

1. Customer selects plan
2. Customer checks out through Chargebee, the subscription management tool I use
3. Subscription is activated
4. Chargebee sends an invoice to the customer

At no point am I personally involved.

In the best case, a bank transfer goes like this:

1. Customer asks to pay by bank transfer
2. I answer and explain options (e.g. annual plans only)
3. Customer agrees
4. I manually generate an invoice in Google docs
5. I email the invoice to the customer
6. I manually activate their subscription
7. The money arrives in my bank account a week later
8. I check my bank account and see the payment

Some of this could be automated if I was willing to invest time in it. Generating all invoices through Chargebee would help, though it would also increase the fees I have to pay.

### It starts a purchase process

You've got a customer asking to pay by bank transfer, so all you have to do is send the invoice and wait, right?

Sometimes this works. But the sale is now no longer self-service and **asking to pay by bank transfer can be the start a longer purchase process**.

For example, you might be asked to:

1. Wait for them to generate a purchase order (PO), then put the PO number on the invoice
2. Fill out one or more vendor onboarding forms
3. Fill a security questionnaire
4. Accept their standard supplier terms

You're dealing with people in their purchasing department, and sometimes they'll be on holiday or just be busy and miss your emails. **Going from purchase decision to purchase approval can take months**.

Manual work also makes it easy to make mistakes, especially if you're small and don't have documented processes in place.

For example, I once didn't realize a buyer was also in the located in the UK, and quoted them the price excluding VAT. Charging VAT makes no difference to the buyer financially, but the purchase order stated the VAT exclusive amount and I had to check that they were still good to go ahead and pay the invoice that's inclusive of VAT.

### It takes longer to get paid

Self-service subscriptions are paid upfront by credit card. Payment by bank transfer usually takes about a month after approval.

Sometimes customers have their own standard payment terms, for example payment within 45 days (Net 45). One of my customers pays within 97 days of invoice receipt.

So including the time to get a purchase order, it can take 4 months or more to get paid.

### Dealing with overdue payments

As a small company, we usually pay supplier invoices as soon as I receive them.

Large companies tend to pay invoices when they are due, and sometimes they forget to pay.

I usually set a Google Calendar reminder for the due date of the invoice plus a few days to check my bank account and follow up if I've not received the payment yet.

### You have to manually handle renewals

Once the initial service period is over (usually one year), you then have to get in touch again, check they want to renew, wait for a new purchase order, etc.

I set myself a calendar reminder about a month before the renewal date, to get the process started early.

### It's more bookkeeping work

Auto-generated Chargebee invoices are automatically imported into Xero, the accounting software I use.

For manual invoices, I have to include the invoice in the quarterly zip file I send to my accountant, and they enter it into Xero.

### It makes it harder to track your revenue metrics

As I generate some invoices manually, the revenue numbers reported by Chargebee don't cover all of my revenue. For example, to get the monthly recurring revenue (MRR) number I have to add monthly revenue from manual invoices to the Chargebee MRR figure.

### Wrong payment amount

Once a customer paid the amount stated on the invoice, but their bank took off a £7 processing fee. Not a big deal, and not worth asking for a full payment.

But they still owe me £7, and that will show up as Accounts Receivable in my accounts until the debt is paid or written off. So I have to issue a £7 credit note (basically the inverse of an invoice), send it to the customer to cancel the debt, and send it to my accountant.

Another customer once paid $X,000 on an £X,000 invoice – they had to pay the remaining outstanding amount in a separate transfer.

## When payment by bank transfer makes sense

### Early-stage businesses

Quibbling about payment methods is a bit of a luxury problem to have: it means you have customers that want to use your product and pay for it.

Say you've just found your first potential customer and they want to pay £100 a year. It makes sense to accept a bank transfer, as getting your first paying users is more important than optimizing for efficiency at this stage.

(I'm assuming you're finding it difficult to get your business off the ground and don't have a long list of interested buyers.)

### Large payments from enterprise customers

If the payment amount is $10k+ then spending a few hours on the process isn't a problem.

### Saving fees

Standard USD credit card payments can incur a bunch of fees (around 3-6%):

- to the payment provider (Stripe in my case)
- to the subscription solution (Chargebee in my case)
- conversion to GBP

I don't think this applies if you sell typical high-margin software subscriptions. I'd rather pay $50 on a $1,000 payment than spend an hour or two dealing with manual invoices, and risk making mistakes. Saving $1,000 on a $20,000 invoice would be a different issue.

The currency conversion often still happens when getting paid by bank transfer.

### When you have a team to handle it

As a founder, dealing with manual payments is usually a distraction from improving the product and attracting more customers. You only want to do it when it's worth it to you.

If you have a dedicated finance department, dealing with manual invoices can be someone's job and it can scale up without taking time away from making the thing you sell.

In this case you also have the resources to put processes in place to automate invoice generation and handling payments.

## How to handle requests to pay by bank transfer

### Just say no

It keeps your business simple, and is a good approach if you can afford to lose some sales in order to attract more customers in the long term.

**You might lose fewer sales than you think.** If card payment is the only options, interested buyers who originally asked to pay by bank transfer can often find a credit card they can use to pay.

If you're selling a B2C product for $20 a year then this seems like the obvious way to go. If your average annual contract value (ACV) is $100,000 then accepting bank transfers should also be an easy decision.

In the future I also want to push back more on custom payment terms and requests to fill out forms.

### Annual only

Sending manual invoices **monthly would multiply the work you have to do by 12**. I've never done this and it seems like way too much hassle. Though if the price was high enough I'd be fine with monthly billing.

(I have once sent a one-off two-month invoice for someone who wanted to test the product more before committing for a whole year.)

### Minimum payment value

My current policy is that payment by bank transfer is only an option if you're at least on the $199/mo plan. So $2,388 a year.

Sometimes I give in though if I don't want to lose a sale. In the future I want to try sticking to the minimum payment value by offering 2-year or 3-year contracts.

### Charge extra

Annual payments for DebugBear normally come with a 20% discount compared to the monthly plans. For bank payments this discount doesn't apply, to account for the additional work involved, and to encourage people to use the self-service option.

### Double-check what their purchase process looks like

In the past I wrongly assumed that asking to pay by bank transfer only meant asking for an alternative payment method. I've since learned that it's often the first sign of a complicated procurement process.

If the buyer assures you that they only need an invoice and will get straight to paying it then you can consider waiving some of your usual requirements.

### Ask for a testimonial

If you want to make a sale but the buyer can't meet your usual requirements, ask if you can list them as a customer on your homepage, or if they can answer a few questions that you can publish as a case study.

That way you can make an exception, but still get something out of it.

### Delay activating the account until payment is received

I've not done this – I always activate the account as soon as the customer says they want to buy.

But if I had lots of late payments I'd consider only activating the account when payment is received.

## What do other companies do?

Here are a few examples of how other businesses of various sizes handle bank transfers.

- **[Moz](https://moz.com/)** allows bank transfers for annual invoices, [charges a $30 fee per invoice](https://moz.com/help/your-account/manage-subscriptions/manual-invoicing), and invoices are due on receipt.
- **[Feature Upvote](https://featureupvote.com/)** allows payment by bank transfer on annual invoices, [charges 10% extra](https://featureupvote.com/pricing/).
- **[Timetastic](https://timetastic.co.uk/)** only supports [payment by card](https://help.timetastic.co.uk/hc/en-us/articles/360020034837-Payments-and-invoices) and says that, given their business model, they ["don't have the resource to complete [supplier] forms"](https://help.timetastic.co.uk/hc/en-us/articles/115003288769-Supplier-forms-IT-questionnaires).
- **[Buffer](https://buffer.com/)** also [only allows card payments](https://support.buffer.com/hc/en-us/articles/360038244493-Accepted-payment-methods).
- **[Slack](https://slack.com/intl/en-gb/)** requires a [minimum invoice amount of $5,000](https://slack.com/intl/en-gb/help/articles/360002038947-Supported-payment-methods#pay-by-invoice) with payment due within 30 days.