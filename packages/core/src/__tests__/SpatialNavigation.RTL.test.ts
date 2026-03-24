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

describe('SpatialNavigation RTL', () => {
  beforeEach(() => {
    window.innerWidth = 1920;
    window.innerHeight = 1280;
    init({
      rtl: true
    });
  });

  afterEach(() => {
    destroy();
  });

  it('should allow horizontal navigation', async () => {
    createHorizontalLayout();

    // @ts-ignore
    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('right', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('up', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('left', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    SpatialNavigation.navigateByDirection('down', {});
    await settle();
    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
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

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');
  });
});
