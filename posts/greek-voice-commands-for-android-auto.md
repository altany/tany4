---
title: "Greek voice commands for Android Auto"
date: "2026-09-01T12:00:00+0000"
categories: ["AI", "Android", "Kotlin"]
banner: "mila.svg"
color: "#0e1a2a"
description: "Google Assistant doesn't understand Greek in the car, so I built a small Android Auto app that does. Notes on matching Greek speech against contacts saved in Greeklish, and why 'κάλεσε' (kalese, \"call\") kept turning into 'θάλασσα' (thalassa, \"sea\")."
readingTimeMinutes: 6
new: true
---

**TL;DR**: I can't speak Greek to my car. Google Assistant and Gemini don't support it in Android Auto, so I can't say a Greek contact name or an address while driving in Greece. I built a small Android Auto app called Mila - μίλα (mila) means "speak" - that listens in Greek and either starts navigation or places a call.

## The problem

Android Auto supports a list of languages for voice commands. Greek isn't on it. In practice that means if I want to navigate somewhere while driving in Greece, I have to type it, or say the address in English and hope Maps understands what I meant. Neither works well when the road is Πανεπιστημίου (Panepistimiou).

Navigating to an address and calling a contact are the two it fails at most often for me, so those are the two things the app does.

## Starting from someone else's work

There's an existing open source app that does roughly this: [aa-speech-to-text](https://gitlab.com/ron.gr/aa-speech-to-text). It's GPL-3.0 and it works.

I built Mila with Claude Code, and the first thing I had it do was clone that repo and read all of it - about 870 lines of Java - before writing any code of our own.

That saved days. It had already worked out the fiddly parts: the exact manifest declarations that make an app appear on the Android Auto launcher, the host validation that lets a sideloaded app be accepted at all, and how to hand off to Maps and the dialer.

I started fresh rather than forking - it's Java against a car app library that has moved on several versions since, and it drives everything from a spoken hot-word where I wanted two buttons on screen. What I took from it is how Android Auto behaves, which is knowledge rather than code.

## Which microphone

The car app library has `CarAudioRecord`, which reads from the car's own microphone. The catch is that it only gives you raw audio. It does no speech-to-text at all. To get Greek text out of it I'd need to send that audio to a cloud service or bundle a speech model in the app. Both were more than I wanted for a personal tool.

The other option is Android's built-in `SpeechRecognizer` running on the phone, which does full Greek recognition through Google's speech service. That's what the reference app uses and what I went with.

**Greek only works with a data connection.** Google ships offline speech models for a long list of languages and Greek isn't one of them - my phone's list of available packs has no Greek entry at all, so the recognizer logs a failure and falls back to the network. There's no setting to change this, and it applies to any app using Android's recognizer. It's fine for me, since Maps needs data anyway.

## Matching Greek names against Greeklish contacts

I say a name in Greek. The contact might be saved as "Γιώργος", "Giorgos" or "Giwrgos" - one name, George, written three ways, because Greeklish has no agreed spelling.

Both sides get reduced to the same simplified Latin form: strip accents and case, then collapse letter combinations into the sound they make, so `ου` becomes u and `μπ` becomes b. Then compare with edit distance, over the whole name and again word by word, so "Ελένη" (Eleni) on its own still matches "Ελένη Βασιλείου".

The wrinkle is that some Greeklish letters are ambiguous and can't be settled in isolation. An `x` is χ in "Xristos" but ξ in "Xenia"; a `b` is μπ in "Babis" but β in "Basilis". So rather than commit to one reading, each ambiguous letter expands into both and the best-scoring combination wins.

If one contact clearly leads, it dials. If several score close together it shows a short list instead of guessing, which matters when three people in your phone are called Δημήτρης (Dimitris).

This is the only part of the app with unit tests. It's the only part where I can be wrong in a way that's hard to notice.

## Deciding when you've stopped talking

Android's recognizer takes settings for how much silence should end a phrase, but they're hints rather than controls - it endpoints on its own judgement, and it's waiting for real silence. A car is never silent. Set them short and it cuts you off mid-address; set them long and it can hold the microphone open to its own sixty-second limit, by which point you've assumed it's broken and said the whole thing again, and both attempts come back merged into one transcript.

So the app ignores them and watches the partial results instead: when about two seconds pass with no new words, that's the end of the sentence. Long enough to survive the pause between a street name and a number, short enough to feel immediate.

## "κάλεσε" (call) kept becoming "θάλασσα" (sea)

I said "κάλεσε το Δημήτρη" (kalese to Dimitri) - call Dimitris. Maps opened and started routing me to a beach bar.

The recognizer had heard "θάλασσα" - thalassa, the sea. The app did exactly what it was told.

Two things were wrong. The first was mine: the app had Navigate selected, and I'd assumed people would tap the right mode before speaking. They don't. The verb already says what you want. So now an opening verb decides the action regardless of which button is selected - κάλεσε, πάρε and τηλεφώνησε all place a call, πήγαινε and πλοήγηση start navigation - and the verb and its article are stripped off before matching, so it searches for "Δημήτρη" (Dimitri) and not the whole sentence.

The second was that "κάλεσε" and "θάλασσα" genuinely sound similar - KA-le-se against THA-la-sa, three syllables, stress on the first, mostly the same vowels - and no amount of code makes Google hear better. But the app was already asking the recognizer for three alternative transcriptions and throwing away all but the first. If the top guess is a beach, the right word is often sitting in guess two or three.

Now all three are used. The action comes from the first alternative that starts with a real command verb, and contact matching scores every alternative and keeps each contact's best result. A name mangled in the top transcription can still be found in another one.

After that it worked: I said the name, and it showed me the three Δημήτρηδες (Dimitrides, the plural of Dimitris) in my phone to choose from.

## Getting it onto a car screen

You can test all of this without a car. Google ships a Desktop Head Unit emulator that shows the car screen in a window on your laptop while the phone does the actual work.

Getting a sideloaded app to appear takes a few steps that aren't obvious. Android Auto has its own developer mode, separate from the phone's - you unlock it by tapping the version number in Android Auto's settings ten times. Then you have to turn on "Unknown sources", because Android Auto hides anything that didn't come from the Play Store. Then start the head unit server from the same menu.

One thing worth knowing if you try this: stop that head unit server before you drive anywhere. Android Auto projects one session at a time, and a server left running keeps the phone busy serving an emulator that isn't there any more.

## Where it is now

The app opens on the car screen, starts listening straight away, and understands Greek. Navigation and calling both work. It's built as a single Kotlin module with no backend, no analytics and no dependencies beyond the Android libraries.

Every version is built by GitHub Actions and attached to a release, signed with the same key as my local builds so updates install over each other. That means I can change something, push a tag, and download the new APK onto my phone from the car park, without a laptop.

Almost all of the work turned out to be the Greek part - matching a name I say against a contact saved in Greeklish, and handling the words the recognizer gets wrong. The rest was ordinary Android work.

What I keep coming back to isn't technical. This was a daily frustration that nobody was going to fix - Greek is too small a market for Google to bother with - and I was able to build my own way around it.

I can talk to my car in Greek now, which is all I wanted.

The repo is on GitHub: [altany/mila](https://github.com/altany/mila).
