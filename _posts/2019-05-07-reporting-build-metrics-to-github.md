---
layout: post
title: "Reporting build metrics to Github"
date: 2019-05-07
---

This post will explain a quick and easy way to post metrics and other messages on a Github commit or pull request.

In my case I wanted to track the number of TypeScript errors in my front-end bundle, in the hope of eventually getting it down to zero. You could do the same with an ESLint config or whatever you want to track.

![](/img/blog/github-status/github-build-status.png)

## Generating a personal access token on Github

To post a status message on Github you need to authenticate yourself somehow. A personal access token is the easiest way to do that.

1. Go to the [Developer Settings](https://github.com/settings/tokens) on Github
2. Click "Generate New Token"
3. Give the token a name
4. Select the `repo:status` permission
5. Click "Generate token"
6. Copy the token and keep it around for later

## Posting a status message

First, find the 40-character hash for the commit you want to post the status on. Then post a test status to Github like this:

(I know my JSON looks a bit clunky, but I don't know bash well and I think the outer double quotes help with string interpolation later on.)

```
curl \
    -u YOUR_USER_NAME:YOUR_PERSONAL_ACCESS_TOKEN \
    "https://api.github.com/repos/YOUR_USER_OR_ORGANIZATION_NAME/REPO_NAME/statuses/COMMIT_HASH" \
    -H "Content-Type: application/json" \
    --data "{\"state\": \"success\", \"context\": \"TS error count\", \"description\": \"9999\"}"'
```

Then find the commit on Github and check the status checks. If the commit is the most recent on a pull request you should see the message there.

Then figure out how to determine the metric or message you want to store. In my case I first compile the code with tsc and then count the number of lines to find out how many errors there were by looking at the output.

```
./node_modules/.bin/tsc --outDir /tmp/whatever | wc -l
```

Then use `$()` to interpolate that message in the JSON for the API call. I'm also using the `CIRCLE_SHA1` environment variable to get the commit hash (when building in CircleCI).

```
curl \
    -u mattzeunert:3cd27023dd50a26e66379774e348be1e7647f74e \
    "https://api.github.com/repos/mattzeunert/debugbear/statuses/$CIRCLE_SHA1" \
    -H "Content-Type: application/json" \
    --data "{\"state\": \"success\", \"context\": \"TS error count\", \"description\": \"$(/node_modules/.bin/tsc --outDir /tmp/whatever | wc -l)\"}"'
```

Finally, since I was putting it in the CircleCI `config.yml` file I needed to make sure my yaml was valid. I just put single quotes around the whole thing:

```
- run: '...'
```

And then the number of TypeScript errors should be posted to Github on every CI build.
