---
title: "7 Years at Olio"
subtitle: "What I've learned going from mid-level developer to Tech Lead"
date: "2025-12-19T17:00:00+0000"
categories: ["Career"]
highlight: true
color: "#f6256f"
banner: "olio-logo.svg"
description: "What I learned in 7 years at Olio, going from mid-level developer to Tech Lead: architecture, shipping products and working with people."
readingTimeMinutes: 14
---

**TL;DR**: I've spent over 7 years at Olio and went from mid-level developer to Tech Lead. These are the things I learned about building products, working with people and growing as an engineer.

## The early days

When I joined Olio in 2018, the engineering team was three people including me. The product was early stage and we were rebuilding the app.

We built the first version of the React Native app in about three months. We made trade-offs we probably wouldn't make today, but we shipped it, and millions of people use that app now. In such a small team I worked on everything, from map performance to ads logic.

What I took from that time: the patterns you set early are hard to undo, and a small team can only move that fast if people trust each other.

## Owning the release process

For over four years I co-owned the mobile release process, with weekly releases for iOS and Android.

A lot of it was coordinating people, not code. We automated what we could and documented the rest. I also learned to share what I knew, so releases didn't depend on me.

## The Rails to React migration

One of the bigger projects was migrating the Volunteer Hub from server-rendered Rails views to a React SPA. It took over two years, while thousands of volunteers were using the platform.

We did it bit by bit. Important business logic kept turning up in places we didn't expect, and the decisions we made along the way stayed in the codebase for years.

## Leading a large UI rearchitecture

Later I led a rearchitecture of schedule grouping in the Volunteer Hub. The goal was for the UI to match how volunteers think about their pickups, not how the data was structured on the backend.

To get it right I had to understand how volunteers actually work, not only read the spec. We released it behind feature flags, a bit at a time.

## Mentoring and growing engineers

As I got more senior, mentoring became a bigger part of what I did. I paired with engineers on hard problems, reviewed their designs, and tried to help them think through decisions without taking over.

I liked seeing people I worked with become confident engineers. Pairing worked better than telling people what to do, and asking questions worked better than giving answers. I also had to let them make their own decisions.

## Developer experience

I spent a lot of time on things that aren't visible: fixing Docker issues, tightening TypeScript, improving PR templates, smoothing out local setup problems. Once, a Docker and MySQL port conflict blocked the whole team until I fixed it.

## Prototypes

Over the years I built several prototypes. Some shipped, most didn't. I like taking an unclear idea and making it concrete enough for the team to decide on.

## Expanding to charity volunteers

Adding charity volunteers to the platform looked simple at first. In practice, assumptions about volunteers were spread across the whole system, and we had to find and change them.

## Building partner tools

I also worked on front-end tooling for partners (supermarkets and food businesses). The users weren't technical and the scheduling logic was complex, so the interfaces had to be reliable and easy to understand.

## Speaking at React Conf

In 2019 I [spoke at React Conf](/blog/posts/react-conf-2019) about how we built and scaled the Olio app. I was very nervous. Preparing it helped me understand our own work better.

## What I'd do differently

Be stricter with TypeScript earlier. Invest more in targeted automated testing. Document architectural decisions as they happen, not after.

## What I still enjoy

I've worked on the consumer app, volunteer tools, partner tools and some backend. I still enjoy building useful things, making complex systems simpler and helping people grow. I'm also looking forward to working with better tools, including AI.
