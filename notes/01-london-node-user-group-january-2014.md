---
layout: notes
permalink: /london-node-user-group-january-2014.html
title: London Node User Group January 2014
group: notes
date: 20 January 2014
---

## Resin.io - Web Technologies, meet hardware (by [*Alexandros Marinos*](https://twitter.com/alexandrosM))

- Hardware has long update cycles, while deployment on the web is easy
- Bins with screens (presumably [http://renewlondon.com](http://renewlondon.com/))
	- JS-based setup

### Why Javascript

- 50x speed increase over last 7 years
- Embedded devices combine hardware and user interaction
- Allows quick code evolution

### The first device is easy... how do you reach a large number of devices?

- Resion.io
	- Integrates different components (Docker, Node, Git, ...)
	- Deploy from git to device
	- Steps:
		- Download disk image and install it
		- Device appears in dashboard
		- Code is pushed from git to devices

Linux containers (Docker)
- Save space/bandwidth by sending diffs
- Rollback capability (can't push changes that break the deploy system and leave the device unreachable)

## NodeJS and Arduino (by [*Alex Roche*](https://twitter.com/alexHacked))

What is an Arduino
- Open source microcontroller boards
- Receive and transmit current to electronic components
- Pins:
	- Analogue: values between 0 and 1023
	- PWM: values between 0 and 255 (pulse width modulation)

## UX for your Node modules (by [*Rowan Manning*](http://twitter.com/rowanmanning))

- Npm has a huge number of modules, the barrier to create a module is very low
- People struggle to make decisions about what packages to use
- Make decision easier by providing key details

### Readmes

- Often and after-thought to modules
- Should answer these equesstions:
	- Overview
		- What is this?
		- What's the current version?
		- What platforms does it support? (Browser and Node versions)
		- Build Status (Travis)
	- Install (How do I install it)
	- How do I use it?
	- How to contribute (clone repo, run npm test, commit, pull request, ...)
	- Am I allowed to use it - licensing
	- Is it still maintained?
