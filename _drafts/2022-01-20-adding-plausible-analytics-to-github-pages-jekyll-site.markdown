---
layout: single
title:  Adding Plausible Analytics to Github Pages Jekyll Site
date: 2022-01-20 09:21:00 -0500
categories: blog_meta jekyll plausible analytics
---

I recently moved this blog from SquareSpace to a Github Pages site. The site is a statically generated site built by
Jekyll. I wanted to know who is visiting the site in a privacy respecting way -- the short and obvious answer is almost
nobody is visiting the site, turns out you have to do a lot of things in order to generate significant interest in your
blog, and I fail miserably at step 0: Write and post consistently. I decided on Plausible because I already researched
privacy respecting analytics for my company's website, decided on Plausible, and I already pay for an account

Undeterred by the apparent lack of interest in my blog, I searched for "Add Anayltics to Github Pages site using
Plausible". I also consulted the
[Plausible Integrations documentation](https://plausible.io/docs/integration-guides#jekyll). Both recommended a Jekyll
plugin called ["jekyll-analytics"](https://github.com/hendrikschneider/jekyll-analytics). I followed the instructions
for installation and configuration of this plugin and tested it in my development environment only to learn there was a
problem. There is a [known bug](https://github.com/hendrikschneider/jekyll-analytics/issues/47) with the current version
and also a workaround. I was a bit concerened that the issue is over a year old and that the proposed workaround was
posted 9 months ago -- not exactly signs of vigorously maintained plugin.

Rather than implement the workaround for the plugin, I decided that it couldn't be that hard to add a JavaScript link
to every page of the site and focussed my search on figuring out how to do that. Sifting through the search results I
found an article,[Creating Custom Assets for Your Gem-Based Jekyll Theme](https://javascript.plainenglish.io/creating-custom-assets-for-your-gem-based-jekyll-theme-d488ac44195d) that contained the information I was looking for
about half way down. The method, basically extracted and detailed in my own blog post
[Adding Custom Elements to the Head of Your Jekyll Site]() involves making a local copy of a file, in this case
head.html, in an _includes directory. The original file resides in the _includes directory of your Jekyll theme, which
in my case is Minima.

My approach is not without risk