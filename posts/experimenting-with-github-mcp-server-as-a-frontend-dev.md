---
title: "Experimenting with GitHub MCP Server as a Front-End Dev"
date: "2025-11-14T18:52:00+0000"
categories: ["AI", "Tooling", "GitHub"]
banner: "github-mcp-server-fullstack.png"
color: "#0d1117"
description: "Notes from experimenting with GitHub’s MCP Server as a front-end dev: cross-repo debugging, better types, and docs without cloning extra repos."
updated: "2025-11-21T18:52:00+0000"
readingTimeMinutes: 5
---

Lately I’ve been playing with GitHub’s MCP Server on Windsurf to see how far I can push it as a front-end developer. My goal was to write better code, faster, without constantly jumping between repos or tapping someone on the shoulder to ask how an API works.

What surprised me is how useful MCP became once I hooked it up to our API repos. Suddenly I could:

- Ask questions about parts of the back-end I don’t have checked out at all
- Cross-reference front-end errors with back-end logic
- Generate much nicer documentation
- Improve my types in places where I previously had too many `any`s
- Clarify assumptions before writing a PR

And all of this without cloning extra repos or relying too much on other developers.

Happy days!

## How GitHub MCP Server can help front-end developers

Most of us have been in the situation where a bug appears on the client, we know it “smells” like an API issue, but checking it takes time or interrupts the flow. With MCP, I could ask:

> Can you find where this endpoint is implemented? Show me how the response is shaped.

…and get an immediate, direct answer from the back-end repo.

No guessing, no Slack messages, no scrolling through files I don’t normally touch. Even better, I could ask it to compare my code with their code:

> Here’s the front-end function. Does it match how the API behaves?

MCP became a bridging layer between worlds. Not replacing human conversations, just reducing the back-and-forth.

If you want the technical setup, the [official docs](https://docs.windsurf.com/plugins/cascade/mcp) explain it much better than I will.

## Debugging with cross-repo context

One of my favourite tricks was asking MCP to read a front-end error and trace where the data originally came from in the back-end. It felt like having a senior engineer sitting next to me doing pair programming.

For example:

- I’d feed it a confusing TypeScript error
- Ask it to locate the relevant API model
- And then ask it to rewrite my types to match the actual shape

It didn’t always get it right (obviously), but it got me 80% of the context in seconds. That alone saved me hours.

## Add documentation to the context easily

Very few developers wake up excited to read back-end documentation either, but we all end up doing it when we’re trying to ship something on the front-end. The big win for me was that MCP could read the API repo for me (including whatever documentation it already has, like the README), and turn it into actionable context for what I’m building.

Instead of spending hours becoming an expert on a service I don’t normally work in, I could ask:

> Based on the README and the implementation, how am I supposed to use this endpoint from the front-end?

Then follow up with:

> What’s the exact response shape? What are the required fields? Any edge cases I should handle?

It doesn’t replace understanding, but it massively reduces the ramp-up time so I can stay in flow and implement the UI with confidence.

## Catching AI errors before they catch you

This part is important.
AI is helpful, but it’s also confidently wrong sometimes. Here are a few habits I developed that saved me from committing nonsense:

1. Always ask for the source of truth

Instead of “what does this endpoint do?”, ask:

> Show me the exact file and code where this logic lives.

If the answer isn’t what you expected, that’s your sign.

2. Ask it to explain its own reasoning

If something feels off:

> Explain step by step how you arrived at this conclusion.

AI hallucinations usually fall apart under scrutiny.

3. Use diff-style requests

When asking for code changes:

> Only show the diff, nothing else.

It forces precision and makes errors obvious.

4. Keep the responsibility on yourself

The AI is fast, but you know the project best. Always double-check anything that looks too magical

## Where this leaves front-end engineering

I’m not replacing my workflow with AI. But I’ve added a new tool that helps me:

- Ask better questions
- Understand the back-end faster
- Avoid wasting time on obvious mistakes
- Write cleaner types and documentation
- Stay in flow without switching repos

It feels like having a lightweight technical assistant who reads code all day and never gets bored. There are still limits (and trust me, you’ll hit them quickly), but even with those limitations, the impact on my daily work has been real.

I’ll keep experimenting - especially with automating PR reviews and generating tests - and I’ll share more once I’ve broken things enough times.

---

Part 2: [Getting Confident with GitHub MCP Server: A QA Win](/blog/posts/getting-confident-with-github-mcp-server-a-real-qa-win)
