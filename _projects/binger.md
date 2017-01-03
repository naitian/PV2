---
title: 'Binger'
description: 'Tinder for movies and TV shows'
thumbnail: 'binger.png'
technologies:
    - 'javascript'
    - 'html5'
    - 'css3'
    - 'firebase'
---
# What's Binger?
{:.no_toc}

Binger is a web application that presents you with movies and TV shows and lets
you swipe to decide whether to watch them later or not.

## Table of Contents
{:.no_toc}
* TOC
{:toc}

# Technical Talk

## Back End
We used Firebase for storing back-end information, which also proved useful for
login using social media sites such as Facebook and Google.

I also ran a proxy server, which served to consolidate API requests (we used
many, many, many APIs for all of the movie and TV data).

## Front End
The front end was written by [David Zhao](https://github.com/Snowyblack58)
and me. We used the [material.io](https://material.io) framework to make things
look nice. One challenge we ran into was making an interactive swiping
interface, which we ultimately found a library for.

## What I was happy with
We were able to make a proto-progressive web app that was mobile-oriented.

## What I would change
If I were to redo this project, I would use an MVC to cut down on the amount of
repetition in the code. I also have a better web server setup now, which means I
don't have to do something as hacky as `server.naitian.org:8080` as the proxy
endpoint...

# Can I try it out?
Unfortunately, no :cry:. It used to be live [here](naitian.github.io), but the
proxy script that I used to field all of the API calls is not running right now.
(In fact, I'm not even sure where it is...) However, if I do find the script, I
might refactor some things and relaunch it.

# Screenshots

{% include image.html file="binger-login.png" caption='Login page.'
size='small' %}

{% include image.html file="card.png" caption='A card for a movie. Swipe right
to save, left to discard.' size='small' %}

{% include image.html file="binger-list.png" caption='List of saved shows and
movies.' size='small' %}

# More stuff

This project was built for HackUMBC Spring 2016, and you can read more about it
on [Devpost](http://devpost.com/software/binger).
