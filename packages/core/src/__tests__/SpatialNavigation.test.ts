import {
  ROOT_FOCUS_KEY,
  SpatialNavigation,
  destroy,
  init
} from '../SpatialNavigation';
import { createHorizontalLayout, createVerticalLayout } from './domNodes';

const settle = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });

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
});
