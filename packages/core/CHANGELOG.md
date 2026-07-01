# @noriginmedia/norigin-spatial-navigation-core

## 4.0.0

### Major Changes

- 54353b0: - Measure layout methods are now async
  - Deprecated `useGetBoundingClientRect` option in `init` method. Prefer `init({ layoutAdapter: GetBoundingClientRectAdapter })` or keep the flag until you migrate
  - Added `Scheduler` class to manage asynchronous tasks in a strict sequence
  - Export `BaseWebAdapter` and `GetBoundingClientRectAdapter` from `@noriginmedia/norigin-spatial-navigation-core`

### Minor Changes

- 54353b0: - Add NodeTypeOverrides interface to allow node type to be overridden by the adapter

  - Added `ReactNativeLayoutAdapter` for React Native TV support

  **BREAKING CHANGES**

  - Removed `nativeMode` option from `SpatialNavigationServiceOptions`
  - Removed `isNativeMode` method from `SpatialNavigationService`

### Patch Changes

- 54353b0: - Add `nextFocusResolver` to override default behavior

## 3.2.0

### Minor Changes

- a18ed66: Add `focusOnPresetKey` init option (default `true`) to control whether a component is automatically focused when it is added and its focus key was already set as the current focus key (e.g. `setFocus` was called before the component mounted). Set it to `false` to disable this implicit refocus on add.

## 3.1.0

### Minor Changes

- 0a867bd: Add accessibility labels on focusable components.

  Introduces a new optional `onUtterText` callback on `init()` and an `accessibilityLabel` prop on `useFocusable()` (and the underlying `addFocusable` / `updateFocusable` payloads). When focus lands on a focusable component, the library concatenates the labels of all newly-entered parent regions with the leaf node's own label and passes the resulting string to `onUtterText`. Parent region labels are only included when focus enters a region for the first time (similar to how `aria-label` on `role="region"` behaves), so subsequent focus moves within the same parent only utter the leaf label.

  This library does not implement Text-To-Speech itself — it only provides a unified way to declare accessibility labels and wire the callback to the platform's TTS engine, which is particularly useful for cross-platform TV apps where native `aria-*` support is fragmented.

## 3.0.1

### Patch Changes

- 74b4165: - Fixed missing null checks for `getForcedFocusKey` in `smartNavigate` and `setFocus`
- 98bef7c: - Deprecate `nativeMode` option
- ed4186e: - Make `focusDetails` optional in `navigateByDirection`

## 3.0.0

### Major Changes

- 0b853ae: New package distribution structure

### Patch Changes

- 657d1f3: Added ESM bundle
