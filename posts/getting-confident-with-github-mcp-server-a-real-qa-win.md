---
title: "Getting Confident with GitHub MCP Server: A Real QA Win"
date: "2025-11-21T18:52:00+0000"
categories: ["AI", "MCP", "Testing"]
banner: "github-mcp-server-qa.png"
color: "#fdba31"
description: "I had to QA a back-end PR with almost no context. GitHub MCP Server helped me do it, and also got one important detail wrong."
readingTimeMinutes: 6
---

Part 2 of 2 - [Part 1: Experimenting with GitHub MCP Server as a Front-End Dev](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev)

I'm a front-end developer. I understand back-end logic, but I don't work on it every day. So when I had to QA a back-end ticket with very little context, I wasn't sure I knew enough to do it.

The developer who wrote the PR hadn't left any testing steps. The only note was: "Refer to the previous PR - this one amends that." And that developer was busy somewhere else.

## How MCP Server helped me untangle it

I gave it the PR number, with no cloning or looking for paths, and asked MCP to:

- Review the PR code and description
- Follow any links, including the previously merged PR that did have testing steps
- Pull all of that together into something I, as a front-end developer, could actually understand

It gave me a list of what to set up locally, including environment steps and any data to prepare before starting QA. A full set of test scenarios (happy path, unhappy path, edge cases) with how each one should behave. Step-by-step instructions for each scenario, with the reason each one mattered.

That was enough for me to QA the PR properly instead of guessing.

## When MCP helps and still gets it wrong

Once I'd tested all the scenarios - with Windsurf helping me keep track - I asked MCP to produce a full test report for the back-end developer. The report was clear and detailed.

The back-end developer spotted a problem straight away.

One scenario required test data with an array. For the happy path it needed one or more elements. For the unhappy path it needed to be `undefined`. MCP set up the unhappy-path data as `[]` instead, which isn't the same thing.

Because the report was clear, the developer could point it out quickly. I fed the correction back, adjusted the data setup, reran the scenarios, and produced a corrected report. Everything then behaved as expected.

## What I learned

AI helped me work outside my area. I could QA back-end logic I barely understood, write detailed test scenarios, and explain the results clearly to my back-end colleague. On my own that would have taken hours of back and forth.

It still got an important detail wrong. The tests ran and the scenarios looked right, but because of the wrong data the unhappy path wasn't tested at all. That kind of thing can reach production. It helps to have someone who knows the back-end review the plan.

It hasn't made me a back-end engineer, but I can now understand back-end PRs, write test scenarios and follow linked logic without going through repos by hand.

---

Part 1: [Experimenting with GitHub MCP Server as a Front-End Dev](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev)
