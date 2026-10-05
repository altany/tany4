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

**TL;DR**: I've been running AI coding agents in parallel for a few months. Kent C. Dodds streamed how he does the same thing on his own product, and most of the shape is identical, which was a relief. I'm taking seven things from his setup. Like him, I don't read the code the agents write. What differs is what each of us puts in its place.

A couple of weeks ago I wrote about [running AI coding sessions in parallel](/blog/posts/running-ai-coding-sessions-in-parallel): one session per feature, each in its own git worktree, and one extra session that writes no code and keeps track of the rest. Then I watched this, two hours of him building a feature live:

<iframe width="100%" height="400" src="https://www.youtube.com/embed/3kK3rfb1BZQ" title="How Kent Ships Features Without Reading the Code" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I put my setup together by trial and error, from what I needed and what I saw working, without looking at how anyone else was doing it, and I kept wondering whether I was being reckless with how much I hand over. Watching someone else arrive at the same thing answered that. The tips were useful, but the reassurance was worth more: the models really are that good, and leaning on them isn't naive as long as you build the checks around them.

## What came out the same

**One agent that coordinates and writes no code.** He talks to a planning agent, agrees what to build, and hands it to a separate coding agent. He's stopped watching the individual agents work. That's my hub session.

**Many agents, each in its own isolated environment.** His run in the cloud, each with its own machine. Mine run on my laptop, each in its own git worktree.

**Feature flags as the actual safety net.** The tests don't save you and neither does the review. The flag does. Risky work ships switched off and is turned on separately. He puts it well: a flag turns a decision you can't undo into one you can.

**Automated review that runs separately from the agent that wrote the code.** He uses several, each in its own context, and the implementing agent never reviews itself. His agents are told to check review comments rather than apply them, which is also my rule.

**A rule instead of a mood for merging.** His agent merges when everything is green, and I wrote my rule down so the hub can apply it, which means neither of us merges because a change feels fine.

**Do it by hand first, then hand it over.** Every automation of mine started as something I did myself and got tired of. He says the same, and gives the better reason: the pain teaches you what the automation should do.

## Where we differ

**I don't read the implementation either. What I check instead is different.** His gates are good automated reviewers, feature flags, preview environments and backups. Mine are those plus two people: my colleague reviews every pull request, and before it reaches him I run the thing myself on a simulator or a real phone. The users of the app I work on are children, and a quiet mistake there is not a rollback, it's a child seeing something they shouldn't.

**He runs in the cloud. I run locally.** Every change of his gets its own environment, seeded and with the third-party services mocked, so his agents can check their own work against something real. I haven't set that up, because it takes resources. Until I do, my work only counts as tested when it runs on a simulator or a real phone against a local backend, and the sessions have to be where those are.

**He suggests teams should get smaller.** We're two developers, and that works well for us for now.

One thing he said I agree with completely: a test isn't much of a gate when the same agent wrote both the code and the test. He leans on separate reviewers and on flags, and so do I. The automated review does most of the work on both sides: several passes, each in its own context, before a person looks at anything.

## What running them on your own machine costs

This one doesn't apply to him, because each of his agents gets its own machine in the cloud. If you run them on your laptop like I do, the thing that limits you isn't the model, it's memory. I found that out by running out of it: two test suites going at once, and tests that had nothing to do with each other started failing. So the heavy steps queue now. The hub hands out the test slot, and the reading, writing and reviewing carry on in parallel. If things start going strange past a certain number of sessions, that's where I'd look first.

## What I'm taking

**A friction log.** When an agent finishes a job, it writes down whatever got in its way: a server that wouldn't start, a stale dependency, a step it had to work around. Another agent goes through those and fixes them. The reason this matters is that an agent won't tell you something is broken. It works around it, quietly, every single time, and you keep paying for that.

**Decision records.** A short note for each decision: what we picked, what we turned down, and which risk we were happy to take. Right now that lives in my head or somewhere in a chat history, when it should sit next to the code where the next session can read it.

**A risk level on every change.** He keeps a list of the pieces his system is built from, which he calls primitives, and every change has to say whether it reused one, extended one, or added a new one. Adding is treated as the expensive option on purpose. If you have ever watched an agent write a fifth way to do something the codebase already does, this is the answer to it.

**A weekly clean-up agent.** Agents add code and never take any away. Nobody is paying them to delete. His runs once a week and removes what is safe to remove, and where it can't tell whether something is still being used, it adds measurement so that next week it can.

**A nightly test-quality agent.** Not more tests, fewer and better ones. It throws out the tests that only repeat what the change did, and checks that a regression test really does fail when you take the fix away.

**Disaster recovery that gets tested.** Encrypted backups with a different provider, and a restore you actually run instead of hoping it would work. He was blunt about this: if you have never tested the restore, you don't have backups. I had not thought about it at all.

**An audit every time a new model comes out.** Point it at the whole codebase, ask for problems with security, accessibility, architecture and maintainability, then work through what it finds, most important first.

## What lives on my laptop instead of in the repo

His rule is that everything the agents need lives in the repository, so one agent can be swapped for another whenever he likes. Mine doesn't work that way. The rules my sessions follow, and most of what they have learned about this project, sit in a folder that belongs to one tool on one laptop. If I switch to another tool, or work from a different machine, none of it comes with me and a new session starts from nothing. That is the difference between what he has and what I have: his setup belongs to the project, mine belongs to my computer.

## What I've done first

The weekly check is the one that's running. An agent reads the whole app codebase and comes back with a report: code nothing reaches any more, things written twice, work that's slower than it needs to be, places where the same idea is done two different ways. Each finding says which files it touches, how risky the change would be and how big it is. It changes nothing, which is the point. I read it and decide what becomes a ticket. His version deletes on its own; mine doesn't, and I'm not in a hurry for it to.

The friction log is next, because it costs nothing and I already know what the first few entries are, and then the decision records. Disaster recovery is the one I know least about, so there the work is finding out what we actually have.

If you run agents in parallel and haven't seen it, the stream is worth the two hours: [How Kent Ships Features Without Reading the Code](https://www.youtube.com/watch?v=3kK3rfb1BZQ).
