---
title: "Fixing the app I built for my dog's medication schedule"
date: "2026-04-11T12:00:00+0000"
categories: ["AI", "React Native", "Mobile", "Side projects"]
banner: "marios-helper.png"
color: "#556f30"
description: "A year ago I built a small Expo app to remind me to give my dog his eye drops. It worked, mostly. Recently I came back to it with Claude Code and fixed what was broken, then kept going."
readingTimeMinutes: 6
---

**TL;DR**: I built a medication reminder app for my dog using Expo. It worked well enough but had a few bugs I couldn't fix on my own. A year later I came back to it with Claude Code, fixed the bugs in a couple of sessions, and ended up rewriting most of the app while I was at it.

## The background

My dog Mario has an eye care and pain-killer routine. Every day, several times a day, he needs Hylogel drops. Twice a day, 20 minutes after the Hylogel, he needs Lacrimmune. And there are other medications on top of that.

It's hard to keep track of the timing, and he can't miss a dose. So about a year ago I built a small React Native app with Expo for the reminders. The notification had to be impossible to miss: it should stay in the drawer until I tap it, not disappear if I swipe it or close the app. Daily scheduled notifications, a "done" button and a snooze button.

I built it myself. I'm a front-end developer, but expo-notifications is fiddly and it took me longer than I expected.

## What was broken

A few things kept going wrong.

The first: the notification sound only worked when the app was open. When it was closed or in the background it was silent.

The second: if I swiped the notification away from the drawer, it was gone. No record, no retry.

There were smaller things too. Some notifications fired twice, and I couldn't change the times or which chain steps fired when without editing the code.

## Coming back to it with Claude Code

About a year later I had access to Claude Code (Sonnet 4.6) and decided to finally deal with it.

The sound bug turned out to be a misconfiguration in how the notification content was passing the `sound` field. expo-notifications has a quirk where passing the string `'default'` instead of the boolean `true` causes the notification builder to call `setSilent(true)` on Android, which silences it regardless of the channel settings. One word fix.

The duplicate notifications I thought were fixed but weren't (more on that below).

The fixes took a couple of hours of back and forth. Mostly me describing what I was seeing, Claude reading the relevant files and proposing changes, me testing.

## Then I kept going

Once the bugs were fixed I realised the app was still pretty rigid. Every time Mario's prescription changed (which can be often) I had to edit the code.

I asked Claude to add a settings page where I can add medications, define chain steps, set which hours each step fires and change the delays between steps. It was more complex than I expected because the chain logic had to stay consistent: if I apply Hylogel at 09:00, 15:00 and 21:00 and set Lacrimmune to follow only the 09:00 and 21:00 ones, any medication after Lacrimmune should only offer 09:00 and 21:00, not all three Hylogel times.

That constraint took a few rounds to get right. The settings UI and the preview summary on the notifications tab had to agree about which hours applied to each step.

## The redesign

The app looked like it was built in a hurry, which it was. I asked Claude to redo the styling: proper dark/light mode support and a consistent card-based layout.

It also reorganised the tabs. The app used to open on the doctor's instructions screen which was plain text. Now it opens on the notifications tab, which shows a live summary of the current schedule and any pending chain notifications.

## The sticky notification problem, properly

The `sticky: true` issue was the last thing. `setOngoing(true)` works fine on stock Android but OnePlus (and Samsung, and a few others) let users swipe ongoing notifications anyway.

A fix for this is to attach a `deleteIntent` to the notification, a `PendingIntent` that fires when the notification is dismissed. If it's dismissed, we immediately re-post it.

The expo-notifications library doesn't expose this natively, so we patched `ExpoNotificationBuilder.java` directly (using `patch-package` to persist the change across installs) to attach a delete intent to every sticky notification. The intent triggers a `BroadcastReceiver` we wrote in the app's Android project, which unmarshals the original `NotificationRequest` and re-posts the full notification - including the action buttons - using expo's own `CategoryAwareNotificationBuilder`.

So if I swipe it, it comes straight back. The only way to clear it is to tap a button.

## One more edge case

There was one last thing: if a notification fires while the app is open, we show an in-app modal instead of the system banner. But if you close the app without tapping anything, the modal disappears and the notification is gone with nothing in the drawer, no way to know it fired.

One fix I tried was to schedule a backup notification with a short delay. But that doesn't work: if the app is still in the foreground when the backup fires, `shouldShowAlert: false` suppresses it. The notification goes nowhere.

The actual fix: listen to `AppState`. The moment the app transitions to `background` while the modal is visible, post the notification immediately, at that exact point the app IS in background, so it appears in the drawer normally. The modal promise resolves with a `BACKGROUND` sentinel to skip further processing. When the user taps the drawer notification later, it goes through the normal response handler.

## The duplicates were still there

After all of this I was still occasionally getting duplicate notifications on snooze, sometimes four of them. I couldn't reproduce it reliably, but I thought it was related to my Garmin Fenix watch.

The original guard used AsyncStorage to track which notifications had already been processed. The problem: AsyncStorage reads are async. Both handlers can call `getItem` before either has called `setItem`, so both pass the guard and both schedule a snooze notification. That's where the duplicates came from and it was there from the beginning, the watch interaction just made it easier to trigger.

The fix: replace the AsyncStorage guard with an in-memory `Set`. JavaScript is single-threaded, so a synchronous `Set.has()` check is atomic so the second handler always sees the ID already there and skips. We also added a cancel-before-schedule step: before scheduling any snooze or chain notification, cancel any existing one-shot notifications for the same medication.

The watch also had its own issue. Tapping snooze from the Garmin gave no visible feedback - the notification stayed in the drawer, nothing happened on the phone - but the action was likely processed silently in the background, scheduling a new snooze notification on top of the sticky one still showing. The fix: the snooze button now applies a fixed 10-minute snooze directly without needing the app open, and explicitly dismisses the original. The time picker only appears when you tap the notification body on the phone.

## What I took away

The bugs I couldn't fix a year ago weren't that hard. You had to know where to look and read the notification library's source code, and Claude did that quickly.

Once the bugs were fixed, it was easy to keep adding things. There was a lot of back and forth, but changes were quick to try.

The app works properly now. I don't miss Mario's drops and I had fun building it.

The repo is on GitHub: [altany/marios-helper](https://github.com/altany/marios-helper).
