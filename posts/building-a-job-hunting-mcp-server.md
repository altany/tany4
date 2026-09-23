---
title: "Building a job-hunting MCP server"
date: "2026-04-01T12:00:00+0000"
categories: ["AI", "MCP", "Side projects"]
banner: "job-hunter-mcp.png"
color: "#006e8f"
description: "I built a personal MCP server that researches companies, scores how well a job fits, and tracks my applications."
readingTimeMinutes: 5
---

Part 1 of 3 - [Part 2: Taking it remote](/blog/posts/taking-my-job-hunting-mcp-server-remote) · [Part 3: Teaching it what it can do](/blog/posts/teaching-my-job-hunting-mcp-server-what-it-can-do)

**TL;DR**: When I'm looking for a job, most of the time goes on research and tracking, not on applying. I built a small MCP server that plugs into Claude or ChatGPT and does the repetitive parts: company research, scoring how well a role fits, and keeping track of my applications.

## The problem

For every role I'm considering, I do the same things: check the company on Glassdoor, work out if the salary is reasonable, read their engineering blog to understand the culture, and decide whether the role is worth applying to.

Then there's the tracking: what stage I'm at with each company, what we discussed in the last call, what I need to follow up on. I used a spreadsheet and notes, and they got out of date quickly.

After my [GitHub MCP experiments](/blog/posts/experimenting-with-github-mcp-server-as-a-frontend-dev), this looked like a good problem to try MCP on.

## What I built

Job Hunter is a personal MCP server - a small Node.js application that I connect to Claude Desktop or ChatGPT. It gives the assistant a set of tools it can call on my behalf: researching and rating a job, adding an application to my pipeline, logging interview notes, and pulling together prep material before calls.

The data lives in Google Sheets and Google Docs, so there's no database and I can see and edit everything directly.

## Company research and fit scoring

When I come across a role that looks interesting, I paste the job description into Claude and ask it to rate the fit. The tool:

- Searches for company reviews, culture signals, and interview process notes
- Looks up salary benchmarks
- Reads recent engineering blog posts or open source work from the company
- Checks the role against a set of personal preferences and dealbreakers I've configured - things like culture fit, remote-first vs hybrid, whether the tech stack overlaps with what I know, on-call expectations, and more

It returns a score for each of: skills match, salary, remote/WLB, product fit, culture, and how the role compares to others I'm already tracking. It also lists red flags and anything interesting from the research, and recommends Apply, Save for later or Skip.

I still decide, but it makes me answer why I'd apply to a role. The research takes it seconds. By hand it would take me 30-40 minutes.

## What it looks like in practice

A typical session: I come across a Product Engineer role at a mid-sized SaaS company. React-heavy, hybrid in London, salary range not listed. I paste the JD into Claude and ask it to rate the fit.

A few seconds later I get back something like:

> **Skills match: 9/10**. Strong overlap with React, TypeScript, and testing. Some unfamiliarity with their backend stack but not a blocker.
>
> **Salary: 6/10**. No range listed. Market data suggests this level pays below my target. Worth clarifying but not an immediate dealbreaker.
>
> **Remote/WLB: 5/10**. Hybrid, 3 days in London. Your preference is remote-first. Worth clarifying expectations before investing further.
>
> **Culture: 7/10**. Reviews suggest a collaborative engineering team. Some mentions of fast pace and shifting priorities. Engineering blog is active and technically interesting.
>
> **Recommendation: Save**. Good skills fit and interesting product, but hybrid requirement and unclear salary are worth validating on a first call before applying.

"Save" doesn't mean no. It means there are things to clarify first. If I get on a call and the answers are good, I update the status.

## Tracking the pipeline

When a role is worth pursuing, I log it to my pipeline. The MCP server adds it as a row in Google Sheets with the company, role, salary range, work type, location, my rating, and current status (Saved, Applied, Phone Screen, Interview, Offer, Rejected).

Each application can also have a linked Google Doc with a template structure: role overview, interview stages, study notes, reflections, company research. I keep everything about that company there: notes from calls, things I noticed, questions I want to ask.

I can ask the agent at any point to show me my full pipeline, filter by status, or tell me what I should be focusing on next.

## Interview prep

Before a call, I ask it to pull together a prep brief for the specific company and role. It reads everything I've logged in the application doc, looks up the company again if needed, and gives me:

- A summary of the company and the parts of my experience most relevant to the role
- Which of my own experiences are worth revisiting, so nothing obvious slips my mind
- Questions worth asking at the end
and more...

It saves me about 40 minutes of switching between tabs before a call.

## The technical side

The server is built on the Model Context Protocol SDK. It connects to Claude Desktop via stdio, and to ChatGPT via a small Express HTTP server I expose locally with Cloudflare Tunnel. All the Google Sheets and Docs interactions go through the MCP server using a service account - no third-party services, no cloud database.

The model does the reasoning. The server builds the prompts, loads my preferences and background as context, manages the Sheets and Docs, and returns structured responses. Like with my [chatbot](/blog/posts/vibe-coded-ai-chatbot-weekend), most of the work was getting the context right and making sure it follows the rules.

## What surprised me

The scoring changed how I choose roles. When I decided from the job description alone, I applied to roles that felt right but weren't, and skipped some that fit better. Scoring every role on the same things makes me think it through.

The Google Docs turned out more useful than I expected. There's one doc per application that I update across conversations, so days later everything is still in one place.

## The biggest limitation

The model loses context in two ways. Every new conversation starts from zero, so decisions I'd already made about a company are gone. And in a long conversation, earlier instructions fade: things I asked for get dropped and rules stop being followed. The server sends my CV and preferences with every tool call, which helps with the tools, but not with the conversation itself.

I haven't solved this yet. One option is [skills](https://docs.anthropic.com/en/docs/claude-code/tutorials#create-custom-slash-commands): saved prompts that load the context, which I can run again mid-conversation when it starts drifting. That's a workaround, though. A better fix is probably memory that the server keeps itself, so the state lives in the tool and not in the conversation.

## What's next

This started as a tool that only ran on my laptop. Since then I've moved it to a server and made the code public, which is what part two covers. If you want to build something similar, [get in touch](mailto:hello@tany4.com).

---

Part 2: [Taking my job-hunting MCP server remote](/blog/posts/taking-my-job-hunting-mcp-server-remote) · Part 3: [Teaching my job-hunting MCP server what it can do](/blog/posts/teaching-my-job-hunting-mcp-server-what-it-can-do)
