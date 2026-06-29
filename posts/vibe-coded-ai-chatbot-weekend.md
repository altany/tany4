---
title: "Vibe coding an AI chatbot into my website"
date: "2025-12-15T12:00:00+0000"
categories: ["AI", "Vibe coding", "Chatbot"]
banner: "vercel-aisdk.png"
color: "#f66f6e"
description: "One evening I built a small AI chatbot into this site with the Vercel AI SDK. It only answers questions about my actual work."
readingTimeMinutes: 4
updated: "2025-12-16T12:00:00+0000"
---

**TL;DR**: I built a chatbot into this website one evening. It answers questions about my work using content from the site and my CV, and it refuses to make things up. I had no idea what I was doing at the start. I mostly got it working by asking the AI a lot of questions and adjusting things until they worked.

## The idea

I wanted a small "ask about my work" widget on the site. Not a full product, just something that answers questions like:

- What's your current role?
- What projects have you worked on recently?
- What have you written about on your blog?

One rule: it should only answer using content that's actually on the site or in my CV.

## The stack

The site was already Next.js, so the setup was simple:

- A floating chat widget
- A `/api/chat` endpoint
- A prompt that tells it not to make things up

I used the Vercel AI SDK with OpenAI to power the responses.

## Keeping it grounded

Making the LLM respond was the easy part. The work was making sure it only answers with things that are actually true about me.

Before this project I barely knew what "retrieval" meant. I got it working by asking the assistant a lot of questions and reading the code until I understood it.

So I built a pool of text from what's already on the site: the home page, work page, blog posts, and my CV. For each question it pulls the most relevant bits and passes them to the prompt as context. If the answer isn't there, it says it doesn't have that information.

## Making it less eager to say "I don't know"

After trying a bunch of normal questions, I realised it was refusing too often. So I adjusted the prompt to be more helpful without letting it make things up.

A few changes that helped:

- I loosened the rules and returned more context, so broad questions are more likely to pull in something relevant
- Instead of forcing an immediate refusal, it now answers what it can and asks one short clarifying question if needed
- It still uses the refusal line when there's genuinely nothing in the content to back up an answer

## The debugging

A few things were harder than expected:

- The chatbot was too eager to say it didn't know things, even when the answer was on the site
- Getting streaming right was trickier than expected, so I dropped it - answers appear all at once
- Getting the OpenAI key permissions right took longer than expected

## A couple of UX touches

Once the backend worked, I tidied up the UI. User and assistant messages have different bubble styles, and the empty state shows example prompts instead of a blank box.

## Key takeaways

Vibe coding is fun, but without guardrails you get nonsense answers. I built something I didn't fully understand at the start, and it works because I tested it as I went.

You can try it yourself: the chat icon is in the bottom right corner. If it refuses something you think is on the site, it probably means the retrieval missed the right chunk. Feel free to reach out if that happens.
