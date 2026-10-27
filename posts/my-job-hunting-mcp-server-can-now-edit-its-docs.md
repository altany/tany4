---
title: "My job-hunting MCP server can now edit its docs"
date: "2026-10-27T12:00:00+0000"
categories: ["AI", "MCP", "Side projects"]
banner: "job-hunter-mcp.png"
color: "#006e8f"
description: "My job-hunting MCP server now creates and formats its Google Docs, corrects one section at a time, and keeps tailored CVs in the application doc."
readingTimeMinutes: 4
new: true
---

Part 4 of 4 - [Part 1: Building a job-hunting MCP server](/blog/posts/building-a-job-hunting-mcp-server) · [Part 2: Taking it remote](/blog/posts/taking-my-job-hunting-mcp-server-remote) · [Part 3: Teaching it what it can do](/blog/posts/teaching-my-job-hunting-mcp-server-what-it-can-do)

**TL;DR**: My job-hunting MCP server keeps one Google Doc per application. Until now it could only add text to the end of a doc, and the text came out unformatted. Now it creates the doc, formats every write, corrects one section at a time, and keeps a tailored CV in the doc for me to review.

## Creating docs

The server talks to Google through a service account. A service account has no Drive storage of its own, so it can't create a Google Doc. Until now I created each doc by hand and pasted the link.

Now the server creates the doc itself, signed in as me, so each doc is in my Drive and owned by me. It uses my sign-in only for that. Everything else still goes through the service account.

## Formatting

Docs came out as plain text with markdown in it: `##` for headings, `**` for bold, `-` for bullets. I had a script that turned the markdown into real Google Docs styles, but I had to run it myself after every write.

Now the server runs the same script after every write. I also put the formatting rules in the description of each tool that writes to a doc, because the tool description is the only place the agent reliably reads.

The script sends one small request per heading, bullet or table, and Google allows about 60 a minute. A long doc went over that and ended up half formatted. Now the server waits and tries again.

## Correcting a section

The server could only add a new section to the end of a doc. To correct something, it wrote the updated version at the end, and I had to replace the old one by hand, in the right place.

Now there is a tool that replaces one section: a heading and everything under it, up to the next heading of the same level. These are the rules I set for it:

- If the heading matches no section, or more than one, it changes nothing and lists the headings it found.
- By default it only shows what it would remove and what it would put instead. It writes only when I say yes.
- Before it writes, it saves the old text in my tracker spreadsheet, so I can put it back.
- If I edited the doc after the preview, it doesn't write.
- There is no tool that deletes a doc or clears all of it. If I ever need that, I'll do it by hand.

Adding a section whose heading is already in the doc now fails too, and the message points to the replace tool.

## Tailored CVs

I started using Claude Cowork for my job applications. When I asked it to tailor my CV for a role, it saved the CV as a separate file. I wanted everything about an application in that application's doc, so each tool description now says that research, the tailored CV and interview prep all go there.

My CV lives in my website's code as structured data. The same code turns it into the PDF on my site. Now the server tailors a copy with the same structure and saves it in the application doc as JSON. I review and edit it there. The CV on my website stays generic, and each tailored version stays in its application's doc.

When I approve it, the server makes the PDF with my website's own PDF code. I download it for the application. I don't need to store a copy, which takes up space. The JSON in the doc is enough of a record, and I can generate the PDF again from it if I need to.

## Restarts

Every time I deployed a change, the hosted server restarted, and Cowork stopped working until I reconnected it by hand. The server kept a record of each open chat in memory. A restart wiped those records, and the server then rejected the next request from every chat.

Now the server doesn't keep any record between requests. Each request stands on its own, so a restart doesn't affect an open chat. If you host an MCP server somewhere that restarts it, the MCP SDK has a stateless mode for this.

The code is on GitHub at [altany/job-hunter](https://github.com/altany/job-hunter).

---

Part 1: [Building a job-hunting MCP server](/blog/posts/building-a-job-hunting-mcp-server) · Part 2: [Taking my job-hunting MCP server remote](/blog/posts/taking-my-job-hunting-mcp-server-remote) · Part 3: [Teaching my job-hunting MCP server what it can do](/blog/posts/teaching-my-job-hunting-mcp-server-what-it-can-do)
