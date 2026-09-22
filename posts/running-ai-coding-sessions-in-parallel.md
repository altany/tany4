---
title: "Running AI coding sessions in parallel"
date: "2026-09-22T12:00:00+0000"
categories: ["AI", "Tooling"]
banner: "parallel-sessions.png"
color: "#f3f0ff"
description: "How I went from two or three AI coding sessions to as many as fifteen at once on a two-person team, what broke along the way, and the hub session I added to keep track of it all."
readingTimeMinutes: 5
new: true
---

I'm one of two developers on an app for young athletes and their families. There's a lot to build and not much time. Because the users are children, quality is non-negotiable.

We use AI agents a lot, but it isn't vibe coding. The repos have detailed agent rules and documentation, and everything new gets tested properly. We could go faster by lowering the bar, but that's not an option. So to go faster I started running sessions in parallel.

## How it started

I started with two or three sessions. Each one works on one feature, sometimes on more than one task within that feature. Each has its own git worktree, so they don't change the same files on the same branch.

Over a couple of months that grew to 15 sessions at times.

## What went wrong

- **The sessions didn't talk to each other.** Separate worktrees weren't enough. Two sessions would touch the same code, and I'd get conflicts, duplicated work, and in a few cases one session working on top of another's changes. Two rules came out of this. Only one session works in each worktree. And a session takes instructions only from me, not from another session.
- **They didn't clean up after themselves.** Finished worktrees stayed on disk, each with its own dependencies, and I kept running out of space. Now every session removes its worktree once its PR is merged, and now and then I clean up folders that are still on disk but git no longer knows about.
- **I couldn't keep track of five or more sessions in my head.** The hardest part was the end of the day and the next morning. I often didn't know where to start.
- **Tests gave false results.** Two full test suites running at once on my laptop made unrelated tests fail. A killed run could also exit with code 0 and look like it passed. Now only one suite runs at a time, and a run only counts as passing if the test runner's own summary says so.

## A hub session

So I added one more session whose only job is to follow the others. It doesn't write code. It knows what each session is working on, passes my decisions to the session that needs them, decides which session runs tests next, and keeps a board up to date.

The board is one table with a row per PR or feature, grouped by who needs to act next: me, my colleague, a session that's still building, or nobody yet. Each row shows:

- the PR's current state on GitHub: CI, open review threads, conflicts
- whether it's been tested, how, and links to the evidence
- one line on what's needed to merge it

I read my own group first, because that's where I'm the one holding things up. Then what's waiting on my colleague. Then I look at the rest.

In the morning I ask the hub for a short summary and an up-to-date board, and have it check which sessions are still running. At the end of the day I tell every session to wrap up and leave its state on the board, so the next day starts from there.

## My part

I decide what gets built and how: the approach, the architecture and the trade-offs. I break the work down, set the rules the sessions follow, review what they produce, and test on a real phone. I talk to my colleague and the founder, and I decide what gets merged.

The sessions do most of the implementation, following the approach I set. They also take the repetitive work: running the tests and the automated review, drafting PR descriptions, collecting screenshots and other evidence, and looking into options when I need to make a call.

I enjoy doing my part, and I do more of it now that the agents take care of the repetitive work.

## Keeping the quality up

Every change goes through the same steps before my colleague reviews it:

- the full test suite, not only the tests for the files that changed
- automated code review, run locally and fixed until it comes back clean
- every review comment on the PR answered on its own thread
- for a backend change that changes a response, the old and new versions running side by side against a test environment, with the same request sent to both

When I'm preparing a big batch of merges or turning feature flags on, I also run an integration build: all open branches merged together into a preview of the app. It catches conflicts between sessions before review, and lets a session click through real screens and take screenshots.

A PR is only merged when my colleague has approved it, CI is green, and there are no conflicts or open review threads. Before it gets to my colleague, I test it locally: on the simulator, a real phone or with curl.

## What still doesn't work well

- **The board is often out of date.** I've tried many times to make it refresh on its own and always show the real state. More often than not it's behind, and watching for updates fails.
- **The hub keeps adding things I didn't ask for.** Explanations, extra sections, notes. The point of the board is to see everything at a glance, and I keep having to cut it back. Stricter rules for the hub would probably fix this. It's one more thing to set up.
- **Some work doesn't split well.** Two features that change the same files end up stacked, and the second has to be rebased every time the first changes.
- **It takes a lot of attention.** And my colleague has to review everything it produces, which on a busy day can be 15 to 20 PRs.

## What's next

Anthropic has just released a new version of Projects in Claude Code, in beta. It's close to what I built: one place to hand out work, parallel sessions on their own branches, and an overview of what's done and what needs me. The main difference is that its sessions run in the cloud. Mine run on my machine, so they can use the simulator, a local backend and the way I test, which is where most of my quality checks happen. That's why my setup works better for me for now, but I'll still try it and see how it compares.

I'm looking forward to seeing what more we can do as agents get better.
