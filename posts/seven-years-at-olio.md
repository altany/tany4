---
title: "7 Years at Olio"
subtitle: "What I've learned going from mid-level developer to Tech Lead"
date: "2025-12-19T17:00:00+0000"
categories: ["Career", "Leadership"]
highlight: true
new: true
color: "#f6256f"
banner: "olio-logo.svg"
description: "Reflections on 7 years at Olio, going from mid-level developer to Tech Lead. What I learned about architecture, shipping products, and working with people along the way."
readingTimeMinutes: 14
---

**TL;DR**: I've spent over 7 years at Olio, going from mid-level developer to Tech Lead. This post is a reflection on what I learned about building products, working with other people, and growing as an engineer. Hopefully some of it is useful regardless of where you work.

## The early days: shipping fast with a tiny team

When I joined Olio in 2018, the engineering team was three people including me. The product was early stage, we were rebuilding the app, and honestly I had no idea I'd still be here seven years later.

In the first few months we built the React Native app MVP in about three months. It was intense. We made trade-offs we probably wouldn't make today, but we shipped it and that app now serves millions of people. Being in such a small team meant touching everything, from map performance to ads logic. It was exhausting and exciting at the same time.

I learnt that early speed matters, but the patterns you set early tend to stick. Small teams move fast when there's trust.

## Owning the release process

For over four years I co-owned the mobile release process, coordinating weekly releases for iOS and Android. It sounds routine, but it taught me a lot.

Release management is as much about people as it is about code. Automating what you can and documenting the rest saves time. Being reliable builds trust, but knowledge needs to be shared so you don't become a bottleneck.

## The Rails to React migration

One of the bigger projects was migrating the Volunteer Hub from server-rendered Rails views to a React SPA. It took over two years and happened while the platform was actively used by thousands of volunteers.

Large rewrites only work when done incrementally. Important business logic tends to live in unexpected places. And the decisions you make during a migration shape the codebase for years.

## Leading a large UI rearchitecture

Later I led a rearchitecture of schedule grouping in the Volunteer Hub. The goal was to make the UI reflect how volunteers actually think about their pickups, rather than how the data was structured on the backend.

Good technical solutions come from understanding real user workflows, not just the spec. Complex work needs clear ownership. Feature flags and careful rollouts make a big difference.

## Mentoring and growing engineers

As I got more senior, mentoring became a bigger part of what I did. I paired with engineers on hard problems, reviewed their designs, and tried to help them think through decisions without taking over.

One of the most rewarding things has been watching people I worked with grow into confident engineers. Some of the lessons here are simple: pairing teaches more than prescribing. Asking questions helps people learn better than giving answers. And letting go is necessary if you want others to grow.

## Developer experience matters

I spent a lot of time on things that aren't visible: fixing Docker issues, tightening TypeScript, improving PR templates, smoothing out local setup problems. Once, a Docker and MySQL port conflict blocked the whole team. Fixing it wasn't glamorous, but it removed friction for everyone.

These investments rarely stand out. But they save time and frustration, and they add up.

## Prototyping and experimentation

Over the years I built several prototypes. Some shipped, most didn't. What I learned is that prototypes are tools for learning and their value is not only always in what you release. I enjoy taking unclear ideas and turning them into something concrete enough to evaluate.

## Expanding to charity volunteers

Expanding the platform to support charity volunteers looked simple at first. In practice it surfaced assumptions buried across the whole system. It reinforced something I've come back to a lot: impact comes from understanding the business context, not just writing code.

## Building partner tools

I also worked on front-end tooling for partners (supermarkets and food businesses). This work had a different set of constraints: non-technical users, complex scheduling logic, interfaces that needed to be reliable and easy to understand. A lot of the same things mattered though: clear UX, predictable behaviour, close collaboration across teams.

## Speaking at React Conf

In 2019 I [spoke at React Conf](/blog/posts/react-conf-2019) about how we built and scaled the Olio app. It was nerve-wracking. Preparing the talk helped me understand our own work better, and the response from the community was generous.

## What I'd do differently

Be stricter with TypeScript earlier. Invest more in targeted automated testing. Document architectural decisions as they happen, not after.

## What still drives me

After seven years and multiple codebases, including the consumer app, volunteer tools, partner tools, and some backend work, I still enjoy building things that matter. I like simplifying complex systems. I care about helping people grow. And I'm genuinely excited about using better tools, including AI, to work more thoughtfully.

If you're early in your career, I hope some of this helps. Paths are rarely linear, and some of the most important skills take time to notice. And if you're mid-career and wondering whether staying somewhere long term makes sense, deep knowledge and shared history can be valuable in ways that are hard to measure.
