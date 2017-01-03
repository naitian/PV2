---
title: 'dictcc-js'
description: 'an unofficial Javascript API for dict.cc'
thumbnail: 'dictcc-js.png'
technologies:
    - 'node.js'
    - 'es6'
    - 'request.js'
---
# What's dictcc-js? :de::us:
{:.no_toc}
An unofficial API for [dict.cc](http://dict.cc). It's a European language dictionary that was originally meant for German-English.

## Table of Contents
{:.no_toc}
* TOC
{:toc}

*The following is taken shamelessly from my Github README.*

# Installation
Run `npm install dictcc-js`.

# Documentation
Current dictcc-js only has one function, `translate`

`translate` takes 4 arguments:
- `from` is the language you're translating from.
- `to` is the language you're translating to.
- `term` is the term you would like to translate.
- `callback`
  - `response`
    - The response value is an array of objects with a `from` property and a `to` property.
  - `error`
    - `null` if no error.

Either the `from` or `to` argument _must_ be either "en" or "de"

```javascript
dictcc = require('dictcc-js');
dictcc.translate("en", "de", "term", (res, err) => {
  res.forEach((val, ind, arr) => {
    console.log(val.from + " = " + val.to);
  });
});
```

# Troubleshooting

Make sure the languages you're translating are supported. Currently supported languages only include:
- Bulgarian
- Bosnian
- Czech
- Danish
- Deutsch
- Greek
- English
- Esperanto
- Spanish
- Finnish
- French
- Croatian
- Hungarian
- Icelandic
- Italian
- Latin
- Dutch
- Norwegian
- Polish
- Portuguese
- Romanian
- Russian
- Slovak
- Albanian
- Serbian
- Swedish
- Turkish

## Contribute at the [Github Repo](https://github.com/naitian/dictcc-js)
