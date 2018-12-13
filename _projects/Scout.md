---
title: Scout
thumbnail: 'scout.jpeg'
description: Ctrl+F for Videos
technologies:
    - Chrome
    - javascript
    - python
    - flask
---

# Scout

> Find what you want, before you get there.

![Scout Screenshot](https://imgur.com/fRP8MJR.png)


## Table of Contents
{:.no_toc}
* TOC
{:toc}

## What is Scout?

Scout is a Chrome extension that lets you search for scenes in Youtube videos by using computer vision to determine what's in each frame.

I made this with [David Zhao](https://github.com/davidbzhao) at Georgetown University for HoyaHacks.

## How it's made

### Image Parsing
We used Amazon's Rekognition image recognition service to identify objects within the frames of a video.

### Preprocessing

The preprocessing was composed of three steps:

1. Download the video
2. Lower resolution
3. Split into frames

Using the `youtube-dl` library, we combined the first two steps, choosing to download a standard definition video to cut down on both download time and processing time.

In almost all cases, it is unnecessary to check every frame, since the scene generally does not change 30 times a second. We initially tried to detect scene changes, but the extra processing overhead was not worth it, and we ended up just taking one frame from every three seconds of video.

Ultimately, the largest bottleneck for speed was downloading the videos.

### UI

We determined early on that a Chrome extension would be the best fit for this sort of project, since it was an extension to YouTube.

The interface is simple: a single button that, when clicked, expands into a search box. We used a JavaScript library to implement fuzzy searching. Clicking on the timestamps skips to a couple of seconds before the relevant frame, because we noticed sometimes the subject of the search would not remain long enough in frame, so it was useful to provide some context and time for the user to react.

### Backend

The backend consisted of a simple Flask server, hosted on [Director](https://director.tjhsst.edu). All of the frame results are stored in AWS, so each video needs only be processed once for all users.
