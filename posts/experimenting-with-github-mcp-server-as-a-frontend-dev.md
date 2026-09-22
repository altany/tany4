---
title: "Experimenting with GitHub MCP Server as a Front-End Dev"
date: "2025-11-14T18:52:00+0000"
categories: ["AI", "MCP"]
banner: "github-mcp-server-fullstack.png"
color: "#2f585a"
description: "Using GitHub's MCP Server as a front-end developer to understand back-end code faster and improve my types, without jumping between repos."
updated: "2025-11-21T18:52:00+0000"
readingTimeMinutes: 5
---

Part 1 of 2 - [Part 2: Getting Confident with GitHub MCP Server: A Real QA Win](/blog/posts/getting-confident-with-github-mcp-server-a-real-qa-win)

I've been trying GitHub's MCP Server to see how useful it is for a front-end developer. I wanted to write better code faster, without jumping between repos or asking someone how an API works. Once I connected it to our API repos, it helped more than I expected.

I could:

- Ask questions about parts of the back-end I don't have checked out at all
- Cross-reference front-end errors with back-end logic
- Generate much nicer documentation
- Improve my types in places where I had too many `any`s
- Clarify assumptions before writing a PR

All without cloning extra repos, and with fewer questions to other developers.

## How it helps front-end developers

A common case: a bug shows up on the client and looks like an API issue, but checking it takes time or means interrupting someone.

With MCP I could ask:

> Can you find where this endpoint is implemented? Show me how the response is shaped.

and get an answer from the back-end repo, without a Slack message or scrolling through files I don't normally touch.

I could also ask it to compare my code against the API:

> Here's the front-end function. Does it match how the API actually behaves?

I still talked to colleagues, just with less back and forth.

## Debugging with cross-repo context

I liked giving it a front-end error and asking it to trace where the data came from in the back-end.

I'd give it a confusing TypeScript error, ask it to find the relevant API model, then ask it to rewrite my types to match the actual shape. It didn't always get it right, but it gave me most of the context in seconds.

## Adding documentation to the context

MCP could read the API repo, including the README and docs, and apply it to what I was building.

Instead of spending hours learning a service I don't normally work on, I could ask:

> Based on the README and implementation, how am I supposed to use this endpoint from the front-end?

Then follow up with questions about the response shape, required fields and edge cases.

## Catching AI errors

AI is sometimes wrong and sounds sure about it. A few things that helped me catch it:

1. Ask for the source of truth.

Instead of "what does this endpoint do?", ask: 
> Show me the exact file and code where this logic lives.

If the answer isn't what you expected, something's off.

2. Ask it to explain its reasoning.

If something feels off:

> Explain step by step how you arrived at this conclusion.

Made-up answers usually fall apart when you ask this.

3. Use diff-style requests.

When asking for code changes:

> Only show the diff, nothing else.

Mistakes are easier to spot in a diff.

4. Keep responsibility on yourself.

You know the project better than the AI does. Double-check anything that looks too good.

## Where I am with it

It doesn't replace how I work, but it helps me understand the back-end faster and write better types without switching repos.

It has limits and I hit them quickly. Next I want to try it for PR reviews and writing tests.

---

Part 2: [Getting Confident with GitHub MCP Server: A QA Win](/blog/posts/getting-confident-with-github-mcp-server-a-real-qa-win)
