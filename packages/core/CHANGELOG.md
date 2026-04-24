# @noriginmedia/norigin-spatial-navigation-core

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
