# Norigin Spatial Navigation
Norigin Spatial Navigation is an open-source library that enables navigating between focusable elements built with [ReactJS](https://reactjs.org/) based application software.
To be used while developing applications that require key navigation (directional navigation) on Web-browser Apps and other Browser based Smart TVs and Connected TVs.
Our goal is to make navigation on websites & apps easy, using React Javascript Framework and React Hooks.
Navigation can be controlled by your keyboard (browsers) or Remote Controls (Smart TV or Connected TV).
Software developers only need to initialise the service, add the Hook to components that are meant to be focusable and set the initial focus.
The Spatial Navigation library will automatically determine which components to focus next while navigating with the directional keys. We keep the library light, simple, and with minimal third-party dependencies.

[![npm version](https://badge.fury.io/js/%40noriginmedia%2Fnorigin-spatial-navigation.svg)](https://badge.fury.io/js/%40noriginmedia%2Fnorigin-spatial-navigation)

# Illustrative Demo
Norigin Spatial Navigation can be used while working with Key Navigation and React JS.
This library allows you to navigate across or focus on all navigable components while browsing.
For example: hyperlinks, buttons, menu items or any interactible part of the User Interface according to the spatial location on the screen.

![Example](norigin-spatial-navigation.gif)

[Example Source](https://github.com/NoriginMedia/Norigin-Spatial-Navigation/blob/master/src/App.tsx)

# Supported Devices
The Norigin Spatial Navigation library is theoretically intended to work on any web-based platform such as Browsers and Smart TVs.
For as long as the UI/UX is built with the React Framework, it works on the Samsung Tizen TVs, LG WebOS TVs, Hisense Vidaa TVs and a range of other Connected TVs.
It can also be used in React Native apps on Android TV and Apple TV, however functionality will be limited.
This library is actively used and continuously tested on many devices and updated periodically in the table below:

| Platform | Name |
|---|---|
| Web Browsers | Chrome, Firefox, etc. |
| Smart TVs | [Samsung Tizen](https://developer.tizen.org/?langswitch=en), [LG WebOS](https://webostv.developer.lge.com/), Hisense |
| Other Connected TV devices | Browser Based settop boxes with Chromium, Ekioh or Webkit browsers |
| AndroidTV, AppleTV | Only [React Native](https://reactnative.dev/docs/building-for-tv) apps, limited functionality |

# Related Blogs
1. Use & benefits of using the Norigin Spatial Navigation library on Smart TVs [here](https://medium.com/p/77ed944d7be7).

# Changelog
A list of changes for all the versions for the Norigin Spatial Navigation:
[CHANGELOG.md](https://github.com/NoriginMedia/Norigin-Spatial-Navigation/blob/master/CHANGELOG.md)

# Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [Technical details and concepts](#technical-details-and-concepts)
* [Migration from v2](#migration-from-v2-hoc-based-to-v3-hook-based)

# Installation
```bash
npm i @noriginmedia/norigin-spatial-navigation --save
```

# Usage
## Initialization
[Init options](#init-options)
```jsx
// Called once somewhere in the root of the app

import { init } from '@noriginmedia/norigin-spatial-navigation';

init({
  // options
});
```

## Making your component focusable
Most commonly you will have Leaf Focusable components. (See [Tree Hierarchy](#tree-hierarchy-of-focusable-components))
Leaf component is the one that doesn't have focusable children.
`ref` is required to link the DOM element with the hook. (to measure its coordinates, size etc.)

```jsx
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

function Button() {
  const { ref, focused } = useFocusable();

  return (<div ref={ref} className={focused ? 'button-focused' : 'button'}>
    Press me
  </div>);
}
```

## Wrapping Leaf components with a Focusable Container
Focusable Container is the one that has other focusable children. (i.e. a scrollable list) (See [Tree Hierarchy](#tree-hierarchy-of-focusable-components))
`ref` is required to link the DOM element with the hook. (to measure its coordinates, size etc.)
`FocusContext.Provider` is required in order to provide all children components with the `focusKey` of the Container,
which serves as a Parent Focus Key for them. This way your focusable children components can be deep in the DOM tree
while still being able to know who is their Focusable Parent.
Focusable Container cannot have `focused` state, but instead propagates focus down to appropriate Child component.
You can nest multiple Focusable Containers. When focusing the top level Container, it will propagate focus down until it encounters the first Leaf component.
I.e. if you set focus to the `Page`, the focus could propagate as following: `Page` -> `ContentWrapper` -> `ContentList` -> `ListItem`.

```jsx
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import ListItem from './ListItem';

function ContentList() {
  const { ref, focusKey } = useFocusable();

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref}>
      <ListItem />
      <ListItem />
      <ListItem />
    </div>
  </FocusContext.Provider>);
}
```

## Manually setting the focus
You can manually set the focus either to the current component (`focusSelf`), or to any other component providing its `focusKey` to `setFocus`.
It is useful when you first open the page, or i.e. when your modal Popup gets mounted.

```jsx
import React, { useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';

function Popup() {
  const { ref, focusKey, focusSelf, setFocus } = useFocusable();

  // Focusing self will focus the Popup, which will pass the focus down to the first Child (ButtonPrimary)
  // Alternatively you can manually focus any other component by its 'focusKey'
  useEffect(() => {
    focusSelf();

    // alternatively
    // setFocus('BUTTON_PRIMARY');
  }, [focusSelf]);

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref}>
      <ButtonPrimary focusKey={'BUTTON_PRIMARY'} />
      <ButtonSecondary />
    </div>
  </FocusContext.Provider>);
}
```

## Tracking children components
Any Focusable Container can track whether it has any Child focused or not. This feature is disabled by default,
but it can be controlled by the `trackChildren` flag passed to the `useFocusable` hook. When enabled, the hook will return
a `hasFocusedChild` flag indicating when a Container component is having focused Child down in the focusable Tree.
It is useful for example when you want to style a container differently based on whether it has focused Child or not.

```jsx
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import MenuItem from './MenuItem';

function Menu() {
  const { ref, focusKey, hasFocusedChild } = useFocusable({trackChildren: true});

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref} className={hasFocusedChild ? 'menu-expanded' : 'menu-collapsed'}>
      <MenuItem />
      <MenuItem />
      <MenuItem />
    </div>
  </FocusContext.Provider>);
}
```

## Restricting focus to a certain component boundaries
Sometimes you don't want the focus to leave your component, for example when displaying a Popup, you don't want the focus to go to
a component underneath the Popup. This can be enabled with `isFocusBoundary` flag passed to the `useFocusable` hook.

```jsx
import React, { useEffect } from 'react';
import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation';

function Popup() {
  const { ref, focusKey, focusSelf } = useFocusable({isFocusBoundary: true});

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (<FocusContext.Provider value={focusKey}>
    <div ref={ref}>
      <ButtonPrimary />
      <ButtonSecondary />
    </div>
  </FocusContext.Provider>);
}
```

## Using the library in React Native environment
In React Native environment the navigation between focusable (Touchable) components is happening under the hood by the
native focusable engine. This library is NOT doing any coordinates measurements or navigation decisions in the native environment.
But it can still be used to keep the currently focused element node reference and its focused state, which can be used to
highlight components based on the `focused` or `hasFocusedChild` flags.
IMPORTANT: in order to "sync" the focus events coming from the native focus engine to the hook, you have to link
`onFocus` callback with the `focusSelf` method. This way, the hook will know that the component became focused, and will
set the `focused` flag accordingly.

```jsx
import { TouchableOpacity, Text } from 'react-native';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

function Button() {
  const { ref, focused, focusSelf } = useFocusable();

  return (<TouchableOpacity
    ref={ref}
    onFocus={focusSelf}
    style={focused ? styles.buttonFocused : styles.button}
  >
    <Text>Press me</Text>
  </TouchableOpacity>);
}
```

# API
## Top Level exports
### `init`
#### Init options
##### `debug`: boolean (default: false)
Enables console debugging.

##### `visualDebug`: boolean (default: false)
Enables visual debugging (all layouts, reference points and siblings reference points are printed on canvases).

##### `nativeMode`: boolean (default: false)
Enables Native mode. It will **disable** certain web-only functionality:
- adding window key listeners
- measuring DOM layout
- `onFocus` and `onBlur` callbacks don't return coordinates, but still return node ref which can be used to measure layout if needed
- coordinates calculations when navigating (`smartNavigate` in `SpatialNavigation.ts`)
- `navigateByDirection`
- focus propagation down the Tree
- last focused child feature
- preferred focus key feature

In other words, in the Native mode this library **DOES NOT** set the native focus anywhere via the native focus engine.
Native mode should be only used to keep the Tree of focusable components and to set the `focused` and `hasFocusedChild` flags to enable styling for focused components and containers.
In Native mode you can only call `focusSelf` in the component that gets **native** focus (via `onFocus` callback of the `Touchable` components) to flag it as `focused`.
Manual `setFocus` method is blocked because it will not propagate to the native focus engine and won't do anything.

##### `throttle`: integer (default: 0)
Enables throttling of the key event listener.

##### `throttleKeypresses`: boolean (default: false)
Works only in combination with `throttle` > 0. By default, `throttle` only throttles key down events (i.e. when you press and hold the button).
When this feature is enabled, it will also throttle rapidly fired key presses (rapid "key down + key up" events).

### `setKeyMap`
Method to set custom key codes. I.e. when the device key codes differ from a standard browser arrow key codes.
```jsx
setKeyMap({
  'left': 9001,
  'up': 9002,
  'right': 9003,
  'down': 9004,
  'enter': 9005
});
```

### `destroy`
Resets all the settings and the storage of focusable components. Disables the navigation service.

### `useFocusable` hook
This hook is the main link between the React component (its DOM element) and the navigation service.
It is used to register the component in the service, get its `focusKey`, `focused` state etc.

```jsx
const {/* hook output */ } = useFocusable({/* hook params */ });
```

#### Hook params

##### `focusable` (default: true)
This flag indicates that the component can be focused via directional navigation.
Even if the component is not `focusable`, it still can be focused with the manual `setFocus`.
This flag is useful when i.e. you have a Disabled Button that should not be focusable in the disabled state.

##### `saveLastFocusedChild` (default: true)
By default, when the focus leaves a Focusable Container, the last focused child of that container is saved.
So the next time when you go back to that Container, the last focused child will get the focus.
If this feature is disabled, the focus will be always on the first available child of the Container.

##### `trackChildren` (default: false)
This flag controls the feature of updating the `hasFocusedChild` flag returned to the hook output.
Since you don't always need `hasFocusedChild` value, this feature is disabled by default for optimization purposes.

##### `autoRestoreFocus` (default: true)
By default, when the currently focused component is unmounted (deleted), navigation service will try to restore the focus
on the nearest available sibling of that component. If this behavior is undesirable, you can disable it by setting this
flag to `false`.

##### `isFocusBoundary` (default: false)
This flag makes the Focusable Container keep the focus inside its boundaries. It will only block the focus from leaving
the Container via directional navigation. You can still set the focus manually anywhere via `setFocus`.
Useful when i.e. you have a modal Popup and you don't want the focus to leave it.

##### `focusKey` (optional)
If you want your component to have a persistent focus key, it can be set via this property. Otherwise, it will be auto generated.
Useful when you want to manually set the focus to this component via `setFocus`.

##### `preferredChildFocusKey` (optional)
Useful when you have a Focusable Container and you want it to propagate the focus to a **specific** child component.
I.e. when you have a Popup and you want some specific button to be focused instead of the first available.

##### `onEnterPress` (function)
Callback that is called when the component is focused and Enter key is pressed.
Receives `extraProps` (see below) and `KeyPressDetails` as arguments.

##### `onEnterRelease` (function)
Callback that is called when the component is focused and Enter key is released.
Receives `extraProps` (see below) as argument.

##### `onArrowPress` (function)
Callback that is called when component is focused and any Arrow key is pressed.
Receives `direction` (`left`, `right`, `up`, `down`), `extraProps` (see below) and `KeyPressDetails` as arguments.
This callback HAS to return `true` if you want to proceed with the default directional navigation behavior, or `false`
if you want to block the navigation in the specified direction.

##### `onFocus` (function)
Callback that is called when component gets focus.
Receives `FocusableComponentLayout`, `extraProps` and `FocusDetails` as arguments.

##### `onBlur` (function)
Callback that is called when component loses focus.
Receives `FocusableComponentLayout`, `extraProps` and `FocusDetails` as arguments.

##### `extraProps` (optional)
An object that can be passed to the hook in order to be passed back to certain callbacks (see above).
I.e. you can pass all the `props` of the component here, and get them all back in those callbacks.

#### Hook output

##### `ref` (**required**)
Reference object created by the `useRef` inside the hook. Should be assigned to the DOM element representing a focused
area for this component. Usually it's a root DOM element of the component.

```jsx
function Button() {
  const { ref } = useFocusable();

  return (<div ref={ref}>
    Press me
  </div>);
}
```

##### `focusSelf` (function)
Method to set the focus on the current component. I.e. to set the focus to the Page (Container) when it is mounted, or
the Popup component when it is displayed.

##### `setFocus` (function) `(focusKey: string) => void`
Method to manually set the focus to a component providing its `focusKey`.

##### `focused` (boolean)
Flag that indicates that the current component is focused.

##### `hasFocusedChild` (boolean)
Flag that indicates that the current component has a focused child somewhere down the Focusable Tree.
Only works when `trackChildren` is enabled!

##### `focusKey` (string)
String that contains the focus key for the component. It is either the same as `focusKey` passed to the hook params,
or an automatically generated one.

##### `navigateByDirection` (function) `(direction: string, focusDetails: FocusDetails) => void`
Method to manually navigation to a certain direction. I.e. you can assign a mouse-wheel to navigate Up and Down.
Also useful when you have some "Arrow-like" UI in the app that is meant to navigate in certain direction when pressed
with the mouse or a "magic remote" on some TVs.

##### `pause` (function)
Pauses all the key event handlers.

##### `resume` (function)
Resumes all the key event handlers.

##### `updateAllLayouts` (function)
Manually recalculate all the layouts. Rarely used.

### `FocusContext` (required for Focusable Containers)
Used to provide the `focusKey` of the current Focusable Container down the Tree to the next child level. [See Example](#wrapping-leaf-components-with-a-focusable-container)

## Types exported for development
### `FocusableComponentLayout`
```ts
interface FocusableComponentLayout {
  left: number; // absolute coordinate on the screen
  top: number; // absolute coordinate on the screen
  width: number;
  height: number;
  x: number; // relative to the parent DOM element
  y: number; // relative to the parent DOM element
  node: HTMLElement; // or the reference to the native component in React Native
}
```

### `KeyPressDetails`
```ts
interface KeyPressDetails {
  pressedKeys: PressedKeys;
}
```

### `PressedKeys`
```ts
type PressedKeys = { [index: string]: number };
```

### `FocusDetails`
```ts
interface FocusDetails {
  event?: KeyboardEvent;
}
```

## Other Types exported
These types are exported, but not necessarily needed for development.

### `KeyMap`
Interface for the `keyMap` sent to the `setKeyMap` method.

### `UseFocusableConfig`
Interface for the `useFocusable` params object.

### `UseFocusableResult`
Interface for the `useFocusable` result object.

# Technical details and concepts
## Tree Hierarchy of focusable components
As mentioned in the [Usage](#usage) section, all focusable components are organized in a Tree structure. Much like a DOM
tree, the Focusable Tree represents a focusable components' organization in your application. Tree Structure helps to
organize all the focusable areas in the application, measure them and determine the best paths of navigation between
these focusable areas. Without the Tree Structure (assuming all components would be simple Leaf focusable components) it
would be extremely hard to measure relative and absolute coordinates of the elements inside the scrolling lists, as well
as to restrict the focus from jumping outside certain areas. Technically the Focusable Tree structure is achieved by
passing a focus key of the parent component down via the `FocusContext`. Since React Context can be nested, you can have
multiple layers of focusable Containers, each passing their own `focusKey` down the Tree via `FocusContext.Provider` as
shown in [this example](#wrapping-leaf-components-with-a-focusable-container).

## Navigation Service
[Navigation Service](https://github.com/NoriginMedia/Norigin-Spatial-Navigation/blob/master/src/SpatialNavigation.ts) is a
"brain" of the library. It is responsible for registering each focusable component in its internal database, storing
the node references to measure their coordinates and sizes, and listening to the key press events in order to perform
the navigation between these components. The calculation is performed according to the proprietary algorithm, which
measures the coordinate of the current component and all components in the direction of the navigation, and determines the
best path to pass the focus to the next component.

# Migration from v2 (HOC based) to v3 (Hook based)
## Reasons
The main reason to ~~finally~~ migrate to Hooks is the deprecation of the `recompose` library that was a backbone for the old
HOC implementation. As well as the deprecation of the `findDOMNode` API. It's been quite a while since Hooks were first
introduced in React, but we were hesitating of migrating to Hooks since it would make the library usage a bit more verbose.
However, recently there has been even more security reasons to migrate away from `recompose`, so we decided that it is time
to say goodbye to HOC and accept certain drawbacks of the Hook implementation.
Here are some of the challenges encountered during the migration process:

### Getting node reference
HOC implementation used a `findDOMNode` API to find a reference to a current DOM element wrapped with the HOC:
```js
const node = SpatialNavigation.isNativeMode() ? this : findDOMNode(this);
```
Note that `this` was pointing to an actual component instance even when it was called inside `lifecycle` HOC from `recompose`
allowing to always find the top-level DOM element, without any additional code required to point to a specific DOM node.
It was a nice "magic" side effect of the HOC implementation, which is now getting deprecated.

In the new Hook implementation we are using the recommended `ref` API. It makes a usage of the library a bit more verbose
since now you always have to specify which DOM element is considered a "focusable" area, because this reference is used
by the library to calculate the node's coordinates and size. [Example above](#ref-required)

### Passing `parentFocusKey` down the tree
Another big challenge was to find a good way of passing the `parentFocusKey` down the Focusable Tree, so every focusable
child component would always know its parent component key, in order to enable certain "tree-based" features described [here](#tree-hierarchy-of-focusable-components).
In the old HOC implementation it was achieved via a combination of `getContext` and `withContext` HOCs. Former one was
receiving the `parentFocusKey` from its parent no matter how deep it was in the component tree, and the latter one was
providing its own `focusKey` as `parentFocusKey` for its children components.

In modern React, the only recommended Context API is using Context Providers and Consumers (or `useContext` hook).
While you can easily receive the Context value via `useContext`, the only way to provide the Context down the tree is via
a JSX component `Context.Provider`. This requires some additional code in case you have a Focusable Container component.
In order to provide the `parentFocusKey` down the tree, you have to wrap your children components with a `FocusContext.Provider`
and provide a current `focusKey` as the context value. [Example here](#wrapping-leaf-components-with-a-focusable-container)

## Examples
### Migrating a [leaf](#making-your-component-focusable) focusable component
#### HOC Props and Config vs Hook Params
```jsx
import {withFocusable} from '@noriginmedia/norigin-spatial-navigation';

// Component ...

const FocusableComponent = withFocusable({
  trackChildren: true,
  forgetLastFocusedChild: true
})(Component);

const ParentComponent = (props) => (<View>
  ...
  <FocusableComponent
    trackChildren
    forgetLastFocusedChild
    focusKey={'FOCUSABLE_COMPONENT'}
    onEnterPress={props.onItemPress}
    autoRestoreFocus={false}
  />
  ...
</View>);
```

Please note that **most** of the features/props could have been passed as either direct JSX `props` to the Focusable Component
or as an config object passed to the `withFocusable` HOC. It provided certain level of flexibility, while also adding some
confusion as to what takes priority if you pass the same option to both the `prop` and a HOC config.

In the new Hook implementation options can only be passed as a [Hook Params](#hook-params):

```jsx
const {/* hook output */ } = useFocusable({
  trackChildren: true,
  saveLastFocusedChild: false,
  onEnterPress: () => {},
  focusKey: 'FOCUSABLE_COMPONENT'
});
```

#### HOC props passed to the wrapped component vs Hook output values
HOC was enhancing the wrapped component with certain new `props` such as `focused` etc.:
```jsx
import {withFocusable} from '@noriginmedia/norigin-spatial-navigation';

const Component = ({focused}) => (<View>
  <View style={focused ? styles.focusedStyle : styles.defaultStyle} />
</View>);

const FocusableComponent = withFocusable()(Component);
```

Hook will provide all these values as the return object of the hook:

```jsx
const { focused, focusSelf, ref, ...etc } = useFocusable({/* hook params */ });
```

The only additional step when migrating from HOC to Hook (apart from changing `withFocusable` to `useFocusable` implementation)
is to link the DOM element with the `ref` from the Hook as seen in this [example](#making-your-component-focusable).
While it requires a bit of extra code compared to the HOC version, it also provides a certain level of flexibility if
you want to make only a certain part of your UI component to act as a "focusable" area.

Please also note that some params and output values has been renamed. [CHANGELOG](#changelog)

### Migrating a [container](#wrapping-leaf-components-with-a-focusable-container) focusable component
In the old HOC implementation there was no additional requirements for the Focusable Container to provide its own `focusKey`
down the Tree as a `parentFocusKey` for its children components.
In the Hook implementation it is required to wrap your children components with a `FocusContext.Provider` as seen in
this [example](#wrapping-leaf-components-with-a-focusable-container).

# Development
```bash
npm i
npm start
```

# Contributing
Please follow the [Contribution Guide](https://github.com/NoriginMedia/Norigin-Spatial-Navigation/blob/master/CONTRIBUTING.md)

# License
**MIT Licensed**
