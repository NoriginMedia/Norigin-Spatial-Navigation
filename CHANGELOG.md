# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
