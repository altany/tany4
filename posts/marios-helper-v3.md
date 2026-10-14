---
title: "Rewriting my dog's medication app from my phone"
date: "2026-10-11T12:00:00+0000"
categories: ["AI", "React Native", "Mobile", "Side projects"]
banner: "marios-helper-v3.png"
color: "#fbf5ec"
description: "I rebuilt the app that reminds me about my dog's medicines without opening my laptop. How a change gets from a message on my phone to the app, the safety nets that let me trust changes I didn't type, and the parts you can reuse."
readingTimeMinutes: 9
new: true
---

**TL;DR**: My dog Mario takes medicines that have to be given in order, with set gaps between them. [Six months ago](/blog/posts/marios-helper-v2) I fixed the app that reminds me, but it still let doses slip, and every change needed my laptop. This time I rebuilt it from the Claude app on my phone. A change is now a message, a PR and "merge it", and a couple of minutes later it's on my phone. This post is about how that works, the safety nets that let me trust changes I didn't type, and the reminder logic, so you can take the parts you need.

## Why this app exists

Mario has eye drops several times a day, and an eye ointment 20 minutes after some of them. The gap matters: the drops need time to be absorbed, or the ointment washes them out. He also has a painkiller every 8 hours, and his medicines have changed many times.

The medicine names in this post and its screenshots are made up. I'll call the drops Blinkdrops and the ointment Tearshield.

A normal reminder app rings at fixed times. That isn't enough here. The ointment should come 20 minutes after I actually gave the drops, not 20 minutes after they were planned.

## What was still wrong

The app from [the last post](/blog/posts/marios-helper-v2) mostly worked, but not always when it mattered:

- **The buttons did nothing with the app closed.** If I tapped "I gave it" on my Garmin watch, no code ran, so the reminder for the ointment never came.
- **I couldn't plan ahead.** I could only postpone a reminder once it went off. When I'd slept in, or wanted an early night and had to start the doses early, I couldn't see or move the day's doses in advance. I wanted to know when each one would be, so I could plan my day.
- **Every change ended at my laptop.** A fix for swiped-away notifications lived in an `android` folder I'd edited by hand, so only my laptop could build the app.

The last one was the one I most wanted gone.

## Shipping from my phone

I asked for the rewrite in a Claude Code session in the Claude app, and I never opened my laptop. Claude works on a branch, runs the tests, opens a PR and sends me screenshots of the screens. I look at them on my phone and say "merge it".

To get the result onto the phone without a laptop, I used two Expo services and a GitHub Action:

- **EAS Build** builds the Android app (APK) in the cloud. I install it from a link.
- **EAS Update** sends JavaScript changes over the air. The app downloads them by itself and shows "There's a new version" with a restart button.

The Action runs on every merge to main and decides which of the two a change needs. It works out a fingerprint of the app's native side: native libraries, permissions and config. If a build with that fingerprint already exists, only JavaScript changed, so it publishes an update. If not, it starts a new build and puts the install link in the run summary. The app's runtime version is that same fingerprint, so an update can only reach a build that can run it.

Updates change the code, not the data. Medicines, times and history stay on the phone.

All of this fits in Expo's free plan. The one-time setup was an access token from expo.dev, saved as a secret in the GitHub repo, and I did that on my phone too.

**If you want this for your own app:** it's [one workflow](https://github.com/altany/marios-helper/blob/main/.github/workflows/deploy.yml) and [one script](https://github.com/altany/marios-helper/blob/main/scripts/deploy.sh). The fingerprint check is the part worth copying. You never have to decide by hand whether a change needs a new build.

## Trusting changes I didn't type

From a phone, I don't read every line. So the setup has to catch mistakes for me.

- **Tests on the logic that matters.** The schedule logic is plain TypeScript, with no React or notification code in it, so it can be tested on its own. The notification flow is tested against a fake notification library. Claude can't run the app on my phone, so these tests are what check a change before it reaches me.
- **One way to change the data.** Every change goes through one function. It saves the data, works out which reminders should exist, compares that with what's scheduled on the phone, and only changes the difference. Each dose has one notification ID, so a dose can't end up with two reminders.
- **A second opinion.** Before I tested the Expo SDK 57 upgrade, a second Claude session reviewed the changes and the test plan. It caught things the first one missed: the notification library's version wasn't pinned, the plan never tried installing the new version over the old one, and nothing tested a reminder overnight, when Android delays alarms the most.
- **A test copy of the app.** A change to the native side can break reminders, and these are Mario's medicines. Adding a label to a PR builds "Mario TEST", a separate app that installs next to the real one, with its own data. I try the change there first, including installing it over the old version.

**TODO: one or two lines on what testing the upgrade on Mario TEST found.**

**If you build with an AI agent from your phone:** keep the logic you care about where it can be tested without a phone, and send risky changes through a test copy of the app first.

## Reminders that follow what actually happened

The schedule is built from routines. A routine is a few medicines given one after the other, at set times: Blinkdrops, then Tearshield 20 minutes later, at 09:00 and 21:00.

- **The gap counts from the tap.** The 20 minutes start when I tap "I gave it", not at 09:00. If I give Blinkdrops at 09:04, Tearshield rings at 09:24, and a notification counts down in between. That way the drops always get their full 20 minutes.
- **"Every 8 hours" means 8 hours after the last dose.** If one painkiller dose is an hour late, the rest of the day moves with it.
- **Every dose exists a week ahead.** Each one has its own record, so I can see the whole day in advance and move or skip one dose, a whole chain or the whole day: an hour later when we slept in, earlier before an early start. That's the planning I couldn't do before.
- **Reminders don't need the app open.** Because the week is scheduled in advance, reminders keep coming even if I don't open the app for days.

The notifications themselves:

- **Buttons work with the app closed**, on the phone and on the watch. The notification library runs the app's code in the background, so "I gave it" on the watch records the dose and schedules the next medicine.
- **Plain words**, because symbols like ✓ or ′ don't show properly on the watch: "Later 10 minutes", not "Later 10′".
- **Hard to miss, but not forever.** An unanswered reminder rings every 10 minutes for an hour, then waits quietly. If I swipe it away without answering, it comes back without sound. After 12 hours it counts as missed, so old reminders don't pile up.
- **Exact alarms**, so reminders go off on time even when the phone is idle.

The library is [react-native-notify-kit](https://github.com/marcocrupi/react-native-notify-kit), the maintained fork of [Notifee](https://github.com/invertase/notifee). The rewrite started on Notifee itself. It was archived in April 2026, and it doesn't work with React Native's New Architecture. When I upgraded the app to Expo SDK 57, which needs the New Architecture, I moved to the fork. It has the same API, so only the import changed.

**If you build reminders for anything** (medicines, feeding, plants): time follow-ups from the action, not the plan; make every button work without opening the app; and expect people to swipe notifications away.

## The Android setting that quietly breaks reminders

This one is worth knowing even if you never build an app. On my phone, the switch "Allow background usage" was on, and reminders could still come late. The switch isn't enough. You have to tap the words next to it, not the switch, and choose "Unrestricted". Otherwise Android may not wake the app at all.

An app can't change that setting itself. Mario's app has a list of checks in its settings (notifications, exact alarms, battery) that shows how each one is right now and opens the right screen to fix it. An earlier version labelled the battery line with what it *should* be, which read like everything was fine. Now each line says how things actually are.

## Making it Mario's

Once a change costs a message and a couple of minutes, I started asking for things I'd never have sat down to do:

- **A dog theme.** The colours come from Mario's photo: cream for his fur, caramel for his ears, and red for his bandana. Paw prints fill in as the day's doses are given, and a finished day says "Well done, Mario!".
- **Reminders that bark.** The bark is a synthesised "woof woof" made for the app, so there's no licence to worry about. A switch in the settings goes back to the phone's usual sound.
- **TODO: English.** The app follows the phone's language, Greek or English, so people who don't read Greek can use it too. Fill in once it's done.

**TODO: retake the screenshots below from the English version of the app.**

![The Today screen in the new theme: a paw print for each of the day's doses, the medicine that's due now, and the day's routines. Next to it, a finished day with every paw filled in and "Well done, Mario!"](/blog/marios-helper-v3-screens.png)

## What still isn't great

- **Some changes still need an install.** Anything on the native side means a new APK. When I asked for the reminders to bark, the sound file had to be built into the Android app, because that's where notification sounds have to live. The Expo SDK 57 upgrade needed one too, because it changed the native libraries. That's rare, and the link arrives in the run summary, but it isn't automatic. Play internal testing would fix that, and I might add it later.
- **The notification library has one maintainer.** notify-kit is actively developed, but by one person, so I've pinned its exact version and update it on purpose.
- **Claude can't test on my phone.** The tests and the test app cover a lot, but whether a reminder actually rings with the app closed, I only find out on a real phone.
- **Battery settings are different on every phone.** The app can check them and point to the right screen, nothing more.

## Take what you need

The code is on GitHub: [altany/marios-helper](https://github.com/altany/marios-helper). The parts most worth reusing:

- [`deploy.yml`](https://github.com/altany/marios-helper/blob/main/.github/workflows/deploy.yml) and [`deploy.sh`](https://github.com/altany/marios-helper/blob/main/scripts/deploy.sh): an update or a new build on every merge, decided by the native fingerprint.
- [`app.config.js`](https://github.com/altany/marios-helper/blob/main/app.config.js) and the `test` profile in `eas.json`: a test copy of the app that installs next to the real one.
- [`src/engine/`](https://github.com/altany/marios-helper/tree/main/src/engine): the schedule logic and its tests, with no React in it.
- [`src/notify/`](https://github.com/altany/marios-helper/tree/main/src/notify): reminders whose buttons work with the app closed.

The biggest change from last time isn't the code. Last time, every change ended at my laptop. Now it's a message from my phone and a couple of minutes' wait, so I fix small things as soon as they bother me. If something small at home bothers you, that's cheap enough to just fix it.
