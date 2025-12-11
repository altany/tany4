---
title: "Mocking React Native 0.61 modules with Jest"
date: "2020-01-25T14:00:50+0200"
categories: ["Testing", "React Native"]
banner: "rn-jest.png"
color: "#222222"
description: "A simple explanation of how to mock React Native 0.61 modules with Jest, why mocks broke after the Haste removal, and how to fix common testing errors."
updated: "2025-01-01T00:00:00+0000"
readingTimeMinutes: 6
---

**TL;DR**: React Native 0.61 removed Haste, which broke many Jest mocks. This post explains why filename-based mocks stopped working and shows how to mock `react-native` modules correctly using `jest.doMock` and a custom interface.

## Why mocks broke in React Native 0.61

A few months ago, Facebook announced the release of [React Native 0.61](https://facebook.github.io/react-native/blog/2019/09/18/version-0.61).

Version 0.61 solved several issues that had blocked my team from upgrading to 0.60 earlier. All seemed to be going well until I tried to run the tests.

Prior to React Native 0.61, Haste was used to map the individual module files. In Haste the mapping is done by filename so it's easy enough to find the corresponding file in the `react-native` repo. To mock a module, we could simply do something like:

```js
jest.mock("Button", () => {});
```

React Native 0.61 dropped support for Haste, which means that these filename-based mocks don't work anymore and we started getting errors such as:

> **Cannot find module 'Button'**

## Two ways to mock modules

The React team recommends [two ways for mocking `react-native` modules](https://github.com/facebook/react-native/issues/26579#issuecomment-535244001):

1.  Specify the full path to the module e.g.
    ```javascript
    jest.mock("react-native/Libraries/Components/Button", () => {});
    ```
2.  Mock out the react-native interface

The first approach is popular, especially when mocking individual modules. However, it's brittle because it couples tests to internal paths. I also wasn't able to make it work reliably.

The second approach is more robust. The suggested implementation is to mock `react-native` inside `setup.js`, [such as](https://github.com/facebook/react-native/issues/26579#issuecomment-538610849):

```js[class="line-numbers"]
import * as ReactNative from "react-native";

jest.doMock("react-native", () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      // Redefine an export, like a component
      Button: "Button",
      // Mock out properties of an already mocked export
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
      // Mock a native module
      NativeModules: {
        ...ReactNative.NativeModules,
        Override: { great: "success" },
      },
    },
    ReactNative
  );
});
```

I had issues when I followed this approach and my tests didn't seem to get mocked properly. For example, when I tried to access the value of `Platform.OS` I would get this error:

> **'Couldn't read OS of undefined'**

## Why approach 2 is better (and what I actually did)

What worked for me in practice was to mock `react-native` manually inside the `tests/__mocks__` folder. I created a `react-native.js` file with this content:

```js[class="line-numbers"]
import * as ReactNative from "react-native";

export const alert = jest.fn();
export const Alert = { alert };

export const dimensionWidth = 100;
export const Dimensions = {
  get: jest.fn().mockReturnValue({ width: dimensionWidth, height: 100 }),
};

export const Image = "Image";

export const keyboardDismiss = jest.fn();
export const Keyboard = {
  dismiss: keyboardDismiss,
};

export const Platform = {
  ...ReactNative.Platform,
  OS: "ios",
  Version: 123,
  isTesting: true,
  select: (objs) => objs["ios"],
};

export default Object.setPrototypeOf(
  {
    Alert,
    Dimensions,
    Image,
    Keyboard,
    Platform,
  },
  ReactNative
);
```

I added exports for all the react-native modules that were imported in tested files, one by one, and was able to get rid off the errors.

Also, I exported mocks of any methods as needed to help me test when they were called.

For example, I can now do:

```js[class="line-numbers"]
import { alert } from "react-native";

it("showAlert() calls Alert.alert", () => {
  showAlert();
  expect(alert).toHaveBeenCalled();
});
```

And it works like a charm!

However, I soon came across another obstacle: I needed to be able to mock platform detection. By default, we mock `Platform.OS` to be `ios`, but not only were there cases where we needed to test scenarios for Android, we are also using React Native for the web. It was really important to be able to test our web app as well.

Before upgrading, we had been using a method that overwrites the OS property of Platform like this:

```js[class="line-numbers"]
export const mockPlatform = (OS) => {
  jest.resetModules();
  jest.doMock("Platform", () => ({ OS, select: (objs) => objs[OS] }));
};
```

And we would call

```javascript
mockPlatform("android");
```

or

```javascript
mockPlatform("web");
```

before the test.

Unfortunately, after upgrading to 0.61, this also stopped working. The solution turned out to be very simple, even simpler than our previous approach.

To change the OS in a test, first we import the module like:

```javascript
import { Platform } from "react-native";
```

and then simply overwrite the platform inside the test

```js[class="line-numbers"]
it('renders Element if Android', () => {
  Platform.OS = 'android'
  renderIfAndroid()
  expect(wrapper.find(Element).exists()).toBe(true)
})
```

Using the above setup, we have finally been able to mock our modules properly and are one step closer to the React Native 0.61 upgrade.

## Key takeaways

- Haste removal in React Native 0.61 breaks filename-based Jest mocks.
- Using full module paths works but is brittle and tightly coupled to internal structure.
- Mocking the `react-native` interface in `setup.js` (or `__mocks__`) is a more robust approach.
- The post includes example mock implementations you can adapt for your own tests.

Looking for more on React Native in production? Check out my conference talks:

- [React Conf 2019](/blog/posts/react-conf-2019)
- [JS VidCon 2020](/blog/posts/jsvidcon-2020)
