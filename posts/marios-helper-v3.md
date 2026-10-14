---
title: "Rewriting my dog's medication app from my phone"
date: "2026-10-11T12:00:00+0000"
categories: ["AI", "React Native", "Mobile", "Side projects"]
banner: "marios-helper-v3.png"
color: "#fbf5ec"
description: "Mario's medication app still let doses slip, so I had Claude Code rewrite it from my phone, and set it up so every change reaches the app on its own a couple of minutes after I say merge."
readingTimeMinutes: 8
new: true
---

**TL;DR**: [Six months ago](/blog/posts/marios-helper-v2) I fixed the bugs in the app that reminds me about my dog Mario's medicines. It still wasn't right. This time I had Claude Code rewrite it, and I did it all from the Claude app on my phone. The app uses a different notification library now, the next medicine in a chain is timed from when I actually gave the previous one, and every change reaches my phone by itself a couple of minutes after I say "κάνε merge" (merge it).

## What was still wrong

Mario still has Hylogel drops several times a day, and Lacrimmune 20 minutes after some of them. The app from [the last post](/blog/posts/marios-helper-v2) mostly worked, but not always when it mattered.

- **The buttons did nothing with the app closed.** If I tapped "I gave it" on the notification, or on my Garmin watch, while the app was closed, no code ran. So the reminder for Lacrimmune never came until I opened the app.
- **I couldn't move a dose.** All I could do was postpone a reminder once it went off. I couldn't change its time in advance, or move it earlier.
- **The swipe fix was fragile.** In the last post I patched the notification library so a swiped notification came back. The patch lived in an `android` folder I'd edited by hand, so the app could only be built on my laptop. And since Android 14, every phone lets you swipe away notifications marked as ongoing, not just OnePlus and Samsung.

So I opened a Claude Code session in the Claude app and asked for a rewrite. Same screens as before (settings, the vet's prescription, the schedule preview), notifications that stay until I answer them, chains of medicines, and easy time changes for single doses. I also asked it to look into what else an app like this should do.

## A different notification library

The old app used expo-notifications. The new one uses [react-native-notify-kit](https://github.com/marcocrupi/react-native-notify-kit), the maintained fork of [Notifee](https://github.com/invertase/notifee). It handles the parts I kept fighting:

- **Buttons work with the app closed.** The library runs the app's code in the background when a button is tapped. "I gave it" from the watch records the dose and schedules the next medicine straight away.
- **It knows when a notification is swiped away.** The app posts it again, without sound. No patch and no Java of our own.
- **Reminders use Android's exact alarms**, so they go off on time even when the phone is idle.

By default, if I don't answer, the reminder rings again every 10 minutes, up to six times, then stays in the drawer quietly. After 12 hours it clears itself and the dose counts as missed.

Notification texts use plain words instead of symbols like ✓ or ′ for minutes, so they show properly on the watch: "Αργότερα 10 λεπτά" (later, 10 minutes).

The rewrite started on Notifee itself. Its repository was archived in April 2026, and it doesn't work with React Native's New Architecture. When I upgraded the app to Expo SDK 57, which needs the New Architecture, I moved to notify-kit. Invertase, who made Notifee, recommend it, and it has the same API, so only the import changed in the app's code.

## Chains timed from when I actually gave the medicine

The schedule is built from routines. A routine is a few medicines given one after the other, at set times: Hylogel, then Lacrimmune 20 minutes later, at 09:00 and 21:00.

The 20 minutes count from when I tap "I gave it", not from 09:00. If I give Hylogel at 09:04, Lacrimmune rings at 09:24. In between, a notification counts down.

The app works out every dose a week ahead, and each dose has its own record. That's what makes single changes possible. I tap a future dose and move it or skip it, and nothing else changes. I can also move a whole day at once, for example an hour later when we wake up late.

Every change goes through one function. It saves the data, works out which notifications should exist, compares that with what's scheduled on the phone, and only changes the difference. Each dose has exactly one notification ID, so the duplicate snoozes from the last post can't come back.

The schedule logic is plain TypeScript with tests, with no React or notification code in it. The notification flow has tests too, against a fake notification library.

On the first start, the old settings moved over by themselves. Hylogel at 09:00, 15:00 and 21:00 with Lacrimmune after the 09:00 and 21:00 ones became two routines.

## New versions without a laptop

This was the part I cared about most. Before, every change ended with me at my laptop, building and installing. I wanted to ask for a change from my phone and get the new version on my phone, without having to deal with anything.

My [Android Auto app](/blog/posts/greek-voice-commands-for-android-auto) goes through a Google Play internal testing track, because the car only shows apps installed from Play. Mario's app doesn't need that, so it uses Expo's own services:

- **EAS Build** builds the APK in the cloud. I install it from a link on my phone.
- **EAS Update** sends JavaScript changes over the air. The app downloads them by itself and shows "Υπάρχει νέα έκδοση" (there's a new version) with a restart button.

A GitHub Action runs on every merge to main. It works out a fingerprint of the native side of the app: native libraries, permissions and config. If there's already a build with that fingerprint, only JavaScript changed, and it publishes an update. If not, it starts a new build and puts the install link in the run summary. The app's runtime version is that same fingerprint, so an update only ever reaches a build that can run it.

The one-time setup was an access token from expo.dev, saved as a secret in the GitHub repo. I did it on my phone. The first build took about ten minutes, and I installed it from the link.

Now a change goes like this:

1. I ask for it in Greek, in the Claude app.
2. Claude makes it on a branch, runs the tests, opens a PR and sends me screenshots.
3. I say "κάνε merge".
4. Claude merges it and checks the deploy run. A couple of minutes later it tells me the update is out.
5. I open the app and tap "Επανεκκίνηση" (restart).

Updates change the code, not the data. After the first one, I asked whether it had overwritten the new schedule I'd just set up. It hadn't. Medicines, times and history are saved on the phone and stay where they are.

## The battery setting that looked fine

The app has a list of checks in its settings: notification permission, exact alarms, battery saving. On my phone the battery line said "Χωρίς περιορισμό μπαταρίας" (no battery restriction), while the phone's own settings said the app was restricted. I thought the app was wrong.

It wasn't, but its label was. It named what the setting *should* be, with a warning icon next to it, and it read like a claim that all was fine. Now every line says how things are right now.

Then the phone. Its switch "Επιτρέψτε τη χρήση στο παρασκήνιο" (allow background usage) was on, and that isn't enough. You have to tap the words next to it, not the switch, and choose "Χωρίς περιορισμούς" (unrestricted). Otherwise Android may not wake the app, and reminders can come late or not at all.

The app can't flip that setting for me. It can only check it and open the right screen.

## Small changes, the same way

After the rewrite, the rest were small requests from my phone. Each one was a PR, a "κάνε merge", and an update a couple of minutes later.

- **Every 8 hours.** Mario moved from Depon to a different medicine every 8 hours, with the first dose at 07:00, and I couldn't set that up easily. Now a routine has "Κάθε … ώρες" (every … hours). I pick the first dose and the gap, and it fills in 07:00, 15:00 and 23:00.
- **An empty start.** A new install used to start with Mario's old schedule built in. Now it starts empty.
- **The vet's first prescription.** The original instructions (Exocin, Hylogel and Lacrimmune until the end of August) had disappeared along with the old built-in data. I wanted them back, so now they're a fixed card on the prescription tab.

## A dog theme

The last request was the fun one: "Μπορείς να την κάνεις dog themed?" (can you make it dog themed?)

The colours come from Mario's photo: cream for his fur, caramel for his ears, and a red ring around his photo for his bandana. Paw prints replace the ticks. A row of them fills in as the day's doses are given, and when they're all done it says "Μπράβο Μάριο!" (well done, Mario) next to a bone.

The app is in Greek, so I've translated the screenshots for this post.

![The Today screen in the new theme: a paw print for each of the day's doses, the medicine that's due now, and the day's routines. Next to it, a finished day with every paw filled in and "Well done, Mario!"](/blog/marios-helper-v3-screens.png)

Titles use a rounded font. The first one Claude picked, Nunito, turned out to have no Greek letters at all, so it's M PLUS Rounded 1c instead, cut down to Latin and Greek so it's 64 KB instead of 3.6 MB.

All of it was JavaScript and a font file, so it arrived as an update like everything else.

## What still isn't great

- **Some changes still need an install.** A new permission or native library means a new APK. That's rare, and the link arrives in the run summary, but it isn't automatic. Play internal testing would fix that, and I might add it later.
- **The notification library has one maintainer.** notify-kit is actively developed, but by one person, so I've pinned its exact version and update it on purpose.
- **Claude can't test on my phone.** It runs the tests, previews the screens in a browser and sends me screenshots, but notifications don't run there. Whether a reminder actually rings with the app closed, I only find out on my phone.
- **Battery settings are different on every phone.** The app can check them and point me to the right screen, nothing more.

## What I took away

The biggest difference from last time isn't the code. Last time, every change ended at my laptop. Now a change is a message from my phone and a couple of minutes' wait. So I ask for small things I'd never have sat down to do, like making the app look like Mario.

The reminders work, and the app looks like him now.

The repo is on GitHub: [altany/marios-helper](https://github.com/altany/marios-helper).
