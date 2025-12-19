---
title: "7 Years at Olio"
subtitle: "What I've learned growing from mid-level developer to tech lead"
date: "2025-12-19T17:00:00+0000"
categories: ["Career", "React Native", "Leadership"]
highlight: true
new: true
color: "#f6256f"
banner: "olio-logo.svg"
description: "Reflections on 7 years of growth at Olio. From shipping a React Native MVP in 3 months to leading a front-end team. What I've learned about architecture, mentorship, and building products that matter."
readingTimeMinutes: 12
---

**TL;DR**: I've spent over 7 years at Olio, growing from a mid-level developer to Tech Lead. This post reflects on what I've learned about building products, leading teams, and growing as an engineer; lessons I hope are useful regardless of where you work.

---

When I joined Olio in 2018, the engineering team was fewer than 20 people. The company was early-stage, the app was being rebuilt, and I had no idea I'd still be here 7 years later. In that time, I've shipped a React Native MVP in 3 months, helped migrate an entire platform from Rails to React, mentored engineers who went on to lead their own features, and grown into a Tech Lead role I never planned for.

This isn't a "how to succeed" post. It's a reflection on what I've learned - the hard way, mostly - about building software, working with teams, and growing as an engineer.

## The early days: shipping fast with a tiny team

In my first few months, we shipped the React Native app MVP in 3 months with a small team. It was intense. We made trade-offs we wouldn't make today. But we shipped, and the app now serves millions of users.

**What I learned:**
- Speed matters early on. Perfect is the enemy of shipped.
- The patterns you set in a rush often stick around for years. Try to get the fundamentals right even when moving fast.
- Small teams can move incredibly quickly when everyone trusts each other.

## Owning the release process

For over 4 years, I co-owned the mobile release process, coordinating weekly releases to iOS and Android. It sounds mundane, but it taught me a lot about reliability and communication.

**What I learned:**
- Release management is about communication as much as code. Stakeholders need to know what's shipping and when.
- Automating what you can (and documenting what you can't) saves everyone time.
- Being the person who "just handles it" builds trust, but you also need to share that knowledge so you're not a bottleneck.

## The Rails → React migration

One of the biggest projects I worked on was migrating the Volunteer Hub from server-rendered Rails views to a React SPA. This took over 2 years and involved rewriting critical flows while thousands of volunteers actively used the platform.

**What I learned:**
- Big rewrites can fail. Incremental migration works better.
- Business rules are often buried in legacy code. Extract them carefully before writing new code.
- The patterns you establish during a migration become the foundation for everything that follows. We're still using the routing and navigation patterns I helped set up years ago.

## Leading the Schedule Grouping rearchitecture

More recently, I led one of the largest front-end initiatives: rearchitecting how collections are displayed in the Volunteer Hub. We moved from a flat list to a schedule-grouped view that matches how volunteers actually think about their pickups.

This was technically complex: data transformation, state management, new UI components. But the real challenge was coordinating with backend, product, and ops to get it right.

**What I learned:**
- The best technical solutions come from understanding the user's mental model. We talked to ops teams and volunteers to understand how they thought about pickups.
- Complex features need clear ownership. I led the frontend, but we had to coordinate tightly with backend on the data contract.
- Shipping a rearchitecture without breaking things requires feature flags, careful rollouts, and a lot of testing.

## Mentoring and growing engineers

As I became more senior, I spent more time mentoring. I paired with junior/mid-level engineers on complex features, reviewed their designs, and let them own the implementation while guiding the architecture.

One of my proudest achievements has been watching engineers I mentored get promoted. They'd gone from uncertain about complex features to confidently owning and shipping them.

**Some hard-earned lessons:**
- Pairing beats prescribing. Sitting with someone while they work teaches more than a code review comment.
- Ask questions in reviews rather than dictating changes. "What would happen if X?" helps people think, not just comply.
- Letting go is hard but necessary. You can't scale yourself by being the person who writes everything.

## Developer experience matters

I've spent a lot of time on things that aren't "features" - fixing Docker environment issues, adding ESLint automation, enforcing stricter TypeScript, improving PR templates.

I remember spending a full day tracking down a Docker/MySQL port conflict that was randomly breaking everyone's local setup. Not glamorous. But fixing it meant the whole team could actually work again.

These kinds of investments pay off. A day of frustration for me saved weeks of frustration across the team. And gradual strictness works - we enforced TypeScript incrementally, and now it catches bugs before they ship.

## Prototyping and experimentation

I've built several prototypes, including a partner platform concept during a hackathon that later informed production features and the Sainsbury's partnership, and an AI-assisted appointment planner.

**What I learned:**
- Prototypes are for learning, not shipping. Build the minimum needed to test the idea.
- The value of a prototype is the decision it enables. Sometimes the answer is "don't build this."
- I enjoy working in ambiguous, early-stage spaces. Turning loose ideas into something concrete enough to evaluate is satisfying.

## Extending to charity volunteers

A key company milestone was extending the platform from Olio volunteers to charity volunteers. What seemed like "just another user type" ended up touching assumptions across the entire codebase. It was a good reminder that business impact comes from understanding the business, not just the code.

## Speaking at React Conf

In 2019, I [spoke at React Conf](/blog/posts/react-conf-2019) about how we built and scaled the Olio app. I was genuinely terrified. But preparing that talk forced me to understand our work more deeply than I ever had, and the response from the community reminded me how generous and curious people in tech can be.

## What I'd do differently

No reflection is complete without the things I wish I'd done better:

- **Earlier TypeScript adoption:** We migrated gradually, but I wish we'd been stricter earlier.
- **More automated testing:** While we had good coverage, some critical paths could have used more E2E tests.
- **Documentation:** I could have documented architectural decisions more systematically. Future engineers would have thanked me.

## What drives me now

After 7 years, what still excites me:

- **Shipping products that matter.** Olio helps redistribute food that would otherwise go to waste. The mission still feels meaningful.
- **Making complex things simple.** For users and developers alike.
- **Growing people.** Watching engineers I've worked with become confident, capable leaders.
- **Using AI to work smarter.** I use AI tools daily and I'm genuinely excited about where this is going.

---

If you're early in your career, I hope this is useful. The path isn't linear, and the things that matter most - communication, ownership, mentorship - aren't always the things you expect to focus on when you start out.

And if you're mid-career and wondering whether to stay somewhere long-term: there is true value in deep knowledge. Seeing a codebase evolve over years, watching engineers you mentored grow, and understanding a product deeply enough to make real architectural decisions are things you only get with time.

