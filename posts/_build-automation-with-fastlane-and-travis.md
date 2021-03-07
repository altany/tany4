---
title: "Build automation using Fastlane and Travis"
date: "2020-12-19T15:49:00+0200"
categories: react native build automation fastlane travis xcode gradle
banner: "build-automation.png"
color: "#00d8fe"
---

## Intro

Building an app can be easy - delivering to users not so much
After having a functional app that works locally on the devs machine, configuration and steps required to build and deploy. Often complicated ones, or error-prone

A year ago, the whole thing was done almost completely manually, especially for iOS.
Could take up to a whole day and even then sometimes due to errors we were still unable to push to the stores.

Now, it takes us about one or two hour from sign-off to releasing to all (3) stores, Play store, App store and Huawei.

How we did it.

### iOS only

#### Schemas

For different environments (staging vs production) and modes (debug vs release)
Made it easy to build using various configurations without having to manually set variables and input files

#### Match

Switching to match for signing is recommended and for good reason
Before we often had certificate issues, e.g. the developer would forget to sync certificates before building and new testers would not be able to run the build.
With match, the certificates are stored and synced via a github repo which is pulled every time.

## Android only

Build Variants - flavours (staging vs production) and types (debug vs release)
Similar to iOS

## iOS and Android

### Fastlane

Once finally set up correctly, we were able to automate the full process of building the app and deploying to firebase for internal testing.
This change alone reduced the process from over a day to just a couple of hours
Not well documented. Very time consuming and often frustrating to figure things out. But once set up, very reliable

### Renogen

Automated release notes generation
One of the most tedious and boring parts of the process is now absorbed into the development process.
Changelog entry included in pull request, when necessary

### Travis

Work in progress.
Still have to manually trigger fastlane when wanting to get a new release.
Still a developer's responsibility, forcing to stop any other task and run the process locally
With Travis we are hoping to allow the QA team to get a fresh release just by creating a tag on master, not requiring any dev time.

### Web

Maybe mention how we set up travis for multiple language jobs, i.e. node (web), java (android) and objective-c (ios)

## More on fastlane

Ensure things are always up to date by running pod install, npx jetify, ...
Just update the version in package.json, and a lane will handle bumping the version for the xcode project and keep things up to date
Build android bundle automatically (when generating the production release .apk)
Automate uploading to app store connect and play console (in progress)

## Conclusion

Worth taking the time to configure the project correctly early on to assist build automation.
Documentation is still lacking
Impact for our team
For the first time, 0 bug releases consistently due to almost daily builds for QA.
Saving devs tons of time and frustration
Easy to onboard new users
