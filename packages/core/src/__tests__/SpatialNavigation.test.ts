import {
  ROOT_FOCUS_KEY,
  SpatialNavigation,
  destroy,
  init,
  type NextFocusResolver
} from '../SpatialNavigation';
import { measureLayout } from '../measureLayout';
import {
  createHorizontalLayout,
  createHorizontalLayoutWithResolver,
  createRootNode,
  createVerticalLayout
} from './domNodes';

const settle = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const createMeasureLayoutSpy = () => {
  const measuredFocusKeys: string[] = [];

  const measureLayoutSpy = jest.fn(
    (component: { focusKey: string; node: HTMLElement }) => {
      measuredFocusKeys.push(component.focusKey);

      return Promise.resolve({
        ...measureLayout(component.node),
        node: component.node
      });
    }
  );

  return { measureLayoutSpy, measuredFocusKeys };
};

describe('SpatialNavigation', () => {
  beforeEach(() => {
    window.innerWidth = 1920;
    window.innerHeight = 1280;
    init();
  });

  afterEach(() => {
    destroy();
  });

  it('should allow horizontal navigation', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    SpatialNavigation.navigateByDirection('up', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    SpatialNavigation.navigateByDirection('left', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('down', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');
  });

  it('should allow vertical navigation', async () => {
    createVerticalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('up', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('left', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('down', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    SpatialNavigation.navigateByDirection('down', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should allow manual focus', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus('child-2');
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should ignore events if paused', async () => {
    createHorizontalLayout();
    SpatialNavigation.pause();

    SpatialNavigation.setFocus('child-1');
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');
  });

  it('should be able to update a focusable reference', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.updateFocusable('child-2', {
      node: {
        offsetLeft: 1600,
        offsetTop: 100,
        offsetWidth: 400,
        offsetHeight: 200,
        parentElement: {
          offsetLeft: 0,
          offsetTop: 0,
          offsetWidth: 1920,
          offsetHeight: 1280
        } as HTMLElement,
        offsetParent: {
          offsetLeft: 0,
          offsetTop: 0,
          scrollLeft: 0,
          scrollTop: 0,
          offsetWidth: 1920,
          offsetHeight: 1280,
          nodeType: Node.ELEMENT_NODE
        } as HTMLElement
      } as unknown as HTMLElement,
      isFocusBoundary: false,
      focusable: true,
      onEnterPress: () => {},
      onEnterRelease: () => {},
      onFocus: () => {},
      onBlur: () => {},
      onArrowPress: () => true,
      onArrowRelease: () => {}
    });

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should be able to remove a focusable reference', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.removeFocusable({ focusKey: 'child-2' });

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');
  });

  describe('clearLastFocusedChild', () => {
    const addNode = (
      focusKey: string,
      parentFocusKey: string,
      offsetLeft: number,
      { preferredChildFocusKey }: { preferredChildFocusKey?: string } = {}
    ) => {
      SpatialNavigation.addFocusable({
        focusKey,
        node: {
          offsetLeft,
          offsetTop: 100,
          offsetWidth: 400,
          offsetHeight: 200,
          parentElement: {
            offsetLeft: 0,
            offsetTop: 0,
            offsetWidth: 1920,
            offsetHeight: 1280
          } as HTMLElement,
          offsetParent: {
            offsetLeft: 0,
            offsetTop: 0,
            scrollLeft: 0,
            scrollTop: 0,
            offsetWidth: 1920,
            offsetHeight: 1280,
            nodeType: Node.ELEMENT_NODE
          } as HTMLElement
        } as unknown as HTMLElement,
        isFocusBoundary: false,
        parentFocusKey,
        preferredChildFocusKey,
        focusable: true,
        trackChildren: false,
        forceFocus: false,
        autoRestoreFocus: true,
        saveLastFocusedChild: true,
        onEnterPress: () => {},
        onEnterRelease: () => {},
        onFocus: () => {},
        onBlur: () => {},
        onArrowPress: () => true,
        onArrowRelease: () => {},
        onUpdateFocus: () => {},
        onUpdateHasFocusedChild: () => {}
      });
    };

    const createContainer = (preferredChildFocusKey?: string) => {
      createRootNode();
      addNode('container', ROOT_FOCUS_KEY, 0, { preferredChildFocusKey });
      addNode('item-1', 'container', 100);
      addNode('item-2', 'container', 600);
      addNode('item-3', 'container', 1100);
    };

    it('restores the last focused child when not cleared', async () => {
      createContainer();

      SpatialNavigation.setFocus('item-3');
      await settle();

      SpatialNavigation.setFocus('container');
      await settle();
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('item-3');
    });

    it('makes the container fall back to its first child once cleared', async () => {
      createContainer();

      SpatialNavigation.setFocus('item-3');
      await settle();

      SpatialNavigation.clearLastFocusedChild('container');

      SpatialNavigation.setFocus('container');
      await settle();
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('item-1');
    });

    it('makes the container fall back to preferredChildFocusKey once cleared', async () => {
      createContainer('item-2');

      SpatialNavigation.setFocus('item-3');
      await settle();

      SpatialNavigation.clearLastFocusedChild('container');

      SpatialNavigation.setFocus('container');
      await settle();
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('item-2');
    });

    it('does not move focus', async () => {
      createContainer();

      SpatialNavigation.setFocus('item-3');
      await settle();

      SpatialNavigation.clearLastFocusedChild('container');
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('item-3');
    });

    it('ignores unknown focus keys', () => {
      expect(() =>
        SpatialNavigation.clearLastFocusedChild('missing')
      ).not.toThrow();
    });
  });

  describe('focusOnPresetKey', () => {
    const addPresetChild = (onUpdateFocus: (focused: boolean) => void) => {
      SpatialNavigation.addFocusable({
        focusKey: 'preset-child',
        node: {
          offsetLeft: 100,
          offsetTop: 100,
          offsetWidth: 400,
          offsetHeight: 200,
          parentElement: {
            offsetLeft: 0,
            offsetTop: 0,
            offsetWidth: 1920,
            offsetHeight: 1280
          } as HTMLElement,
          offsetParent: {
            offsetLeft: 0,
            offsetTop: 0,
            scrollLeft: 0,
            scrollTop: 0,
            offsetWidth: 1920,
            offsetHeight: 1280,
            nodeType: Node.ELEMENT_NODE
          } as HTMLElement
        } as unknown as HTMLElement,
        isFocusBoundary: false,
        parentFocusKey: ROOT_FOCUS_KEY,
        focusable: true,
        trackChildren: false,
        forceFocus: false,
        autoRestoreFocus: true,
        saveLastFocusedChild: false,
        onEnterPress: () => {},
        onEnterRelease: () => {},
        onFocus: () => {},
        onBlur: () => {},
        onArrowPress: () => true,
        onArrowRelease: () => {},
        onUpdateFocus,
        onUpdateHasFocusedChild: () => {}
      });
    };

    it('focuses a component on add when its key was pre-set as current focus (enabled by default)', async () => {
      createRootNode();

      // Pre-set focus to a component that has not mounted yet
      SpatialNavigation.setFocus('preset-child');
      await settle();
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('preset-child');

      const onUpdateFocus = jest.fn();
      addPresetChild(onUpdateFocus);
      await settle();

      // The component is auto-focused on add, so its focus callback fires
      expect(onUpdateFocus).toHaveBeenCalledWith(true);
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('preset-child');
    });

    it('does not focus a component on add when focusOnPresetKey is false', async () => {
      destroy();
      init({ focusOnPresetKey: false });
      createRootNode();

      // Pre-set focus to a component that has not mounted yet
      SpatialNavigation.setFocus('preset-child');
      await settle();
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('preset-child');

      const onUpdateFocus = jest.fn();
      addPresetChild(onUpdateFocus);

      // The implicit refocus is disabled, so the focus callback does not fire on add
      expect(onUpdateFocus).not.toHaveBeenCalled();
    });
  });

  describe('measureChildrenLayout', () => {
    it('measures sibling layouts by default when navigating', async () => {
      const { measureLayoutSpy, measuredFocusKeys } = createMeasureLayoutSpy();

      destroy();
      init({ layoutAdapter: { measureLayout: measureLayoutSpy } });
      createHorizontalLayout();

      SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
      await settle();
      // Let the initial layouts go stale so the sibling loop is forced to re-measure them
      await wait(20);
      measuredFocusKeys.length = 0;

      SpatialNavigation.navigateByDirection('right', {});
      await settle();

      // The uninvolved sibling was still re-measured as part of the default coordinate-based navigation
      expect(measuredFocusKeys).toContain('child-3');
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
    });

    it('does not measure sibling layouts when false and a nextFocusResolver is set', async () => {
      const { measureLayoutSpy, measuredFocusKeys } = createMeasureLayoutSpy();
      const nextFocusResolver: NextFocusResolver = (
        _direction,
        _focusKey,
        siblings
      ) => siblings.find((sibling) => sibling.focusKey === 'child-2') ?? null;

      destroy();
      init({ layoutAdapter: { measureLayout: measureLayoutSpy } });
      createHorizontalLayoutWithResolver({
        nextFocusResolver,
        measureChildrenLayout: false
      });

      SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
      await settle();
      await wait(20);
      measuredFocusKeys.length = 0;

      SpatialNavigation.navigateByDirection('right', {});
      await settle();

      // The uninvolved sibling was left untouched: measurement was skipped entirely
      expect(measuredFocusKeys).not.toContain('child-3');
      expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
    });
  });
});
