---
title: "Experimenting with GitHub MCP Server as a Front-End Dev"
date: "2025-11-14T18:52:00+0000"
categories: ["AI", "Tooling", "Fullstack"]
banner: "github-mcp-server-fullstack.png"
color: "#2f585a"
description: "Notes from using GitHub's MCP Server as a front-end developer: how it helped me understand back-end code faster, improve my types, and stay in flow without jumping between repos."
updated: "2025-11-21T18:52:00+0000"
readingTimeMinutes: 5
---

Part 1 of 2 - [Part 2: Getting Confident with GitHub MCP Server: A Real QA Win](/blog/posts/getting-confident-with-github-mcp-server-a-real-qa-win)

Lately I've been playing with GitHub's MCP Server to see how useful it is as a front-end developer. I wanted to write better code, faster, without constantly jumping between repos or interrupting someone to ask how an API works. What surprised me is how much it helped once I connected it to our API repos.

Suddenly I could:

- Ask questions about parts of the back-end I don't have checked out at all
- Cross-reference front-end errors with back-end logic
- Generate much nicer documentation
- Improve my types in places where I had too many `any`s
- Clarify assumptions before writing a PR

And all of this without cloning extra repos or relying on other developers as much.

## How it helps front-end developers

You know the situation: a bug appears on the client, it looks like an API issue, but checking it takes time or interrupts someone else.

With MCP I could ask:

> Can you find where this endpoint is implemented? Show me how the response is shaped.

And get a direct answer from the back-end repo. No guessing, no Slack messages, no scrolling through files I don't normally touch.

I could also ask it to compare my code against the API:

> Here's the front-end function. Does it match how the API actually behaves?

It sat between the two, not replacing conversations with colleagues, just reducing the back-and-forth.

## Debugging with cross-repo context

One of my favourite things was feeding MCP a front-end error and asking it to trace where the data originally came from in the back-end. It was a bit like pairing with someone who already knew the back-end.

I'd give it a confusing TypeScript error, ask it to find the relevant API model, then ask it to rewrite my types to match the actual shape. It didn't always get it right, but it got me most of the context in seconds, which saved hours.

## Adding documentation to the context

Very few developers enjoy reading back-end documentation, but we all end up doing it. What helped was that MCP could read the API repo, README and existing docs included, and apply it to what I was building.

Instead of spending hours becoming an expert on a service I don't normally touch, I could ask:

> Based on the README and implementation, how am I supposed to use this endpoint from the front-end?

Then follow up with questions about the response shape, required fields, and edge cases. It saved a lot of ramp-up time.

## Catching AI errors

AI is helpful, but it's also confidently wrong sometimes. A few habits that stopped me committing nonsense:

1. Ask for the source of truth.

Instead of "what does this endpoint do?", ask: 
> Show me the exact file and code where this logic lives.

If the answer isn't what you expected, something's off.

2. Ask it to explain its reasoning.

If something feels off:

> Explain step by step how you arrived at this conclusion.

Made-up answers usually don't survive the follow-up.

3. Use diff-style requests.

When asking for code changes:

> Only show the diff, nothing else.

It forces precision and makes errors obvious.

4. Keep responsibility on yourself.

The AI is fast, but you know the project best. Double-check anything that looks too good.

## Where this leaves front-end engineering

I'm not replacing my workflow with AI. But it's a useful tool: it helps me ask better questions, understand the back-end faster, and write cleaner types without switching repos.

There are limits, and you hit them quickly. But it's made a real difference to my daily work. I'll keep experimenting, especially with PR reviews and generating tests.

---

Part 2: [Getting Confident with GitHub MCP Server: A QA Win](/blog/posts/getting-confident-with-github-mcp-server-a-real-qa-win)
