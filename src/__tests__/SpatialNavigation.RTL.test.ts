import {
  ROOT_FOCUS_KEY,
  SpatialNavigation,
  destroy,
  init
} from '../SpatialNavigation';
import { createHorizontalLayout, createVerticalLayout } from './domNodes';

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

  it('should allow horizontal navigation', () => {
    createHorizontalLayout();

    // @ts-ignore
    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('up', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-3');

    SpatialNavigation.navigateByDirection('left', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    SpatialNavigation.navigateByDirection('down', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should allow vertical navigation', () => {
    createVerticalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus(ROOT_FOCUS_KEY);

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('up', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('left', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('down', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');

    SpatialNavigation.navigateByDirection('down', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should allow manual focus', () => {
    createHorizontalLayout();

    expect(SpatialNavigation.getCurrentFocusKey()).not.toBe('child-1');

    SpatialNavigation.setFocus('child-2');

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-2');
  });

  it('should ignore events if paused', () => {
    createHorizontalLayout();
    SpatialNavigation.pause();

    SpatialNavigation.setFocus('child-1');

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');

    SpatialNavigation.navigateByDirection('right', {});

    expect(SpatialNavigation.getCurrentFocusKey()).toBe('child-1');
  });
});
