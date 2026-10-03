---
title: "What I'm taking from Kent C. Dodds's agent setup, and what I'm not"
date: "2026-10-03T12:00:00+0000"
categories: ["AI"]
banner: "kent-setup.png"
color: "#f1edff"
description: "Kent C. Dodds ships features to his own product without reading the code. I run parallel AI coding agents the same way, on an app used by children. Here's where our setups agree, what I'm adopting from his (friction logs, decision records, tested backups), and what I put in place of reading the code."
readingTimeMinutes: 6
new: true
---

**TL;DR**: I've been running AI coding agents in parallel for a few months. Kent C. Dodds streamed how he does the same thing on his own product, and most of the shape is identical, which was a relief. I'm taking six things from his setup. Like him, I don't read the code the agents write. What differs is what each of us puts in its place.

A couple of weeks ago I wrote about [running AI coding sessions in parallel](/blog/posts/running-ai-coding-sessions-in-parallel): one session per feature, each in its own git worktree, and one extra session that writes no code and keeps track of the rest. Then I watched this, two hours of him building a feature live:

<iframe width="100%" height="400" src="https://www.youtube.com/embed/3kK3rfb1BZQ" title="How Kent Ships Features Without Reading the Code" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I'd built my setup before the tools that do this existed, and the question I kept asking myself was whether I was being reckless with how much I hand over. The useful part of watching someone else's version wasn't just the tips. It was the confirmation that leaning on what these models can do now isn't naive. They are that good. The work is in the checks you put around them.

## What came out the same

**One agent that coordinates and writes no code.** He talks to a planning agent, agrees what to build, and hands it to a separate coding agent. He's stopped watching the individual agents work. That's my hub session, and it's the part people find strangest when I describe it.

**Many agents, each in its own isolated environment.** His run in the cloud, each with its own machine. Mine run on my laptop, each in its own git worktree.

**Feature flags as the actual safety net.** Not tests, not review: the flag. Risky work ships switched off and gets turned on separately. He makes the point that a flag turns a decision you can't undo into one you can.

**Automated review that runs separately from the agent that wrote the code.** He uses several, each in its own context, and the implementing agent never reviews itself. His agents are told to check review comments rather than apply them, which is also my rule.

**A rule instead of a mood for merging.** His agent merges when everything is green. I wrote the rule down and the hub applies it. Neither of us presses the button because the change feels fine.

**Do it by hand first, then hand it over.** Every automation of mine started as something I did myself for weeks and got tired of. He says the same, and gives the better reason: the pain teaches you what the automation should do.

## Where we differ

**I don't read the implementation either. What I check instead is different.** His gates are good automated reviewers, feature flags, preview environments and backups. Mine are those plus two people: my colleague reviews every pull request, and before it reaches him I run the thing myself on a simulator or a real phone. The users of the app I work on are children, and a quiet mistake there is not a rollback, it's a child seeing something they shouldn't.

**He runs in the cloud. I run locally.** Not out of principle. My work only counts as tested when it's run on a simulator or a real phone against a local backend, and the sessions need to reach those.

**He suggests teams should get smaller.** We're two developers, so I can't test that one. What I can say is that the second person is where most of my safety comes from, not the tooling.

One thing he said I agree with completely, and it points the other way from his conclusion: a test isn't much of a gate when the same agent wrote both the code and the test. He takes that as a reason to lean on reviewers and flags. I take it as a reason the human review matters more, not less.

## The thing I have that he didn't mention

The limit on how parallel you can go isn't the model. It's one machine's memory. Two test suites at once made unrelated tests fail, and I learned that by running out of it. So the heavy steps queue: the hub hands out the test slot, while reading, writing and review carry on in parallel. If you're running agents locally and wondering why things get flaky past a certain number, it's probably not the agents.

## What I'm taking

**A friction log.** When an agent finishes, it files whatever got in its way: a server that wouldn't start, a stale dependency, a step that needed a workaround. Another agent clears those out regularly. Agents don't complain. They work around the same obstacle forever, in silence, and you pay for it every single time.

**Decision records.** One short note per decision: what we chose, what we rejected, which risk we accepted. Right now that lives in my head and in chat histories. It should sit next to the code, where the next session can read it.

**A risk level per change, from a list of the pieces we already have.** His version is a registry of the system's building blocks, and every change has to say whether it reuses one, extends one, or adds a new one. Adding is deliberately expensive. It's the clearest answer I've seen to agents inventing a fifth way to do something the codebase already does.

**A weekly clean-up agent.** Agents add code and never remove it. Nobody is paying them to delete. His runs weekly, deletes what's safe, and adds measurement to the parts it can't prove are dead so that next week it can.

**A nightly test-quality agent.** Not more tests. Fewer, better ones: drop the tests that only restate the change, and check that a regression test actually fails without its fix.

**Disaster recovery that gets tested.** Encrypted backups on a different provider, and a restore you run on purpose rather than hope for. He was blunt about it: if you've never tested the restore, you don't have backups. I hadn't thought about it at all, which is its own answer.

**A full audit on every new model.** Each time a new one lands, point it at the whole codebase for security, accessibility, architecture and maintainability, then work the list in priority order.

## The part I'm least comfortable with

His rule is that the record lives in the repository, so any agent can be swapped for another. Mine doesn't. My setup's memory, the rules it follows and most of what it has learned about my machine sit in a folder tied to one tool on one laptop. That's not a system, it's a habit with good documentation. It's the next thing I'm changing.

## What I'm doing first

The friction log, because it's cheap and I already know what the first ten entries are. Then the decision records. Disaster recovery is the one where I don't know what we have, and finding out is the work.

If you run agents in parallel and haven't seen it, the stream is worth the two hours: [How Kent Ships Features Without Reading the Code](https://www.youtube.com/watch?v=3kK3rfb1BZQ).
