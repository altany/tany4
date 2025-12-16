---
title: "Vibe coding an AI chatbot into my website"
date: "2025-12-15T12:00:00+0000"
categories: ["AI", "Vibe coding", "Chatbot"]
banner: "vercel-aisdk.png"
color: "#1d7be2"
description: "A light evening experiment: I vibe-coded a small AI chatbot into my website using the Vercel AI SDK, a tiny bit of retrieval, and a lot of trial-and-error."
readingTimeMinutes: 4
new: true
updated: "2025-12-16T12:00:00+0000"
---

**TL;DR**: I vibe-coded a chatbot into this website over an evening. It answers questions about my work using content already on the site and my CV, and it refuses to make things up. I did not go into this as an “LLM expert”. I mostly got it working by asking the coding assistant a lot of questions, nudging things until they behaved, and then being slightly surprised when they actually did.

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

The main trick wasn’t making the LLM respond (that part is easy). The trick was making sure it only answers with things that are actually true for me.

I’m going to be honest: before this, I barely knew what “retrieval” meant beyond “something AI people say”. I got this working by asking the assistant (a lot) and then reading the code until it stopped feeling like magic.

The end result was basically building a pool of text from what’s already on my website:

- Home page text
- Work page text
- Blog posts (markdown)
- My CV (PDF)

Then for each question, we try to grab the bits that look most relevant and pass them into the prompt as `CONTEXT`.

If the context doesn’t contain the answer, the assistant replies exactly:

> I don't have that information in the website/CV.

(Too eagerly sometimes, annoying always, but very honest.)

## Update: making it less eager to say “I don’t know”

After trying a bunch of normal prompts (the kind you actually type when you’re not thinking about how the system works), I realised it was refusing way too often. So I asked the assistant to help me tweak it to be more useful without letting it hallucinate. It’s feeling much more reliable now: it answers the obvious stuff, and it still refuses when it genuinely can’t back something up.

1. Retrieval: better recall

I loosened the rules and expanded how much context we return, so broad questions are more likely to pull in something relevant from Home/Work/CV/blog posts.

2. Prompt rules: partial answers + one clarifying question

Instead of forcing an immediate refusal when the context isn’t a perfect match, it now:

- Answers what it can from the context it has
- Asks one short clarifying question if needed
- Still uses the exact refusal line only when there’s genuinely nothing useful in the website/CV content

## The debugging

Unsurprisingly, there were a few challenges:

- The chatbot was a bit too eager to say “I don't have that information in the website/CV.” even when the answer *was* on the site.
- Getting streaming right was trickier than expected (streaming is when the answer appears gradually as it’s being generated, rather than showing up all at once at the end). So I decided not to stream.
- Getting the OpenAI key scope right taught me more about permissions than I ever planned to know.

Pretty much what one would expect, but I did learn a few things.

## A couple of small UX touches

Once the back-end was stable, I made it feel a bit more “chatty”:

- User questions and assistant replies have different bubble styles
- The empty state includes example prompts so you’re not staring at a blank box thinking “uhhh… what can I ask?”

## Key takeaways

- “Vibe coding” is fun, but you still need guardrails if you don’t want nonsense answers.
- Also: you can absolutely build things you don’t fully understand yet… as long as you’re honest about it and you test what you ship.

You can try it for yourself! Just click the chat icon in the bottom-right corner. If you try the widget and it refuses to answer something you think is on the site, it probably means my retrieval missed the right chunk. If you feel invested, you can [reach out to me](mailto:hello@tany4.com) so I can fine tune it. 🙏
