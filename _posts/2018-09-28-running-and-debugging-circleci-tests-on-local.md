---
layout: post
title: "Running and debugging CircleCI tests on local"
date: 2018-09-28
---

Fundamentally running your CircleCI tests on local is straightforward. You follow the [installation steps](https://circleci.com/docs/2.0/local-cli/) and then run this command in your repository:

    circleci local execute

However there are a some additional things to consider.

## Work from a clean working tree

Instead of fetching the repo from your source control repository CircleCI will use your local checkout. That's usually desirable as it avoids spending time downloading the code, although you can disable it by setting `--skip-checkout` to `false`.

However if you install any Node modules with native dependencies they will have been compiled for your local computer rather than the Docker container that the tests will run. You can avoid that problem by using a clean checkout of your repo where the Node modules haven't been installed yet. (Or you could delete your `node_modules` folder.)

## Accessing background script logs

If you have any background commands in your `config.yml` using `background: true` their output won't be printed to the console. But you can caputre their output and write it to a file that's shared with your host machine.

First you need to share a directory on the host with the Docker container. You can do that by starting `circleci` like this:

    circleci local execute --volume /Users/me/docker-logs:/home/circleci/logs

Then use this to [redirect both stdout and stderr to a file](https://stackoverflow.com/a/876267/1290545):

    -run:
      background: true
      command: npm run do-stuff &>> /home/circleci/logs/bg.log

## SSH into your local container

First run `docker ps` to get the container ID, then use this to connect to it:

    docker exec -it CONTAINER_ID  /bin/sh

This will only work as long as your tests are still running, so you might want to add a sleep command to the end of your `config.yml` to keep the container alive.
