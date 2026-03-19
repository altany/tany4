---
title: "Mocking React Native 0.61 modules with Jest"
date: "2020-01-25T14:00:50+0200"
categories: ["Testing", "React Native"]
banner: "rn-jest.png"
color: "#222222"
description: "React Native 0.61 removed Haste and broke a lot of Jest mocks. Here's why it happened and how to fix it properly."
readingTimeMinutes: 6
---

**TL;DR**: React Native 0.61 removed Haste, which broke a lot of Jest mocks. This post explains why filename-based mocks stopped working and shows a more robust way to mock react-native modules.

## Why mocks broke in React Native 0.61

A few months after [React Native 0.61](https://facebook.github.io/react-native/blog/2019/09/18/version-0.61) came out, I tried to run our tests. They didn't work.

Before 0.61, React Native used Haste to map module files by filename. This made mocking simple:

```js
jest.mock("Button", () => {});
```

React Native 0.61 dropped Haste. That meant filename-based mocks stopped working entirely, and we started seeing errors like:

> **Cannot find module 'Button'**

## Two ways to mock modules

The React team recommends[two approaches](https://github.com/facebook/react-native/issues/26579#issuecomment-535244001).

**1. Specify the full path:**

```js
jest.mock("react-native/Libraries/Components/Button", () => {});
```

This works for individual modules, but it's brittle - it couples your tests to internal paths that can change between versions. I also couldn't get it to work reliably across all cases.

**2. Mock the react-native interface**

This is more robust. The idea is to [mock react-native](https://github.com/facebook/react-native/issues/26579#issuecomment-538610849) itself in your `setup.js`:

```js
import * as ReactNative from "react-native";

jest.doMock("react-native", () => {
  return Object.setPrototypeOf(
    {
      Button: "Button",
      LayoutAnimation: {
        ...ReactNative.LayoutAnimation,
        configureNext: jest.fn(),
      },
      Platform: {
        ...ReactNative.Platform,
        OS: "ios",
        Version: 123,
        isTesting: true,
        select: (objs) => objs["ios"],
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        Override: { great: "success" },
      },
    },
    ReactNative
  );
});
```

I had issues with this approach too. When I tried to access `Platform.OS` I'd get:

> **Couldn't read OS of undefined**

## What actually worked

What worked for me was mocking react-native manually inside a `tests/__mocks__/react-native.js` file:

```js
import * as ReactNative from "react-native";

export const alert = jest.fn();
export const Alert = { alert };

export const dimensionWidth = 100;
export const Dimensions = {
  get: jest.fn().mockReturnValue({ width: dimensionWidth, height: 100 }),
};

export const Image = "Image";

export const keyboardDismiss = jest.fn();
export const Keyboard = { dismiss: keyboardDismiss };

export const Platform = {
  ...ReactNative.Platform,
  OS: "ios",
  Version: 123,
  isTesting: true,
  select: (objs) => objs["ios"],
};

export default Object.setPrototypeOf(
  { Alert, Dimensions, Image, Keyboard, Platform },
  ReactNative
);
```

I added exports for every react-native module imported in tested files, one by one. For anything that needed a mock function, I exported the mock separately so I could assert on it:

```js
import { alert } from "react-native";

it("showAlert() calls Alert.alert", () => {
  showAlert();
  expect(alert).toHaveBeenCalled();
});
```

## Mocking platform detection

One more problem: I needed to test platform-specific code for iOS, Android, and web.

Before 0.61 we'd been using this:

```js
export const mockPlatform = (OS) => {
  jest.resetModules();
  jest.doMock("Platform", () => ({ OS, select: (objs) => objs[OS] }));
};
```

After 0.61 this also stopped working. The fix turned out to be much simpler: just overwrite `Platform.OS` directly inside the test:

```js
import { Platform } from "react-native";

it("renders Element if Android", () => {
  Platform.OS = "android";
  renderIfAndroid();
  expect(wrapper.find(Element).exists()).toBe(true);
});
```

That's it. With this setup we were finally able to mock everything properly and move forward with the 0.61 upgrade.

## Key takeaways

Haste removal in 0.61 breaks all filename-based Jest mocks. Full module paths work but are brittle. Mocking the react-native interface in `__mocks__` is more robust and easier to maintain. And for platform detection, just overwrite `Platform.OS` directly in the test.

Looking for more on React Native in production? Check out my conference talks:

- [React Conf 2019](/blog/posts/react-conf-2019)
- [JS VidCon 2020](/blog/posts/jsvidcon-2020)
