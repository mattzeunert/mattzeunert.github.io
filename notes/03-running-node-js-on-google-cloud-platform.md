---
layout: notes
permalink: /running-node-js-on-google-cloud-platform.html
title: Running Node.js on Google Cloud Platform
group: notes
date: 8 May 2014
---

Talk by [Arun Nagarajan](https://twitter.com/entaq) at Google Developer Group London.

## Cost Reduction through platforms

1957 - 2013: steep decrease in average S&P 500 company age

Easier to build products:

- affordable capacity
- on demand computing
- instant access

## Google handles lots of data

- 72 hours of videos uploaded to Youtube every minute
- 100 million GB - size of search index in 2010
- 425 million active Gmail users

## Cloud Computing

As a Service:

- IaaS: Infrastructure, e.g. more choice than PaaS
- PaaS: Platform, e.g. Google App Engine
- SaaS: Software, e.g. Jira, Github

IaaS vs PaaS: IaaS means controlling Runtime, Middleware and OS in addition to Applications and Data (as in PaaS).

## Google Cloud Platform

Compute
- App Engine
- Compute Engine
Storage
- Cloud Storage (blobs of files)
- Cloud SQL (RDBMS)
- Cloud Datastore (NoSQL)
App Services
- BigQuery
- Cloud Endpoints

## Compute Engine (IaaS)

"Think of it as a general-purpose Linux machine in the cloud."

## Compute Engine Setup

- [console.developers.google.com](http://console.developers.google.com)
- Compute Engine requires billing to be enabled.
- Need to install Google Cloud SDK.
- Create a Google Cloud instance.
- => This creates a Linux box that you can SSH in and run your apps.
- Need to add firewall rule to allow access from port 80.
- Need to install packages yourself with apt-get (e.g. Python, Node)
- Can install arbitrary libraries/frameworks

## Managed VMs

- Allow you to build app engine modules that use Compute Engine

