---
title: "What I built after Kent C. Dodds's webinar"
date: "2026-10-17T12:00:00+0000"
categories: ["AI"]
banner: "two-weeks-on.png"
color: "#eef4ff"
description: "Two weeks after writing about Kent C. Dodds's agent setup: decision notes every agent session reads, a weekly read of the code that recommends instead of deleting, and a backup we actually restored."
readingTimeMinutes: 3
new: true
---

**TL;DR**: Two weeks ago I wrote about [what I was taking from Kent C. Dodds's agent setup](/blog/posts/what-i-take-from-kent-c-dodds-agent-setup). Three of them are running now: decision notes, a weekly read of the code, and a backup restore.

## Decision notes

Every time we decide something, we write a short note: what we chose, what we turned down, and what it means for the code. There are forty of them after two weeks.

When making a change, the agents read the notes for that area and check whether there is already a decision about it. Before, a decision stayed in my head or somewhere in a chat. The next session either worked it out again, or decided something different without me noticing. Now every session has what it needs to keep the code consistent.

We never rewrite a note. If we change our minds, we mark the old note as replaced and write a new one, and the old reasoning stays there to read.

## A weekly read of the code

Kent's agents delete code automatically, as part of code health and maintenance. Mine generates a report with recommendations, and I choose what to implement as a pull request. For now I enjoy having more control over our codebase, despite Kent's trust in what the agents can do.

The first run found 111 things. Some of the ones I have fixed so far:

- Converted the background images to WebP, which cut them by about 79%.
- Turned logging off outside development, so the app stopped uploading logs nobody reads.
- Stopped saving two slices of data the app never used.
- Deleted a feature nothing could reach any more, around 4,500 lines of code and tests.
- Made search wait for a pause in typing, so it fires a couple of requests instead of a dozen. Results appear slightly later, which I decided was worth it.

More are still on the list.

## We restored a backup

Setting up backups is not enough. You only know they work once you restore one, so I did that and wrote down every step and how long it took. Getting a working backend running on the restored copy took about 25 minutes. If something goes wrong, the team and I know exactly what to do and what to expect.

Restoring also brings back accounts that people deleted after the backup was taken. We have to delete them again before the app goes live, and that step is now in our restore instructions.

## Where this fits

All of this runs alongside the [parallel coding sessions](/blog/posts/running-ai-coding-sessions-in-parallel) I wrote about in September. On a busy day, eleven to fifteen sessions are active in the same hour on the same project, so I can't keep every decision in my head any more. The notes keep the decisions, the reports tell me what needs fixing, and I decide what changes.
