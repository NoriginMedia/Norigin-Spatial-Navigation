import {
  ROOT_FOCUS_KEY,
  SpatialNavigation,
  destroy,
  init
} from '../SpatialNavigation';
import { createHorizontalLayout, createVerticalLayout } from './domNodes';

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

    await SpatialNavigation.setFocus(ROOT_FOCUS_KEY);

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    await SpatialNavigation.navigateByDirection('up', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    await SpatialNavigation.navigateByDirection('left', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('down', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');
  });

  it('should allow vertical navigation', async () => {
    createVerticalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    await SpatialNavigation.setFocus(ROOT_FOCUS_KEY);

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('up', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('left', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('down', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    await SpatialNavigation.navigateByDirection('down', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should allow manual focus', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    await SpatialNavigation.setFocus('child-2');

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should ignore events if paused', async () => {
    createHorizontalLayout();
    SpatialNavigation.pause();

    await SpatialNavigation.setFocus('child-1');

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    await SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');
  });

  it('should be able to update a focusable reference', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    await SpatialNavigation.setFocus(ROOT_FOCUS_KEY);

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

    await SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    await SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should be able to remove a focusable reference', async () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    await SpatialNavigation.setFocus(ROOT_FOCUS_KEY);

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.removeFocusable({ focusKey: 'child-2' });

    await SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');
  });
});
