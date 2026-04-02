---
title: "Vibe coding an AI chatbot into my website"
date: "2025-12-15T12:00:00+0000"
categories: ["AI", "Vibe coding", "Chatbot"]
banner: "vercel-aisdk.png"
color: "#f66f6e"
description: "One evening I built a small AI chatbot into this site using the Vercel AI SDK. It only answers questions about my actual work. Here's what I built and what I learned."
readingTimeMinutes: 4
updated: "2025-12-16T12:00:00+0000"
---

**TL;DR**: I built a chatbot into this website one evening. It answers questions about my work using content from the site and my CV, and it refuses to make things up. I had no idea what I was doing at the start. I mostly got it working by asking the AI a lot of questions and nudging things until they behaved; and then being slightly surprised when they actually did.

## The idea

I wanted a small "ask about my work" widget on the site. Not a full product, just a friendly helper that can answer questions like:

- What's your current role?
- What projects have you worked on recently?
- What have you written about on your blog?

One rule: it should only answer using content that's actually on the site or in my CV.

## The stack

This was a Next.js site already, so the shape of the solution was pretty straightforward:

- A floating chat widget
- A `/api/chat` endpoint
- A prompt that says "don't make things up" (politely but firmly)

I used the Vercel AI SDK with OpenAI to power the responses.

## Keeping it grounded

The hard part wasn't making the LLM respond - that's easy. The hard part was making sure it only answers with things that are actually true about me.

Before this project I barely knew what "retrieval" meant. I got it working by asking the assistant a lot of questions and reading the code until it stopped feeling like magic.

The end result: I built a pool of text from what's already on the site, i.e. the home page, work page, blog posts, and my CV. For each question, we grab the bits that look most relevant and pass them into the prompt as context. If the context doesn't have the answer, the assistant says: I don't have that information in the website/CV.

## Making it less eager to say "I don't know"

After trying a bunch of normal questions, I realised it was refusing way too often. So I tweaked the prompt to be more useful without letting it hallucinate.

A few changes that helped:

- I loosened the rules and expanded how much context we return, so broad questions pull in something relevant more reliably
- Instead of forcing an immediate refusal, it now answers what it can and asks one short clarifying question if needed
- It still uses the refusal line when there's genuinely nothing in the content to back up an answer

## The debugging

A few things were harder than expected:

- The chatbot was too eager to say it didn't know things, even when the answer was on the site
- Getting streaming right was trickier than expected, so I dropped it - answers appear all at once
- Getting the OpenAI key permissions right taught me more about API scopes than I planned to know

## A couple of UX touches

Once the backend was stable, I made it feel a bit more conversational. User and assistant messages have different bubble styles. Also, the empty state has example prompts so you're not staring at a blank box.

## Key takeaways

Vibe coding is fun, but you still need guardrails if you don't want nonsense answers. And you can absolutely build things you don't fully understand yet, as long as you're honest about it and you test what you ship.

You can try it yourself: the chat icon is in the bottom right corner. If it refuses something you think is on the site, it probably means the retrieval missed the right chunk. Feel free to reach out if that happens.
