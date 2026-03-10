---
sidebar_position: 8
---

# Distance Calculation Algorithm

The spatial navigation algorithm determines which focusable component to move to next by calculating a weighted distance score for every candidate in the pressed direction. The candidate with the lowest score wins.

## How the Algorithm Works

When the user presses an arrow key:

1. **Determine direction** — The library identifies the axis (horizontal for left/right, vertical for up/down) and whether the direction is incremental (right, down) or decremental (left, up).

2. **Find candidates** — All registered components whose leading edge is beyond the trailing edge of the current component in the pressed direction.

3. **Adjacent slice detection** — For each candidate, the library checks whether it overlaps significantly with the current component along the perpendicular axis. A candidate that overlaps is called "adjacent". Adjacent candidates are strongly preferred (they receive a 5× lower weight on secondary distance).

4. **Score calculation** — Each candidate receives a score:

   ```
   score = (primaryDistance × 5) + (secondaryDistance × weight)

   where weight = 1 for diagonal candidates, 0.2 for adjacent candidates
   ```

5. **Selection** — The candidate with the lowest score is focused next.

This algorithm is inspired by the spatial navigation model developed for TV browser implementations.

---

## `distanceCalculationMethod`

The `distanceCalculationMethod` option in `init()` controls how the reference points are chosen when measuring distances.

### `'corners'` (default)

Uses two corners of the current component (the corners closest to the direction of travel) as the reference points.

- **Best for:** Grids and rows with uniform-size items.
- **Behavior:** Most precise directional matching; avoids jumping over items.

```typescript
init({ distanceCalculationMethod: 'corners' });
```

### `'edges'`

Uses the full edge of the current component (the entire side in the direction of travel) as the reference.

- **Best for:** Lists with items of varying heights or widths.
- **Behavior:** More forgiving; easier to navigate between items that don't perfectly align.

```typescript
init({ distanceCalculationMethod: 'edges' });
```

### `'center'`

Uses the center point of the current component as the reference.

- **Best for:** Sparse layouts where items are spread far apart.
- **Behavior:** Least precise directional matching; prefers the geometrically nearest center.

```typescript
init({ distanceCalculationMethod: 'center' });
```

### Choosing a Method

| Layout type                             | Recommended method                              |
| --------------------------------------- | ----------------------------------------------- |
| Uniform grid (all items same size)      | `'corners'`                                     |
| Horizontal rows with varying card sizes | `'edges'`                                       |
| Sparse, scattered layout                | `'center'`                                      |
| Mixed or complex layout                 | Try each and use `visualDebug: true` to inspect |

---

## `customDistanceCalculationFunction`

Override the secondary-axis distance calculation with your own logic. This function is called for every candidate and replaces the built-in secondary distance calculation.

```typescript
type CustomDistanceCalculationFunction = (
  refCorners: Corners,
  siblingCorners: Corners,
  isVerticalDirection: boolean,
  distanceCalculationMethod: string
) => number;
```

### `Corners` type

```typescript
interface Corners {
  nearPlumbLinePoint: { x: number; y: number };
  farPlumbLinePoint: { x: number; y: number };
  nearStraightLinePoint: { x: number; y: number };
  farStraightLinePoint: { x: number; y: number };
}
```

### Example: Bias toward items closer to the vertical center

```typescript
init({
  distanceCalculationMethod: 'corners',
  customDistanceCalculationFunction: (
    refCorners,
    siblingCorners,
    isVerticalDirection
  ) => {
    // Use the midpoint of each component
    const refMidX =
      (refCorners.nearPlumbLinePoint.x + refCorners.farPlumbLinePoint.x) / 2;
    const sibMidX =
      (siblingCorners.nearPlumbLinePoint.x +
        siblingCorners.farPlumbLinePoint.x) /
      2;
    const refMidY =
      (refCorners.nearStraightLinePoint.y + refCorners.farStraightLinePoint.y) /
      2;
    const sibMidY =
      (siblingCorners.nearStraightLinePoint.y +
        siblingCorners.farStraightLinePoint.y) /
      2;

    if (isVerticalDirection) {
      return Math.abs(refMidX - sibMidX);
    }
    return Math.abs(refMidY - sibMidY);
  }
});
```

The function overrides only the secondary-axis distance. The primary-axis distance (along the direction of travel) is always calculated by the library.

---

## Debugging Navigation Decisions

Enable `visualDebug: true` to see a canvas overlay that shows:

- Bounding boxes of all registered components
- The direction lines from the currently focused component
- Which component was selected and why

```typescript
init({
  debug: true,
  visualDebug: true,
  distanceCalculationMethod: 'corners'
});
```

This makes it easy to understand why a particular element wins or loses the distance calculation. See [Debugging](./debugging.md) for more.
