---
sidebar_position: 1
---

# Core Concepts

## What Is Spatial Navigation?

Traditional web navigation uses a pointer (mouse or touch). Spatial navigation replaces the pointer with directional input — typically arrow keys on a keyboard or the directional pad on a TV remote control. When the user presses an arrow key, the application must decide which element to focus next.

Norigin Spatial Navigation solves this problem automatically. You mark elements as focusable and the library calculates which one to move to based on spatial position on the screen.

## How the Library Determines the Next Focus

When the user presses an arrow key (e.g., right), the library:

1. Reads the screen position and dimensions of every registered focusable component.
2. Filters candidates to those that exist in the pressed direction relative to the currently focused component.
3. Calculates a weighted distance score for each candidate using primary-axis distance (along the direction pressed) and secondary-axis distance (perpendicular to it).
4. Selects the candidate with the lowest total score.

Components that overlap significantly in the perpendicular axis (called "adjacent") are preferred over diagonal ones. See [Distance Calculation](./distance-calculation.md) for the full algorithm.

## Focus Keys

Every focusable component has a unique string identifier called a **focus key**. The library uses focus keys to track which component is currently focused and to allow programmatic focus control.

- If you do not provide a focus key, the library generates one automatically (e.g., `sn:focusable-item-0`).
- You can provide a stable, human-readable key via the `focusKey` option, which makes programmatic focus easier.
- The special constant `ROOT_FOCUS_KEY` (`'SN:ROOT'`) identifies the root of the focus tree.

## Parent-Child Focus Hierarchy

Focusable components form a tree. A container component can be focusable, and its children are nested inside it.

- Children automatically detect their parent through React context (`FocusContext`).
- When focus enters a container, it is routed to the appropriate child.
- Containers can remember which child was last focused (`saveLastFocusedChild`) and restore that child when focus returns.

## Lifecycle of a Focusable Component

1. **Mount** — the component calls `useFocusable`, which registers it with the `SpatialNavigation` service and measures its position on screen.
2. **Focus** — the library calls `onFocus` and updates the `focused` state.
3. **Key press** — while focused, the library routes key events to this component (`onEnterPress`, `onArrowPress`, etc.).
4. **Blur** — when focus moves away, `onBlur` is called and `focused` becomes `false`.
5. **Unmount** — the component is unregistered from the service. If it had focus, the library can automatically restore focus elsewhere (If `autoRestoreFocus` is `true`).
