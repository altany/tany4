---
title: "Rewriting my dog's medication app from my phone"
date: "2026-10-11T12:00:00+0000"
categories: ["AI", "React Native", "Mobile", "Side projects"]
banner: "marios-helper-v3.png"
color: "#fbf5ec"
description: "Mario's medication app still let doses slip, and every fix meant sitting at my laptop. So I rebuilt it from my phone, with Claude Code, Expo and a GitHub Action."
readingTimeMinutes: 8
new: true
---

**TL;DR**: Mario's medication app still let doses slip, and every fix meant sitting at my laptop. So I rebuilt it without opening my laptop once. I asked for changes from the Claude app on my phone, and a GitHub Action got them onto the app a couple of minutes after I said "merge it". Here's how it works, what stops me from breaking things I can't see, and the bits you can steal for your own projects.

## The background

If you read [the last post](/blog/posts/marios-helper-v2), you've met Mario, my dog, and his eye drops. He has drops several times a day and an eye ointment 20 minutes after some of them, so the drops have time to absorb and the ointment doesn't wash them out. There's also a painkiller every 8 hours. And his medication keeps changing, so whatever I build has to be easy to change too.

(The medicine names in this post are made up. Let's call them Blinkdrops and Tearshield.)

Last time I fixed several bugs with Claude Code, but there were still some things bugging me.

## What was still broken

The buttons didn't work with the app closed. If I tapped "I gave it" on my Garmin watch, nothing ran, so the Tearshield reminder never came. Which was kind of the whole point of the app.

I also couldn't plan ahead. I could only postpone a reminder once it went off. If I'd slept in, or wanted an early night and had to start the doses early, there was no way to see when each one would be or to move them in advance. I wanted to know when each one was coming so I could plan my day around it.

And the swipe fix from last time lived in an `android` folder I'd patched by hand, so only my laptop could build the app. Every change, however small, ended with me at my laptop. That was the part that bothered me most.

## Doing it all from my phone

So I opened a Claude Code session in the Claude app on my phone and asked for a rewrite. Same screens as before, but with notifications that stay until I answer them, chains of medicines, and easy time changes for single doses and whole chains.

The flow now is pretty simple. I ask for something, Claude makes it on a branch, runs the tests, opens a PR and sends me screenshots. I look at them on my phone and say "merge it". A couple of minutes later the app tells me there's a new version.

To get there I needed two Expo services and one GitHub Action:

- **EAS Build** builds the APK in the cloud and gives me a link to install it.
- **EAS Update** sends JavaScript changes over the air. The app downloads them by itself and shows "There's a new version" with a restart button.

The Action runs on every merge to main and works out which of the two it needs. It takes a fingerprint of the native side of the app (native libraries, permissions, config). If there's already a build with that fingerprint, only JavaScript changed, so it publishes an update. If not, it starts a new build and puts the install link in the run summary. The app's runtime version is that same fingerprint, so an update can never land on a build that can't run it.

I've checked that updates change the code, not the data, so the day's schedule and the medicines I've already given are still there after an update.

All of this runs on Expo's free plan, and the one-time setup (an Expo access token saved as a GitHub secret) I did on my phone too.

If you only take one thing from this post, take the fingerprint check. You never have to think about whether a change needs a new build. It's [one workflow](https://github.com/altany/marios-helper/blob/main/.github/workflows/deploy.yml) and [one script](https://github.com/altany/marios-helper/blob/main/scripts/deploy.sh).

## Not breaking things I can't see

Here's the catch with coding from your phone: you don't read every line the way you would at a desk. So the project has to catch mistakes for me.

The schedule logic is plain TypeScript with no React or notification code in it, so it's tested on its own. The notification flow has tests too, against a fake notification library. Claude can't run the app on my phone, so the tests are what stands between a change and Mario's reminders.

Every change to the data goes through one function. It saves, works out which reminders should exist, compares that with what's scheduled on the phone, and only changes the difference. Each dose has one notification ID, so no more duplicate reminders like last time.

For the big stuff I get a second opinion. Before testing the Expo SDK 57 upgrade, I had another Claude session review the diff and the test plan. It found things the first one missed: the notification library wasn't pinned to an exact version, nothing tested installing the new version over the old one, and nothing tested a reminder overnight, which is exactly when Android likes to delay alarms.

And for anything native there's a test copy of the app. Adding a `test-build` label to a PR builds "Mario TEST", a separate app that sits next to the real one with its own data. These are Mario's actual medicines, so I'd rather break the test app.

**TODO: what testing the upgrade on Mario TEST found.**

## Reminders that follow real life

The schedule is made of routines. A routine is a few medicines one after the other at set times, like Blinkdrops and then Tearshield 20 minutes later, at 09:00 and 21:00.

The important bit: the 20 minutes start when I tap "I gave it", not at 09:00. If I give Blinkdrops at 09:04, Tearshield rings at 09:24, with a countdown notification in between. Same with the painkiller. "Every 8 hours" means 8 hours after the dose I actually gave, so if one is an hour late, the rest of the day moves with it.

That one came from a real morning. I sent Claude this from my phone:

> I gave the 8-hour medicine at 8:22 but the next dose says 15:00. Didn't it move to 8 hours after?

It didn't, and now it does. It took a couple more rounds to get it fully right, all reported the same way: from my phone, with the app open in front of me.

Every dose exists a week ahead, each with its own record. So I can see my whole day in advance and move or skip one medicine, a whole chain, or the whole day. An hour later because we slept in, or earlier because I want an early night. Finally.

And the notifications:

- The buttons work with the app closed, on the phone and on the watch. The library runs the app's code in the background, so "I gave it" on the watch records the dose and schedules the next one.
- Plain words, because the watch doesn't show symbols properly: "Later 10 minutes", not "Later 10′".
- If I don't answer, it rings every 10 minutes for an hour, then waits quietly. If I swipe it away without answering, it comes back without sound. After 12 hours it gives up and counts the dose as missed.
- Exact alarms, so they go off on time even when the phone is idle.

The library is [react-native-notify-kit](https://github.com/marcocrupi/react-native-notify-kit), the maintained fork of [Notifee](https://github.com/invertase/notifee). We started on Notifee itself, but it was archived in April 2026 and doesn't work with React Native's New Architecture, which Expo SDK 57 needs. The fork has the same API, so the switch was one import.

## The Android setting that lies to you

Worth knowing even if you never build an app. My phone said "Allow background usage" was on, and reminders still came late. Turns out the switch isn't enough. You have to tap the words next to it (not the switch!) and pick "Unrestricted". Otherwise Android can decide not to wake the app at all.

The app can't change that for me. What it can do is show a checklist in the settings: notifications, exact alarms and battery, how each one is set right now, with a button that opens the right screen to fix it. The first version labelled the battery line with what it *should* be, which read like everything was fine. It wasn't. Now every line says how things actually are.

## Making it Mario's

Once a change costs me a message and a couple of minutes, I started asking for things I'd never sit down to do.

> Can you make it dog themed?

The colours now come from Mario's photo: cream for his fur, caramel for his ears and red for his bandana. Paw prints fill in as the day's doses are given, and when they're all done it says "Well done, Mario!".

Then I wanted the reminders to bark. My feedback on the first bark Claude made:

> It's a bit high-pitched and annoying, like a puppy. Make it more grown-up.

The second one got an "ok". It's a synthesised "woof woof" made just for the app, so there's no licence to worry about, and a switch in the settings goes back to the phone's usual sound.

**TODO: English version. The app follows the phone's language, Greek or English.**

**TODO: retake the screenshots below from the English version of the app.**

![The Today screen in the new theme: a paw print for each of the day's doses, the medicine that's due now, and the day's routines. Next to it, a finished day with every paw filled in and "Well done, Mario!"](/blog/marios-helper-v3-screens.png)

## What still isn't great

- Some changes still need an install. Anything native means a new APK: the bark had to be built into the Android app, and the SDK 57 upgrade changed the native libraries. It doesn't happen often, and the link lands in the run summary, but it isn't automatic. Play internal testing would fix that. Maybe later.
- The notification library has one maintainer. I've pinned the exact version, and I'll update it on purpose.
- Claude can't test on my phone. The tests and the test app catch a lot, but whether a reminder actually rings with the app closed, only my phone can tell me.
- Battery settings are different on every phone. The app can check them and point me to the right screen, and that's it.

## Key takeaways

- The setup is what made this work. Once shipping is a message and a couple of minutes, small fixes actually happen.
- Put the logic you care about somewhere it can be tested without a phone, and send risky changes through a test copy of the app first.
- Time follow-ups from what actually happened, not from the plan. Real life runs late.
- Report bugs like you'd tell a friend. "I gave it at 8:22 but it says 15:00" was enough to start from.

The code is on GitHub: [altany/marios-helper](https://github.com/altany/marios-helper). If you want to steal bits, start with [`deploy.sh`](https://github.com/altany/marios-helper/blob/main/scripts/deploy.sh) for update-or-build on every merge, [`app.config.js`](https://github.com/altany/marios-helper/blob/main/app.config.js) for the side-by-side test app, and [`src/engine/`](https://github.com/altany/marios-helper/tree/main/src/engine) for the schedule logic and its tests.

Mario gets his drops on time, and the app finally looks like him.
