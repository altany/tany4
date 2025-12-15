---
title: "Vibe coding an AI chatbot into my website"
date: "2025-12-15T12:00:00+0000"
categories: ["AI", "Next.js", "Weekend project"]
banner: "vercel-aisdk.jpg"
color: "#ffffff"
description: "A light evening experiment: I vibe-coded a small AI chatbot into my website using the Vercel AI SDK, a tiny bit of retrieval, and a lot of trial-and-error."
updated: "2025-12-15T12:00:00+0000"
readingTimeMinutes: 4
---

**TL;DR**: I vibe-coded a chatbot into this website over an evening. It answers questions about my work using the content already on the site and my CV, and politely refuses to make things up. I had fun building it, debugging it, and making sure the right context is available.

## The idea

I wanted a tiny “Ask about my work” widget on the site. Not a full product, not a startup, just a friendly little helper that can answer questions like:

- What’s your current role and focus?
- What projects have you worked on recently?
- What have you written about on your blog?

But with one important rule: **it should only answer using content that’s actually on my website/CV**.

## The stack (aka: the fun part)

This was a Next.js site already, so the shape of the solution was pretty straightforward:

- A floating chat widget UI
- A `/api/chat` endpoint
- A prompt that says “don’t hallucinate” (politely, but firmly)

I used the **Vercel AI SDK** (`ai`) with OpenAI to power the responses.

## Keeping it grounded (site + CV only)

The main trick wasn’t to make the LLM respond (that part is easy). The trick was to **give it the right context**.

I ended up with a small keyword-based retrieval setup that builds a corpus from:

- Home page text
- Work page text
- Blog posts (markdown)
- My CV PDF

Then for each question, we grab the most relevant chunks and inject them into the system prompt as `CONTEXT`.

If the context doesn’t contain the answer, the assistant replies exactly:

> I don't have that information in the website/CV.

(Too eagerly sometimes, annoying always, but very honest.)

## The debugging

Unsurprisingly, there were a few challenges:

- Getting streaming right (and then deciding to not stream) was trickier than expected.
- Getting the OpenAI key scope right taught me more about permissions than I ever wanted to know.

Pretty much what one would expect, but I did learn a few things.

## A couple of small UX touches

Once the backend was stable, I made it feel a bit more “chatty”:

- User questions and assistant replies have different bubble styles
- The empty state includes example prompts so you’re not staring at a blank box thinking “uhhh… what can I ask?”

## Key takeaways

- Retrieval and a strict prompt are a surprisingly effective way to keep answers grounded.
- “Vibe coding” is great, as long as you follow it up with real guardrails.

You can try it for yourself! Just click the chat icon in the bottom-right corner. If you try the widget and it refuses to answer something you think is on the site, it probably means my retrieval missed the right chunk. If you feel invested, you can [reach out to me](mailto:hello@tany4.com) so I can fine tune it. 🙏
