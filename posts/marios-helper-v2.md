---
title: "Fixing the app I built for my dog's medication schedule"
date: "2026-04-11T12:00:00+0000"
categories: [ "AI", "React Native", "Expo"]
banner: "marios-helper.png"
color: "#556f30"
description: "A year ago I built a small Expo app to remind me to give my dog his eye drops. It worked, mostly. Recently I came back to it with Claude Code and fixed what was broken, then kept going."
readingTimeMinutes: 6
new: true
---

**TL;DR**: I built a medication reminder app for my dog using Expo. It worked well enough but had a few bugs I couldn't fix on my own. A year later I came back to it with Claude Code, fixed the bugs in a couple of sessions, and ended up rewriting most of the app while I was at it.

## The background

My dog Mario has an eye care and pain-killer routine. Every day, several times a day, he needs Hylogel drops. Twice a day, 20 minutes after the Hylogel, he needs Lacrimmune. And there are other medications on top of that.

Getting the timing right is annoying, and missing a dose isn't an option. So about a year ago I built a small React Native app using Expo to handle the reminders. The core requirement was simple: the notification had to be impossible to miss. That meant it should stay in the drawer until I actively acknowledge it, not disappear because I accidentally swiped or closed the app - a sticky notification. Daily scheduled notifications, a "done" button and a snooze button. That's it.

I built it myself. I'm a frontend developer by trade but expo-notifications is fiddly. It took longer than I expected but it worked.

## What was broken

A few things bothered me constantly.

The first: the notification sound only worked when the app was open. When it was closed or in the background it would be silent. Not very helpful indeed.

The second: if I swiped the notification away from the drawer, it was gone. No record, no retry.

There were smaller things too. Some duplicate notifications being triggered. No way to change the notification times without editing code. No way to adjust which chain steps fired when. The app was basically hardcoded.

## Coming back to it with Claude Code

About a year later I had access to Claude Code (Sonnet 4.6) and decided to finally deal with it.

The sound bug turned out to be a misconfiguration in how the notification content was passing the `sound` field. expo-notifications has a quirk where passing the string `'default'` instead of the boolean `true` causes the notification builder to call `setSilent(true)` on Android, which silences it regardless of the channel settings. One word fix.

The duplicate notifications were a double-firing issue - both `getLastNotificationResponseAsync` (which runs on app resume) and `addNotificationResponseReceivedListener` were handling the same notification response. The fix was a simple guard in AsyncStorage: store the last handled notification ID and skip it if it's already been processed.

The fixes took a couple of hours of back and forth. Mostly me describing what I was seeing, Claude reading the relevant files and proposing changes, me testing.

## Then I kept going

Once the bugs were fixed I realised the app was still pretty rigid. Every time Mario's prescription changed (which can be often) I'd have to edit the code directly and that was inconvenient.

So I asked Claude to add a settings page. Not just time pickers, but full chain management - the ability to add medications, define chain steps, set which hours each step should fire, adjust delays between steps. It ended up being more complex than I expected because the chain logic had to stay consistent: if I apply Hylogel at 09:00, 15:00 and 21:00, then I set Lacrimmune to chain after only 9:00 and 21:00 any upcoming chained medication should have 9:00 and 21:00 options available, not all 3 of Hylogel's daily times.

That constraint took a few rounds to get right. The settings UI and the preview summary on the notifications tab had to agree about which hours applied to each step.

## The redesign

At some point during all this the app really looked like it was built in a hurry, which it was. I asked Claude to redo the styling: proper dark/light mode support, consistent card-based layout, sleek styling.

It also reorganised the tabs to make the app more user-friendly. The app used to open on the doctor's instructions screen which was plain text. Now it opens on the notifications tab, which shows a live summary of the current schedule and any pending chain notifications.

## The sticky notification problem, properly

The `sticky: true` issue was the last thing. `setOngoing(true)` works fine on stock Android but OnePlus (and Samsung, and a few others) let users swipe ongoing notifications anyway.

A fix for this is to attach a `deleteIntent` to the notification, a `PendingIntent` that fires when the notification is dismissed. If it's dismissed, we immediately re-post it.

The expo-notifications library doesn't expose this natively, so we patched `ExpoNotificationBuilder.java` directly (using `patch-package` to persist the change across installs) to attach a delete intent to every sticky notification. The intent triggers a `BroadcastReceiver` we wrote in the app's Android project, which unmarshals the original `NotificationRequest` and re-posts the full notification - including the action buttons - using expo's own `CategoryAwareNotificationBuilder`.

So if I swipe it, it comes straight back. The only way to clear it is to tap a button.

## One more edge case

There was one last thing: if a notification fires while the app is open, we show an in-app modal instead of the system banner. But if you close the app without tapping anything, the modal disappears and the notification is gone with nothing in the drawer, no way to know it fired.

One fix I tried was to schedule a backup notification with a short delay. But that doesn't work: if the app is still in the foreground when the backup fires, `shouldShowAlert: false` suppresses it. The notification goes nowhere.

The actual fix: listen to `AppState`. The moment the app transitions to `background` while the modal is visible, post the notification immediately, at that exact point the app IS in background, so it appears in the drawer normally. The modal promise resolves with a `BACKGROUND` sentinel to skip further processing. When the user taps the drawer notification later, it goes through the normal response handler.

## What I took away

The bugs I couldn't fix a year ago weren't particularly hard. They just required knowing where to look and being willing to read through the notification library's source code. Claude did both of those things quickly.

The bigger thing: once the blockers were gone, I found it easy to keep adding things. There was a lot of back and forth, but the friction of making changes was low enough that it was worth trying.

The app works properly now. I don't miss Mario's drops and I had fun building it.

The repo is on GitHub: [altany/marios-helper](https://github.com/altany/marios-helper).
