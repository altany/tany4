---
title: "Getting Confident with GitHub MCP Server: A Real QA Win"
date: "2025-11-21T18:52:00+0000"
categories: ["AI", "Tooling", "QA"]
banner: "github-mcp-server-qa.png"
color: "#051025"
description: "I had to QA a back-end PR with almost no context. GitHub MCP Server helped me do it properly; and then made one subtle mistake that reminded me why humans still need to check the output."
readingTimeMinutes: 6
---

Part 2 of 2 - [Part 1: Experimenting with GitHub MCP Server as a Front-End Dev](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev)

I'm a front-end developer. I live in components, hooks, UI states, and TypeScript. Back-end logic I understand conceptually, but I don't work in it every day. So when a back-end ticket landed on my plate to QA - with very little context and no testing steps - I felt the usual mix of "I love a challenge" and "I definitely don't know enough for this."

To make it more interesting, the developer who wrote the PR hadn't left any testing steps. The only note was: "Refer to the previous PR - this one amends that." And that developer was busy somewhere else.

## How MCP Server helped me untangle it

This was the moment where MCP Server stopped being "a cool tool" and actually changed how I work.

I referenced the PR by number; no cloning needed, no hunting for paths. Then I asked MCP to:

- Review the PR code and description
- Follow any links, including the previously merged PR that did have testing steps
- Pull all of that together into something I, as a front-end developer, could actually understand

What I got back was exactly what I needed.

A clear list of what to set up locally, environment steps and any data I needed to prepare before starting QA. A complete set of test scenarios (happy path, unhappy path, edge cases) with descriptions of how each one should behave. Step-by-step instructions for each scenario that explained not just what to do but why it mattered.

For someone with limited back-end knowledge, that context was gold. It gave me enough confidence to QA the PR properly and feel that my work was actually meaningful, not guessy.

(Though, as you’ll see below, "confident" does not mean "correct.")

## When MCP helps and still gets it wrong

Once I'd tested all the scenarios - with Windsurf helping me keep track - I asked MCP to produce a full test report for the back-end developer. The report was clean, structured, and detailed.

But the back-end dev spotted something immediately.

One scenario required test data with an array. For the happy path it needed one or more elements. For the unhappy path it needed to be `undefined`. MCP initialised the unhappy-path data as `[]` instead; a subtle but important difference.

Because the report was so clear, the dev could point it out quickly. I fed the correction back, adjusted the data setup, reran the scenarios, and produced a corrected report. Everything then behaved as expected.

## Why this matters

Two things from this experience stuck with me.

AI can help you work outside your area of expertise. I was able to QA back-end logic I barely understood, produce detailed test scenarios, and communicate clearly with my back-end colleague. I couldn't have done that on my own, at least not without several hours of back-and-forth.

But AI will still get important details wrong. The tests ran. The commands worked. The scenario logic looked correct. But the wrong data setup meant the unhappy path wasn't actually being tested. That's the kind of thing that can slip into production if you're not paying attention. Having an expert review your plan or report isn't optional, it's the point.

## Final thoughts

MCP Server hasn't made me a back-end engineer. But it's made me more capable and more confident when I step outside my usual domain. It helps me understand back-end PRs quickly, generate detailed test scenarios, trace linked logic without navigating repos manually, and communicate more effectively with back-end colleagues.

It also constantly reminds me that AI is powerful but not infallible. Use it to accelerate your thinking, not replace it.

---

Part 1: [Experimenting with GitHub MCP Server as a Front-End Dev](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev)
