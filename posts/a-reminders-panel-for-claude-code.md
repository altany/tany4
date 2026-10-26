---
title: "A reminders panel for Claude Code"
date: "2026-10-26T12:00:00+0000"
categories: ["AI"]
banner: "reminders-panel.png"
color: "#eefaf4"
description: "My reminders and scheduled tasks were spread over many Claude sessions, so I had Claude build a panel that lists them all in one place, colour coded, where I can change them, tick them off and undo."
readingTimeMinutes: 3
new: true
---

**TL;DR**: I ask Claude to remind me of things from many sessions, and there was no single place to see them. So I had Claude build a panel for Claude Code that lists them all, grouped by session, where I can change them or tick them off. It's [on GitHub](https://github.com/altany/claude-code-reminders-panel).

## Why I needed it

I use reminders a lot. When a session opens a PR or starts a deploy, it sets a reminder to check on it later. When I ask a session to remind me about something on Friday, it schedules it. In two weeks I had 28 of them, spread over several sessions, and only two were still to come.

To find one, I had to remember which session set it up, open it and ask. To move one to another day, the same.

## What I asked for

This is what I wrote to Claude:

> Create a mod that lists all my reminders, scheduled tasks, routines and todos from all sessions. Show them categorised by session name (the label name I set per session). Show the deadline or reminder time if it has one, allow me to click on it and edit, both the description and time. Show if it is Code and Cowork (or Chat). List what other details you think could be useful. Use a nice clean UI

And a minute later: "Oh and allow me to view completed ones, mark as completed and undo".

## What it does

![The panel with example reminders: a next-up box at the top, then the reminders grouped by session, each with a coloured dot for its state and a Done button](/blog/reminders-panel-example.png)

- Everything is grouped by the session's name, with a label for Code, Cowork or Chat.
- The dot shows the state: green is coming up, orange is late, grey is paused, red failed. Under each item it says what it is: a reminder, a routine that repeats, a scheduled task, or a to-do.
- The next one is always at the top.
- Clicking an item lets me change its name, its time, or what Claude does when it runs. I can type the time the way I'd say it: "tomorrow 9:00", "friday 6pm", "in 2 hours".
- Done turns it off so it won't run, and Undo turns it back on. Finished ones stay under Completed.
- Each item links to the session that set it up.

## What I learned

- **Panels only show where the app draws them.** A mod is a Claude Code plugin, and it can add a panel next to the chat. The first version said "Opened the Reminders panel" and nothing appeared. I was in a cloud session in the Claude app, and that doesn't draw plugin panels at all. The panel works in Claude Code on my computer. In a cloud session, `/reminders` now gives the same list as plain text, which is what I use on my phone.
- **Ask to see it first.** Before setting anything up, I asked Claude to show me what it would look like, because I might not like it. It drew the panel with my real reminders, so I could say no before anything was installed.
- **Time zones.** The cloud runs on UTC. London matches it in winter but is an hour ahead in summer, so for half the year a reminder at 08:00 was really 09:00 for me. The panel shows and reads every time in my time zone, and that's a setting.

## Try it

In a terminal session of Claude Code:

```
/plugin install reminders-panel --marketplace altany/claude-code-reminders-panel
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `altany/claude-code-reminders-panel`, then Add plugin. It reads your scheduled tasks through the Claude Code Remote connector, and `/reminders` opens it again if you close it.
