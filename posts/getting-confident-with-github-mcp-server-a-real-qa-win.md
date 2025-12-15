---
title: "Getting Confident with GitHub MCP Server: A Real QA Win"
date: "2025-11-21T18:52:00+0000"
categories: ["AI", "Tooling", "GitHub"]
banner: "github-mcp-server-fullstack.png"
color: "#0d1117"
description: "How GitHub MCP Server helped me QA a backend PR with almost no context, and the subtle mistake (undefined vs []) that proved why humans still need to verify."
updated: "2025-11-21T18:52:00+0000"
readingTimeMinutes: 6
---

Part 1: [Experimenting with GitHub MCP Server as a Front-End Dev](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev)

After spending a bit more time pairing with GitHub’s MCP Server, I started doing things I normally wouldn’t feel comfortable doing - at least not with confidence.

I’m a front-end developer. I live in components, hooks, UI states, and TypeScript. Backend logic, API setup details, server-side workflows… I understand them conceptually, but I don’t swim in that water daily. So when a backend ticket landed on my plate to QA - part of a bigger project, with very little context - I felt the usual mix of “I love a challenge” and “I definitely don’t know enough for this.”

To make it more fun, the developer drafting the PR hadn’t left any testing steps. The only note was: “Refer to the previous PR; this one amends that.” And that developer was busy somewhere else. 🙈

## How MCP Server helped me untangle the whole thing

This was the moment where MCP Server became more than “a cool tool” and actually changed how I work.

I referenced the PR with just its number - no need to clone the repo yet, no hunting for paths. Then I asked MCP to:

- Review the PR code
- Review the PR description
- Follow any links (including the previously merged PR, which did have testing steps)
- Combine all this into something I, as a front-end developer, could understand

What I got back was exactly what I needed:

1. A clear list of what I had to set up locally

It outlined all the environment steps and any data I needed to prepare before even starting QA.

2. A complete set of test scenarios

It generated a proper list of paths - happy, unhappy, edge cases - and described how each one should behave.

3. Step-by-step instructions for testing each scenario

Not just "run this command". It explained why the command mattered and how it connected to the functionality being updated.

For someone with limited backend knowledge, this context was gold. It gave me enough confidence to QA the PR properly and feel that my work was actually meaningful, not guessy.

(Though, as you’ll see below, "confident" does not mean "correct.")

## When MCP helps and still gets it wrong

Once I finished testing all scenarios - with Windsurf helping me keep track of what passed - I asked MCP to produce a full test report for the backend developer. The report was clean, structured, and detailed. But the backend dev spotted something immediately.

One scenario required the test data to include an array:

- For the happy path, the array needed one or more elements
- For the unhappy path, the array needed to be undefined

Cascade (via MCP) got that wrong and initialised the unhappy-path data as `[]` instead of `undefined`.

A subtle but important difference.

Because the report was so clear, the dev could quickly point it out and suggest retesting with the correct data setup. I fed that correction back into MCP, and it helped me tweak the data setup, rerun the scenarios, and regenerate a corrected test report. Everything then behaved exactly as expected.

## Why this matters

This whole experience really drove home two things:

1. AI can help you work on things outside your expertise

I was able to QA backend logic I barely understood, produce detailed scenarios, and communicate confidently with my backend colleague. I simply wouldn’t have been able to do this on my own, at least not without several hours of back-and-forth.

2. AI will still get important details wrong

And you need to be the one watching.

In my case:

- The tests ran
- The commands worked
- The scenario logic looked correct

But the wrong data setup (`undefined` vs empty array) meant the unhappy path wasn’t actually being tested. This is the kind of mistake that can easily slip into production if you rely on AI blindly. It’s also why having another human - the expert - review your testing plan or final report is non-negotiable.

## Final thoughts

Using MCP Server hasn’t magically made me a backend engineer. But it has made me far more capable, curious, and confident when stepping outside my usual domain.

It lets me:

- Understand backend PRs quickly
- Generate detailed test scenarios
- Trace linked logic without manually navigating repos
- Communicate more effectively with backend colleagues
- Learn by doing, not by guessing

But it also constantly reminds me that AI is powerful, but not infallible.

Use it to accelerate your thinking, not replace it.
And always, always keep an expert in the loop.

---

Part 1: [Experimenting with GitHub MCP Server as a Front-End Dev](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev)
