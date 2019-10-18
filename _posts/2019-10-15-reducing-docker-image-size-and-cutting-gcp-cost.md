---
layout: post
title: "Reducing Docker image size and cutting Google Cloud costs"
date: 2019-10-13
---

Google Compute Engine has a feature that lets you [launch a VM running specific Docker image](https://cloud.google.com/compute/docs/containers/deploying-containers). I've been using that to build [DebugBear](https://www.debugbear.com), a website monitoring tool for developers.

At some point I noticed my Google Cloud Storage spend going up an up (the blue bar). I was being billed mostly for "GCP Storage egress between NA and EU".

But that was weird, because I hardly use Cloud Storage, yet I was being billed 140GB of network egress a day. What was going on?

![Google Cloud Storage spend going up](/img/blog/docker-containers-gcp/increasing-cloud-storage-spend.png)

Eventually I realized that this is the cost of downloading the Docker images from Google Cloud Registry. 

Network egress is free within a region, so initially I never had any issues since the Docker image was in the US, just like my servers. But, as I was adding more VMs in other regions, I started being billed each time I launched a VM.

Running VMs in the UK cost me £2.84 a day, downloading the Docker images cost me £12.20!

There were two things I could do:

1. Reduce the size of my Docker image so that less data is transferred
2. Duplicate the Docker image in each region, to reduce download costs

## Reducing the size of the Docker image

This was the more straightforward change to make, so I started out with that.

First of all, how big is your Docker image? You can run `docker images | head` to find out:

```
REPOSITORY                  IMAGE ID       CREATED         SIZE
gcr.io/project/image-name   abcdef1234     36 hours ago    2.05GB
```

However, this will show you the uncompressed size of the image. If you go to the list of containers in the Container Registry dashboard you'll probably see a lower number, in my case 798MB. That's what's being transferred each time a VM is launched.

### Finding out what docker build steps are contributing to the image size

You can use the `docker history IMAGE_NAME` command to find out how different steps are contributing to the image size. This will help identify where you can save the most.

```
IMAGE  CREATED BY                                      SIZE
701e   /bin/sh -c #(nop) COPY dir:af0cd69827b8ca95e…   92.3kB
dd52   /bin/sh -c chown -R directory-abc /home/usr/…   7.92MB
902a   /bin/sh -c npm install --production && rm -r…   281MB
0df2   /bin/sh -c bash ./installChrome.sh              395MB
217b   /bin/sh -c apt-get update && apt-get install…   111MB
```

### Removing unnecessary apt-get installs and deleting downloaded package files

When I started working on the Docker image I didn't really worry about its size. So there were a bunch of easy steps I could take to make the image smaller.

- I was installing Go even though I didn't need it any more
- I was downloading a `.deb` file for Chrome, but didn't delete that file after installing Chrome
- Remove any `.zip` files after unzipping
- Remove a few dependencies I used for debugging, like `lsof` and `nano`

This saved around 400MB.

### Reduce npm install size

My `node_modules` directory also had some easy wins to make it slimmer:

- Don't download Chromium alongside Puppeteer (because I'm already downloading Chrome separately)
- Review package.json and remove unnecessary dependencies
- Only install production Node dependencies, with `npm install --production`

After this I took another look at the big dependencies in `node_modules` and noticed that I had two large `gprc` folders with C++ code in them, some files being over 2MB large. These files are needed for the compilation step when first installing the dependency, but once it's installed they aren't really needed any more.

So I decided to remove them, so instead of running `npm install` I ran something like `npm install && rm -r node_modules/grpc/deps/grpc/src`. This is a bit hacky, and there's a risk that at some point the dependency will change and those files will be required, but it saved a bunch of space. (You'll need to do this as one step with `&&`, I think it's to do with how layers work in Docker.)

In total doing this saved about 350MB, mostly by not downloading Chromium.

### Other tweaks

I also had a few `chown` commands, and by removing them or only applying them to a specific subdirectory I saved around 40MB.

Right now the two biggest contributors to my Docker image size are Chrome and Java. There's no way for me to get around downloading Chrome, but I'm only using Java to be able to run one command, and I might just move that work out to a different web service.

### Impact of the smaller Docker image on VM startup time

In total my image size went from 2.05GB to 1.19GB, or from 798MB to 501MB compressed (-37%).

One nice side effect of this was that my launching new VMs also became about 40s faster, from 125s to 85s (-32%).

![Chart showing how long it takes for VM to launch](/img/blog/docker-containers-gcp/faster-vm-startup.png)

## Downloading the Docker image from a nearby region

Downloading 1GB from a US bucket to a VM in the UK will cost £0.10. But if the Docker image is downloaded from a bucket in the EU there'll be no additional cost. So the ideal solution is to always fetch container images from a nearby location.

Google Container Registry provides three regions: US, EU, and Asia. I copied my Docker image to each region – most of the work here was generating separate VM templates, each using the correct Docker image name.

## Results

For the most part these two steps addressed my cost problems. 

![Cutting Google Cloud Storage network egress costs](/img/blog/docker-containers-gcp/cutting-cloud-storage-egress-costs.png)

You might notice the little purple bar at the end. That's "GCP Storage egress between AU and APAC".

Google Container Registry does not provide an Australia region, so there'll always be a cost in downloading the image from a different continent. Also, downloading from the APAC region isn't actually any cheaper than downloading from the US.

Right now, the servers in Australia cost me £0.20 a day to run, but downloading the images costs £2.01. It'll actually be cheaper for me to keep the VMs running longer and avoid the startup cost.