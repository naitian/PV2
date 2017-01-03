---
title: 'clion'
description: 'a command line client for ion.tjhsst.edu'
thumbnail: 'clion.png'
technologies:
    - 'node.js'
    - 'es6'
    - 'commander.js'
---

# What is Clion??
{:.no_toc}

Clion (pronounced KLIYahn) is a command-line interface (CLI) for Ion, the [TJHSST
Intranet](https://github.com/tjcsl/ion). CLI + Ion = Clion. (not gonna lie, I
was pretty proud of that one...)

## Table of Contents
{:.no_toc}
* TOC
{:toc}

# Technical Talk

I built Clion in node.js (the one true dev language /s), and you can get it
[here](https://github.com/naitian/clion).

I used [git-like cli](https://github.com/jedmao/gitlike-cli) as the library
for parsing the commands and subcommands. Before that, I chekced out the
`commander.js` library, but ultimately that did not satisfy the requirement for
being able to easily add subcommands.

## Improvements and Current Bugs
I've slowly let Clion fall into disrepair, and I need to get around to fixing it
sometime. Some high-priority issues include:

- The date is sometimes incorrect when checking the bell schedule.
- It is sometimes unclear whether you are currently logged in, and the
    cryptic error messages do not help with troubleshooting
- At the initial creation of Clion, OAuth was not supported. However,
    authentication using OAuth has since been implemented in Ion, and I
    would like to take advantage of that soon.
