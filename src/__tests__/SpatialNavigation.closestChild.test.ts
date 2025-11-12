import {
  SpatialNavigation,
  destroy,
  init
} from '../SpatialNavigation';
import {
  createGridLayoutWithClosestChild,
  createOffsetRowsLayout,
  createMixedRowsLayout
} from './domNodes';

describe('SpatialNavigation with closestChildFocusDirections', () => {
  beforeEach(() => {
    window.innerWidth = 1920;
    window.innerHeight = 1280;
    init();
  });

  afterEach(() => {
    destroy();
  });

  describe('Basic spatial navigation between rows', () => {
    it('should navigate down to closest child in next row (column 1)', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');

      SpatialNavigation.navigateByDirection('down', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');
    });

    it('should navigate down to closest child in next row (column 2)', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-2');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-2');

      SpatialNavigation.navigateByDirection('down', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-2');
    });

    it('should navigate down to closest child in next row (column 3)', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-3');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-3');

      SpatialNavigation.navigateByDirection('down', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-3');
    });

    it('should navigate up to closest child in previous row', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-2-2');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-2');

      SpatialNavigation.navigateByDirection('up', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-2');
    });

    it('should navigate down from row 2 to row 3 spatially', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-2-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');

      SpatialNavigation.navigateByDirection('down', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3-1');
    });

    it('should navigate up from row 3 to row 2 spatially', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-3-3');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3-3');

      SpatialNavigation.navigateByDirection('up', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-3');
    });
  });

  describe('Horizontal navigation within rows', () => {
    it('should allow horizontal navigation within row 1', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');

      SpatialNavigation.navigateByDirection('right', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-2');

      SpatialNavigation.navigateByDirection('right', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-3');
    });

    it('should allow horizontal navigation within row 2', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-2-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');

      SpatialNavigation.navigateByDirection('right', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-2');

      SpatialNavigation.navigateByDirection('left', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');
    });
  });

  describe('Partial overlap / Offset rows', () => {
    it('should navigate down from child-1-1 to spatially closest child-2-1', () => {
      createOffsetRowsLayout();

      SpatialNavigation.setFocus('child-1-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');

      SpatialNavigation.navigateByDirection('down', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');
    });

    it('should navigate down from child-1-2 to spatially closest child in row 2', () => {
      createOffsetRowsLayout();

      SpatialNavigation.setFocus('child-1-2');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-2');

      SpatialNavigation.navigateByDirection('down', {});

      // child-1-2 is at 600-1000, child-2-1 is at 350-750, child-2-2 is at 850-1250
      // Both are equidistant, so spatial algorithm picks first one found (child-2-1)
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');
    });

    it('should navigate down from child-1-3 to spatially closest child-2-2', () => {
      createOffsetRowsLayout();

      SpatialNavigation.setFocus('child-1-3');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-3');

      SpatialNavigation.navigateByDirection('down', {});

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-2');
    });
  });

  describe('Interaction with preferredChildFocusKey', () => {
    it('should use preferredChildFocusKey when closestChildFocusDirections is NOT set', () => {
      createMixedRowsLayout();

      // Row 1 has preferredChildFocusKey but NO closestChildFocusDirections
      // So when we navigate into row-1, it should use preferredChildFocusKey
      SpatialNavigation.setFocus('row-1');

      // Should focus child-1-1 because of preferredChildFocusKey
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');
    });

    it('should use spatial navigation when closestChildFocusDirections IS set for that direction', () => {
      createMixedRowsLayout();

      // Row 2 has closestChildFocusDirections: ['up'], so navigating up should use spatial
      SpatialNavigation.setFocus('child-1-2');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-2');

      SpatialNavigation.navigateByDirection('down', {});

      // Should use spatial (closest to child-1-2 is child-2-2)
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-2');
    });

    it('should use preferredChildFocusKey when direction is NOT in closestChildFocusDirections', () => {
      createMixedRowsLayout();

      SpatialNavigation.setFocus('child-2-2');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-2');

      // Manually trigger navigation to the row (simulating left navigation that goes to parent)
      SpatialNavigation.navigateByDirection('left', {});

      // Row 2 has closestChildFocusDirections: ['up'] only, not ['left']
      // So it should use preferredChildFocusKey
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');
    });
  });

  describe('Container exclusion', () => {
    it('should not focus on row containers themselves', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');

      SpatialNavigation.navigateByDirection('down', {});

      // Should skip row-2 container and focus child-2-1
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2-1');
      expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('row-2');
    });
  });

  describe('Navigation boundaries', () => {
    it('should stop at row boundaries when navigating up from first row', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');

      SpatialNavigation.navigateByDirection('up', {});

      // Should stay in child-1-1 (no navigation beyond first row)
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-1');
    });

    it('should stop at row boundaries when navigating down from last row', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-3-1');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3-1');

      SpatialNavigation.navigateByDirection('down', {});

      // Should stay in child-3-1 (no navigation beyond last row)
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3-1');
    });

    it('should stop at horizontal boundaries within rows', () => {
      createGridLayoutWithClosestChild();

      SpatialNavigation.setFocus('child-1-3');

      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-3');

      SpatialNavigation.navigateByDirection('right', {});

      // Should stay in child-1-3 (rightmost item)
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-3');
    });
  });

  describe('Multiple directions configuration', () => {
    it('should respect multiple directions in closestChildFocusDirections', () => {
      createGridLayoutWithClosestChild();

      // Row 2 has closestChildFocusDirections: ['up', 'down']

      // Test 'up' direction
      SpatialNavigation.setFocus('child-2-2');
      SpatialNavigation.navigateByDirection('up', {});
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1-2');

      // Test 'down' direction
      SpatialNavigation.setFocus('child-2-2');
      SpatialNavigation.navigateByDirection('down', {});
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3-2');
    });
  });
});
