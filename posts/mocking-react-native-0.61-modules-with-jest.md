---
title: "Mocking React Native 0.61 modules with Jest"
date: "2020-01-25T14:00:50+0200"
categories: ["Testing", "React Native", "Mobile"]
banner: "rn-jest.png"
color: "#222222"
description: "React Native 0.61 removed Haste and broke a lot of Jest mocks. Why it happened and how I fixed it."
readingTimeMinutes: 6
---

**TL;DR**: React Native 0.61 removed Haste, which broke a lot of Jest mocks. Here's why filename-based mocks stopped working and how I mocked react-native modules instead.

## Why mocks broke in React Native 0.61

A few months after [React Native 0.61](https://facebook.github.io/react-native/blog/2019/09/18/version-0.61) came out, I tried to run our tests and they failed.

Before 0.61, React Native used Haste to map module files by filename, so you could mock a module by its name:

```js
jest.mock("Button", () => {});
```

React Native 0.61 dropped Haste, so those mocks stopped working and we got errors like:

> **Cannot find module 'Button'**

## Two ways to mock modules

The React team recommends [two approaches](https://github.com/facebook/react-native/issues/26579#issuecomment-535244001).

**1. Specify the full path:**

```js
jest.mock("react-native/Libraries/Components/Button", () => {});
```

This works for single modules, but the tests then depend on internal paths that can change between versions. I also couldn't get it to work in every case.

**2. Mock the react-native interface**

You [mock react-native](https://github.com/facebook/react-native/issues/26579#issuecomment-538610849) itself in your `setup.js`:

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

## What worked

I mocked react-native manually in a `tests/__mocks__/react-native.js` file:

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

I also needed to test platform-specific code for iOS, Android and web.

Before 0.61 we'd been using this:

```js
export const mockPlatform = (OS) => {
  jest.resetModules();
  jest.doMock("Platform", () => ({ OS, select: (objs) => objs[OS] }));
};
```

This also stopped working after 0.61. Instead, I set `Platform.OS` directly in the test:

```js
import { Platform } from "react-native";

it("renders Element if Android", () => {
  Platform.OS = "android";
  renderIfAndroid();
  expect(wrapper.find(Element).exists()).toBe(true);
});
```

With this setup we could mock everything we needed and finish the 0.61 upgrade.

I also gave two talks on React Native in production:

- [React Conf 2019](/blog/posts/react-conf-2019)
- [JS VidCon 2020](/blog/posts/jsvidcon-2020)
