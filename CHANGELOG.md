# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [2.1.0]
## Added
- new `init` config option `shouldUseNativeEvents` that enables the use of native events for triggering actions, such as clicks or key presses.
- new `init` config option `rtl` that changes focus behavior for layouts in right-to-left (RTL) languages such as Arabic and Hebrew. 

# [2.0.2]
## Added
- Console warning when passing an empty `ref` to `useFocusable`
- Support for string names for Key Events. Now you can configure the key map with numbers or event names like `ArrowRight`.

# [2.0.1]
## Fixed
- Restoring focus to the parent with `preferredChildFocusKey` set

# [2.0.0]
## Added
- New property for `useFocusable` - `focusBoundaryDirections`, array of directions to block when `isFocusBoundary` is enabled
- New property `useFocusable` - `forceFocus` to mark the component to be the target for auto-restore focus logic when focus is lost
- New global method `doesFocusableExist` to check if the focusable component exists before setting focus on it. Safety feature

## Changed
- [BREAKING] Top level exports `setFocus, getCurrentFocusKey, navigateByDirection, pause, resume, updateAllLayouts` are now exported from `SpatialNavigation` instead of `useFocusable` hook.

## Fixed
- Context display name is now called `FocusContext` in React Devtools
- Updating `lastFocusedChildKey` for newly added parent components

# [1.3.3]
## Fixed
- Fixed the issue where component would have kept itself in the array of `parentsHavingFocusedChild` array after removal
- Further improvements to `autoRestoreFocus` logic to trigger not only on Lead components, but also on Parents that had focused child when being removed. Edge case, normally children are removed first.

# [1.3.2]
## Fixed
- Fixed a bug where parents were not updating their `hasFocusedChild` when new child is created and focused right away
- Fixed a bug where `lastFocusedChild` was updated only on blur, but not on manual focus, resulting in a wrong key being stored

## Changed
- Renamed `useFocusedContext` file to `useFocusContext` to match the export name

# [1.3.1]
## Added
- Extra debug logs, printing focusable components data in addition to DOM nodes.
- Extra call to set `focused` state to `false` on unmount. This is to support "double-mount" in Strict mode in React 18.

## Changed
- [Potentially Breaking] Auto restore focus when the item is removed is now happening with a slight debounced delay.

## Removed
- Custom `useEffectOnce` hook that introduced issues with unmounted components being remained as focusable.

# [1.3.0]
## Added
- new `init` config option `shouldFocusDOMNode` that focuses the underlying _accessible_ DOM node too.

# [1.2.0]
## Added
- new `init` config option `useGetBoundingClientRect` that affects the measurements of sizes and coordinates.

# [1.1.5]
## Added
- Add `setThrottle` to dynamically change throttle time.

## Changed
- Remove event listeners for `unbindEventHandlers` regardless of throttle value

# [1.1.4]
## Changed
- Update `parentFocusKey` when `removeFocusable`
- Fix issue with `destroy` (added `bind`)

# [1.1.3]
## Changed
- `Reflect.deleteProperty` was replaced by `delete` to be es5 compliant.

# [1.1.2]
## Added
- Param `focusDetails` in `focusSelf` and `setFocus` methods.

# [1.1.1]
## Changed
- Output bundle is now targeting ES5.

# [1.1.0]
## Added
- Support for React v18 StrictMode. Added `useEffectOnce` to avoid multiple effect runs on mount that was breaking the
generation of the `focusKey`s.

## Fixed
- Few TS errors that somehow not being checked when the app is built and published ¯\_(ツ)_/¯.

# [1.0.6]
## Added
- Function (`getCurrentFocusKey`) for retrieving the currently focused component's focus key
- Support for passing multiple key codes per direction in `setKeyMap`

# [1.0.5]
## Added
- Added generic P type for the props passed to `useFocusable` hook that is available in all callbacks that bounce props back.

## Changed
- Changed all `lodash` imports to cherry-picked ones to avoid the whole `lodash` lib to be bundled in the project.

# [1.0.4]
## Added
- Eslint dependencies required by `eslint-config-airbnb`

## Fixed
- Fixed issue in Node environment - Webpack global object is now `this` instead of `self`

# [1.0.3]
## Added
- Added focusable component callbacks to the effect that updates them in `SpatialNavigation` service. Otherwise only
the first closure is assigned to the service and is always called with the initial props.

# [1.0.2]
## Changed
- Changed `measureLayout` back to calculate coords based on `offsetTop/Left/Width/Height` instead of `getClientBoundRect`.
The reason is that `getClientBoundRect` is less performant and calculates coordinates AFTER all the CSS transformations,
which is undesirable for scaled or transformed elements.

# [1.0.1]
## Changed
- Updated Github path in `package.json`

# [1.0.0]
## Changed
- Migrated the old [HOC library](https://github.com/NoriginMedia/react-spatial-navigation) to Hooks.
