---
title: "Building a job-hunting MCP server"
date: "2026-04-01T12:00:00+0000"
categories: ["AI", "Tooling", "MCP"]
banner: "job-hunter-mcp.png"
color: "#cee2fd"
description: "I built a personal MCP server that helps me research companies, score job fits, and track my application pipeline. Here's what I built and what surprised me."
readingTimeMinutes: 5
new: true
---

**TL;DR**: Job searching can be exhausting and most of the friction isn't the actual applying, it's the research, evaluation, and bookkeeping around each role. I built a small MCP server that plugs into Claude or ChatGPT and takes care of the repetitive parts: pulling together company research, scoring fit, and keeping my pipeline organised so I can focus on the decisions and conversations that matter.

## The problem

When you're actively looking for work, there's a particular kind of cognitive overhead. For every role you're considering, you're doing variations of the same things: checking the company on Glassdoor, trying to figure out if the salary is reasonable, reading engineering blogs to understand their culture, and deciding whether the role is actually worth your time before you invest in it.

Then there's the tracking. What stage are you at with each company? What did you discuss in the last call? What are you supposed to follow up on? Most people end up with a spreadsheet and a pile of notes that quickly become out of date.

I'd been meaning to address this for a while. When I started experimenting with the MCP ecosystem after my [GitHub MCP experiments](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev), this felt like the right kind of problem to solve with it.

## What I built

Job Hunter is a personal MCP server - a small Node.js application that I connect to Claude Desktop or ChatGPT. It gives the assistant a set of tools it can call on my behalf: researching and rating a job, adding an application to my pipeline, logging interview notes, and pulling together prep material before calls.

The data lives in Google Sheets and Google Docs, no database needed, easy to see and edit directly, and readable.

## Company research and fit scoring

When I come across a role that looks interesting, I paste the job description into Claude and ask it to rate the fit. The tool:

- Searches for company reviews, culture signals, and interview process notes
- Looks up salary benchmarks
- Reads recent engineering blog posts or open source work from the company
- Checks the role against a set of personal preferences and dealbreakers I've configured - things like culture fit, remote-first vs hybrid, whether the tech stack overlaps with what I know, on-call expectations, and more

What comes back is a scored breakdown across several dimensions: skills match, salary, remote/WLB, product fit, culture, and how this role compares to others already in my pipeline. Alongside the score, it surfaces red flags, interesting signals from the research, and a clear recommendation: Apply, Save for later, or Skip.

I've found it genuinely useful, not because it tells me what to do (I still decide), but because it forces a more structured question: *why* would I apply to this role? The research it pulls together in seconds would have taken me 30–40 minutes to do manually.

## What it looks like in practice

A typical session: I come across a Product Engineer role at a mid-sized SaaS company. React-heavy, hybrid in London, salary range not listed. I paste the JD into Claude and ask it to rate the fit.

A few seconds later I get back something like:

> **Skills match: 9/10** — Strong overlap with React, TypeScript, and testing. Some unfamiliarity with their backend stack but not a blocker.
>
> **Salary: 6/10** — No range listed. Market data suggests this level pays below my target. Worth clarifying but not an immediate dealbreaker.
>
> **Remote/WLB: 5/10** — Hybrid, 3 days in London. Your preference is remote-first. Worth clarifying expectations before investing further.
>
> **Culture: 7/10** — Reviews suggest a collaborative engineering team. Some mentions of fast pace and shifting priorities. Engineering blog is active and technically interesting.
>
> **Recommendation: Save** — Good skills fit and interesting product, but hybrid requirement and unclear salary are worth validating on a first call before applying.

That output helps me decide how to proceed. "Save" doesn't mean no, it means there are specific things to clarify first. And if I do get on a call and the answers are good, I update the status in my pipeline and the tool moves it forward.

## Tracking the pipeline

When a role is worth pursuing, I log it to my pipeline. The MCP server adds it as a row in Google Sheets with the company, role, salary range, work type, location, my rating, and current status (Saved, Applied, Phone Screen, Interview, Offer, Rejected).

Each application can also have a linked Google Doc with a template structure: role overview, interview stages, study notes, reflections, company research. That doc becomes the living record for everything related to that company: notes from calls, things I noticed, questions I want to ask.

I can ask the agent at any point to show me my full pipeline, filter by status, or tell me what I should be focusing on next.

## Interview prep

Before a call, I ask it to pull together a prep brief for the specific company and role. It reads everything I've logged in the application doc, looks up the company again if needed, and gives me:

- A summary of the company and the parts of my experience most relevant to the role
- Which of my own experiences are worth revisiting, so nothing obvious slips my mind
- Questions worth asking at the end
and more...

It's a scaffold, not a script. The research is there so I can focus on the actual thinking. What it saves me is the 40 minutes of tab-switching before a call, so I show up with a clearer head rather than a longer doc.

## The technical side

The server is built on the Model Context Protocol SDK. It connects to Claude Desktop via stdio, and to ChatGPT via a small Express HTTP server I expose locally with Cloudflare Tunnel. All the Google Sheets and Docs interactions go through the MCP server using a service account - no third-party services, no cloud database.

Most of the actual intelligence is the agent's. The server's job is to construct good prompts, load my preferences and background as context, manage the Sheets/Docs state, and return structured responses. I learned from my previous [chatbot work](/blog/posts/vibe-coded-ai-chatbot-weekend) that the hard part of these tools isn't getting the AI to respond, but it's making sure the context is right and the guardrails hold.

## What surprised me

The biggest surprise was how much the structured scoring changed my relationship to job applications. When I was just reading JDs and making gut decisions, I was applying to things that felt right but weren't really right and passing on things that were actually better matches. Having to score a role across multiple dimensions forces a different kind of thinking.

The Google Docs integration also turned out to be more useful than I expected. Having one doc per application that I can update across multiple conversations makes the whole thing feel less ephemeral than a chat window. I can come back to it days later and have everything in one place.

## The biggest limitation

The thing that still frustrates me is context drift. It happens in two ways. The obvious one is between sessions: every new conversation starts fresh, so any nuance I'd established, any decision I'd already made about a specific company, is gone. But it also happens within the same conversation. A few messages in, after enough back-and-forth, earlier instructions start to fade. Something I asked for explicitly gets quietly dropped. A rule I thought was established stops being followed. The MCP server injects my CV and preferences on every tool call, which helps with the mechanical parts, but it doesn't anchor the conversational layer.

I haven't solved this yet. One direction I'm exploring is [skills](https://docs.anthropic.com/en/docs/claude-code/tutorials#create-custom-slash-commands) - saved prompt templates that pre-load context and can be re-invoked mid-conversation to re-anchor the rules when things start drifting. They'd reduce some of the friction, but they're a workaround rather than a fix. The more complete solution is probably a persistent memory layer that the server manages explicitly, so the state lives in the tool rather than in the conversation. It's on the list.

## It's private for now

The repo is private on GitHub. It's built as a personal tool and it's not in a state I'd call shareable yet (thought it's getting there). If you'd like access or you're curious about the implementation and want to build something similar, feel free to [get in touch](mailto:hello@tany4.com).
