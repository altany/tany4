---
title: "Vibe coding an AI chatbot into my website"
date: "2025-12-15T12:00:00+0000"
categories: ["AI", "Side projects"]
banner: "vercel-aisdk.png"
color: "#f66f6e"
description: "One evening I built a small AI chatbot into this site with the Vercel AI SDK. It only answers questions about my actual work."
readingTimeMinutes: 4
updated: "2025-12-16T12:00:00+0000"
---

**TL;DR**: I built a chatbot into this site one evening. It answers questions about my work using the site and my CV, and it doesn't make things up. I didn't know how this kind of thing works when I started. I got it working by asking the AI a lot of questions and changing things until they worked.

## The idea

I wanted a small "ask about my work" widget on the site that answers questions like:

- What's your current role?
- What projects have you worked on recently?
- What have you written about on your blog?

It should only answer from what's on the site or in my CV.

## The stack

The site was already Next.js, so the setup was simple:

- A floating chat widget
- A `/api/chat` endpoint
- A prompt that tells it not to make things up

I used the Vercel AI SDK with OpenAI to power the responses.

## Keeping it grounded

Most of the work was making sure it only says things that are true about me.

Before this I barely knew what "retrieval" meant. I asked the assistant a lot of questions and read the code until I understood it.

I built a pool of text from what's already on the site: the home page, work page, blog posts, and my CV. For each question it pulls the most relevant bits and passes them to the prompt as context. If the answer isn't there, it says it doesn't have that information.

## Making it less eager to say "I don't know"

After trying normal questions, it was refusing too often. I changed the prompt so it answers more, without making things up.

A few changes that helped:

- I loosened the rules and returned more context, so broad questions are more likely to pull in something relevant
- Instead of forcing an immediate refusal, it now answers what it can and asks one short clarifying question if needed
- It still uses the refusal line when there's genuinely nothing in the content to back up an answer

## What was harder

- I couldn't get streaming to work well, so I dropped it. Answers appear all at once.
- Setting up the OpenAI key permissions took a while.

## A couple of UX touches

Once the backend worked, I tidied up the UI. User and assistant messages have different bubble styles, and the empty state shows example prompts instead of a blank box.

You can try it: the "ask about my work" button is at the bottom right. If it says it doesn't know something that is on the site, the search probably missed it. Let me know if that happens.
