---
title: "Build automation using Fastlane and Travis"
date: "2020-12-19T15:49:00+0200"
categories: ["React Native", "Mobile"]
banner: "build-automation.png"
color: "#00d8fe"
description: "A year ago releasing the Olio React Native app took most of a day and sometimes failed anyway. Schemes, build variants, match and fastlane got it down to an hour or two across three stores."
readingTimeMinutes: 4
---

**TL;DR**: A year ago getting a release of the Olio app out took most of a day, and sometimes we still couldn't push to the stores. Now it takes an hour or two from sign-off to being live on all three. This is what we changed, and what is still manual.

Building an app can be easy - delivering to users not so much

The app works on the developer's machine, and then there is a list of configuration and steps between that and the store, most of it fiddly and easy to get wrong.

A year ago we did almost all of it by hand, iOS especially. It could take a whole day, and at the end of that day we were sometimes still unable to push a build, because something in the signing or the configuration was wrong.

## Schemes, on iOS

We set up schemes for the environments we build for, staging and production, and for debug and release.

The point is that nobody has to remember anything. Before, building for a particular environment meant setting variables and pointing at the right input files by hand, and getting one of them wrong gave you a build that looked fine and wasn't.

## Signing, on iOS

We moved signing over to match, and I would recommend it to anyone who hasn't.

Certificates used to be a steady source of problems. A developer would build without syncing their certificates first, or a new tester would be added and simply couldn't run the build. With match the certificates live in a repository and are pulled every time, so there is nothing to remember and nothing to get out of step.

## Build variants, on Android

The same idea, with Android's names for it: flavours for staging and production, types for debug and release.

## Fastlane

Once it was set up properly, fastlane automated the whole thing: building the app and deploying it to Firebase for internal testing. That change on its own took us from over a day to a couple of hours.

It also handles the small things that used to be somebody's job to remember:

- running `pod install` and `npx jetify` so the native side is never stale
- bumping the version. You change it in `package.json` and a lane carries it through to the Xcode project
- building the Android bundle along with the production release APK

Uploading to App Store Connect and the Play Console is partly there and still being worked on.

Getting here was not pleasant. The documentation is thin, and a lot of it was trial and error over a long time. But once it was set up it has been reliable, which is the part that matters.

## Release notes

We use Renogen to generate the release notes. The changelog entry goes into the pull request when there is something worth saying, so by the time we release, the notes have written themselves.

It is a small thing that removes one of the most tedious parts of the process.

## Travis, which is where we are now

This is still in progress.

Right now a release has to be triggered by a developer, locally. That means someone stops what they are doing, runs the process on their own machine, and waits. The work is automated but the starting of it isn't, and it is still a developer's problem.

What we want is for QA to create a tag on master and get a fresh build out of it, with no developer involved at all. That is what we are setting Travis up to do.

## What it has been worth

It is worth configuring the project properly early, so that automation has something to stand on. Schemes, variants and signing are the kind of thing that is tedious to do and much more tedious to retrofit.

The documentation across these tools is still the weakest part, and I don't think that is only us.

For the team, two things changed. QA gets a build almost every day now, and since that started we have consistently shipped releases with no bugs in them, which had not happened before. And the whole process is something a new person can pick up, instead of knowledge that lives in one developer's head.
