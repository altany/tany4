---
title: "Taking my job-hunting MCP server remote"
date: "2026-06-28T12:00:00+0000"
categories: ["AI", "Tooling", "MCP"]
banner: "job-hunter-mcp.png"
color: "#006e8f"
description: "I turned my personal job-hunting MCP server from a laptop-only tool into a remote server I can use from my phone. Notes on the transport switch, free hosting, and a 502 that only showed up in ChatGPT."
readingTimeMinutes: 5
new: true
---

Part 2 of 2 - [Part 1: Building a job-hunting MCP server](/blog/posts/building-a-job-hunting-mcp-server)

**TL;DR**: In [part one](/blog/posts/building-a-job-hunting-mcp-server) I built a personal MCP server that scores job fits and tracks my pipeline. It only ran on my laptop. I've now turned it into a remote server with a public URL, so I can use it from the Claude and ChatGPT apps on my phone. The transport switch was the easy part. Most of the work was around it: getting personal data out of the code, finding free hosting, and fixing an error that only happened through ChatGPT.

## Why go remote

The original version connected to Claude Desktop over stdio, and to ChatGPT through a local Express server exposed with a Cloudflare tunnel. It worked, but it was tied to my machine. If my laptop was asleep, the tool was too. I couldn't paste a job ad into the app on my phone and get a score back.

A remote MCP server fixes this. You add a public HTTPS endpoint once as a custom connector, and it's available on every device. The goal was to take the same tools and make them reachable from anywhere.

## Keeping both transports

I didn't want to break the desktop setup while building the remote one. That was straightforward because the tool logic was already separate from the transport. All the work (the prompts, the Sheets and Docs calls) lives in one function. The entrypoint picks a transport from an environment variable: stdio by default for the desktop app, or an HTTP server for the remote version. Both use the same tools.

## Auth

A public URL means anyone who finds it could call my tools, which read and write my Google Sheet. I'm the only user, so I didn't need multi-user OAuth, just a way to keep other people out.

A single shared token does that. The server won't start without one, and rejects any request that doesn't include it. One detail: the custom-connector dialogs are built around OAuth and don't always have a field for a plain token. So the server accepts the token two ways, as an Authorization header or in the URL path. One of them works with whatever client you're using.

## Cleaning up before going public

I planned to make the repo public, so I went looking for anything that shouldn't be shared. The credentials were fine, the service-account key and config had never been committed. What I didn't expect was that personal details about me had ended up in the source itself: notes and preferences that should have come from my private config were written into the tool prompts instead. Not secrets, but not things I want in a public repo.

The fix was to read all of that from my gitignored config, and to go over the project properly before making it public.

The point: gitignore only protects you from here on. It's easier to keep personal data out of the source in the first place than to find it later.

## Hosting it for free

My first choice was Google Cloud Run, since my Google project was already there. It's free at my usage, but it requires a billing account on file before you can deploy. I didn't want to add a card for a personal project, so I used Render's free tier instead, which doesn't need one.

The downside of free hosting is that the service sleeps after a period of inactivity, and the first request after that takes a while to wake it. To avoid that, I set up a scheduled job that pings a health endpoint every few minutes and keeps the service awake.

## The error that only happened in ChatGPT

The server worked in my own tests. Then I connected it to ChatGPT, asked for my applications, and got a 502.

What made it confusing: at the same time ChatGPT was failing, my own request to the same URL worked and returned all my data. The server was up and healthy, but ChatGPT couldn't talk to it.

The cause was the response format. The MCP HTTP transport replies with a streaming `text/event-stream` by default. Command-line tools handle that fine, and it had worked locally through the Cloudflare tunnel. But ChatGPT's client, behind the free host's proxy, didn't read the stream cleanly and returned a gateway error. The fix was to make the transport reply with plain JSON instead. It doesn't need streaming here, and JSON goes through proxies without trouble.

The lesson: "works on my machine" extends to the network path. When two clients behave differently against the same healthy server, the difference is usually in the layers between them.

## Marking which tools are safe

By default the assistant treated every tool as potentially destructive and asked permission before running anything, including reads. MCP lets you annotate each tool: read-only, writes, or deletes. After labelling them, the read-only tools stopped prompting for permission, and only the tool that deletes a row still asks for confirmation.

## Tidying the context

Part one ended on context drift, the way detail fades between sessions and within a long conversation. Going remote made me deal with a related problem. My context had grown into several overlapping files, plus a section of config the tool wasn't even reading anymore. The same facts were written in a few places and had started to disagree with each other.

So I consolidated. Structured settings stay in config; the rest (background, project write-ups, interview notes) lives in one knowledge base file, with a single command that bundles it for the hosted server. One source is easier to keep accurate, easier to extend, and cheaper to send to the model on each call. It doesn't fix context drift, but it removes the version of the problem I'd created for myself.

## Where it is now

It's the same tool from part one, just not tied to my laptop. I can score a role from my phone, and the data still lives in my own Google Sheet behind my own service account. With everything personal and every secret moved out of the code and into the host's environment, I was comfortable making it public.

The code is on GitHub at [altany/job-hunter](https://github.com/altany/job-hunter); the README covers how to set up your own. If you have questions, [get in touch](mailto:hello@tany4.com).

---

Part 1: [Building a job-hunting MCP server](/blog/posts/building-a-job-hunting-mcp-server)
