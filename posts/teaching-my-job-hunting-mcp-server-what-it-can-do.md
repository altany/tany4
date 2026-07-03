---
title: "Teaching my job-hunting MCP server what it can do"
date: "2026-07-02T12:00:00+0000"
categories: ["AI", "Tooling", "MCP"]
banner: "job-hunter-mcp.png"
color: "#006e8f"
description: "Once my job-hunting MCP server was remote, the agent kept pushing back: 'that's not possible', duplicate rows, refusing to use a doc I'd linked. The problem wasn't the model. It was my tool descriptions."
readingTimeMinutes: 5
new: true
---

Part 3 of 3 - [Part 1: Building a job-hunting MCP server](/blog/posts/building-a-job-hunting-mcp-server) · [Part 2: Taking it remote](/blog/posts/taking-my-job-hunting-mcp-server-remote)

**TL;DR**: After I moved the server remote ([part two](/blog/posts/taking-my-job-hunting-mcp-server-remote)), I used it every day and kept hitting the same wall: the agent would say something wasn't possible when it was, create a duplicate row instead of updating one, or refuse to add notes to a Google Doc I'd already linked. None of this was really the model's fault. It only had my tool descriptions to go on, and they were thin. Fixing it meant writing better tool descriptions, adding a server "instructions" field, and making a couple of the tools more forgiving.

## The symptoms

A few things happened often enough to annoy me:

- I'd ask it to change the rating on a company already in my tracker, and it would add a second row for the same job instead of updating the first.
- I'd paste a Google Doc link for a company and ask it to save some notes there, and it would tell me it couldn't.
- Sometimes it would try to create a doc on its own, and fail.
- In general it acted like it didn't know which tools existed or what order to use them in.

## Why it happened

The agent's whole picture of what's possible comes from two things: the description on each tool, and an optional server-level "instructions" field that the client loads once per session. Mine were thin, one line per tool, and I had no instructions at all. So when I asked for something a one-line description didn't cover, the agent guessed, and it usually guessed that it couldn't.

The duplicates had a more specific cause. To update a row, the server looks it up by company and job title. If the title was worded even slightly differently from what was stored, the lookup failed, the update "couldn't find" the row, and the agent fell back to adding a new one.

## What I changed

**Server instructions.** MCP lets the server send a short block of text that the client keeps as context for the whole session. I used it to describe what the server is, the normal flow (rate a role, save it, keep it updated, prep before interviews), and, just as important, what isn't possible. For example: it can't create Google Docs on a personal Drive, so if there's no doc linked, ask me for the link instead of failing or inventing one. And: to change something about an application that already exists, update it, don't add it again.

**Clearer tool descriptions.** The update tool now says plainly that it changes any field, including the rating, and that it's the one to use when a company is already in the tracker. The add tool says it's only for something new. A small change, but it stops the agent reaching for "add" when it means "update".

**Forgiving matching.** The lookup now normalises the text, and if the title is worded differently it falls back to matching on the company alone when there's only one. That's the fix that stops the duplicates.

**Doc tools that take a link.** The doc tools now accept the Google Doc URL directly: paste the link and the tool saves it against that application and reads or writes it in one step. If nothing is linked and I don't give a URL, it asks for one instead of failing. And if it still can't read the doc, it says why: the doc has to be shared with the service account, the same way the spreadsheet is.

## What I took from it

The model wasn't the problem. It could only work with what I gave it, and I hadn't given it much. The tool descriptions and the instructions field are what the agent actually reads, and I'd been treating them as an afterthought. Writing them properly made more difference than any of the code changes.

One catch worth knowing: the client caches the tool list, so none of this takes effect until you disconnect and reconnect the server. I forgot that the first time and spent a while wondering why nothing had changed.

The code is on GitHub at [altany/job-hunter](https://github.com/altany/job-hunter). If you're building an MCP server and the agent keeps pushing back, look at the tool descriptions and the instructions field first.

---

Part 1: [Building a job-hunting MCP server](/blog/posts/building-a-job-hunting-mcp-server) · Part 2: [Taking my job-hunting MCP server remote](/blog/posts/taking-my-job-hunting-mcp-server-remote)
