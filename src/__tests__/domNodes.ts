import { SpatialNavigation, ROOT_FOCUS_KEY } from '../SpatialNavigation';

export const createRootNode = () => {
  SpatialNavigation.addFocusable({
    focusKey: ROOT_FOCUS_KEY,
    node: {
      offsetLeft: 0,
      offsetTop: 0,
      offsetWidth: 1920,
      offsetHeight: 1280,
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
    isFocusBoundary: true,
    parentFocusKey: undefined,
    focusable: true,
    trackChildren: false,
    forceFocus: true,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
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

export const createHorizontalLayout = () => {
  createRootNode();

  SpatialNavigation.addFocusable({
    focusKey: 'child-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2',
    node: {
      offsetLeft: 600,
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-3',
    node: {
      offsetLeft: 1100,
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};

export const createVerticalLayout = () => {
  createRootNode();

  SpatialNavigation.addFocusable({
    focusKey: 'child-1',
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
        offsetWidth: 1920,
        offsetHeight: 1280,
        scrollLeft: 0,
        scrollTop: 0,
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2',
    node: {
      offsetLeft: 100,
      offsetTop: 600,
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};

/**
 * Creates a grid layout with 3 rows and 3 columns for testing closestChildFocusDirections
 * Row 1: child-1-1, child-1-2, child-1-3 (closestChildFocusDirections: ['up'] - allow up navigation into it)
 * Row 2: child-2-1, child-2-2, child-2-3 (closestChildFocusDirections: ['up', 'down'] - allow both directions)
 * Row 3: child-3-1, child-3-2, child-3-3 (closestChildFocusDirections: ['down'] - allow down navigation into it)
 */
export const createGridLayoutWithClosestChild = () => {
  createRootNode();

  // Row 1 container
  SpatialNavigation.addFocusable({
    focusKey: 'row-1',
    node: {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 1400,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    closestChildFocusDirections: ['up'],
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 1 children
  SpatialNavigation.addFocusable({
    focusKey: 'child-1-1',
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-1-2',
    node: {
      offsetLeft: 600,
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-1-3',
    node: {
      offsetLeft: 1100,
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 2 container
  SpatialNavigation.addFocusable({
    focusKey: 'row-2',
    node: {
      offsetLeft: 100,
      offsetTop: 400,
      offsetWidth: 1400,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    closestChildFocusDirections: ['up', 'down'],
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 2 children
  SpatialNavigation.addFocusable({
    focusKey: 'child-2-1',
    node: {
      offsetLeft: 100,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2-2',
    node: {
      offsetLeft: 600,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2-3',
    node: {
      offsetLeft: 1100,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 3 container
  SpatialNavigation.addFocusable({
    focusKey: 'row-3',
    node: {
      offsetLeft: 100,
      offsetTop: 700,
      offsetWidth: 1400,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    closestChildFocusDirections: ['down'],
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 3 children
  SpatialNavigation.addFocusable({
    focusKey: 'child-3-1',
    node: {
      offsetLeft: 100,
      offsetTop: 700,
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
    parentFocusKey: 'row-3',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-3-2',
    node: {
      offsetLeft: 600,
      offsetTop: 700,
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
    parentFocusKey: 'row-3',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-3-3',
    node: {
      offsetLeft: 1100,
      offsetTop: 700,
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
    parentFocusKey: 'row-3',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};

/**
 * Creates offset rows for testing partial overlap
 * Row 1: child-1-1 (100, 100), child-1-2 (600, 100), child-1-3 (1100, 100)
 * Row 2: child-2-1 (350, 400), child-2-2 (850, 400) (offset by 250px)
 */
export const createOffsetRowsLayout = () => {
  createRootNode();

  // Row 1 container
  SpatialNavigation.addFocusable({
    focusKey: 'row-1',
    node: {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 1400,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    closestChildFocusDirections: ['up'],
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 1 children
  SpatialNavigation.addFocusable({
    focusKey: 'child-1-1',
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-1-2',
    node: {
      offsetLeft: 600,
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-1-3',
    node: {
      offsetLeft: 1100,
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 2 container (offset)
  SpatialNavigation.addFocusable({
    focusKey: 'row-2',
    node: {
      offsetLeft: 350,
      offsetTop: 400,
      offsetWidth: 900,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    closestChildFocusDirections: ['down'],
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 2 children (offset)
  SpatialNavigation.addFocusable({
    focusKey: 'child-2-1',
    node: {
      offsetLeft: 350,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2-2',
    node: {
      offsetLeft: 850,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};

/**
 * Creates rows with different configurations for testing mixed behavior
 * Row 1: preferredChildFocusKey set, NO closestChildFocusDirections
 * Row 2: closestChildFocusDirections set
 */
export const createMixedRowsLayout = () => {
  createRootNode();

  // Row 1 container (traditional behavior with preferredChildFocusKey)
  SpatialNavigation.addFocusable({
    focusKey: 'row-1',
    node: {
      offsetLeft: 100,
      offsetTop: 100,
      offsetWidth: 900,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    preferredChildFocusKey: 'child-1-1',
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 1 children
  SpatialNavigation.addFocusable({
    focusKey: 'child-1-1',
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-1-2',
    node: {
      offsetLeft: 600,
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
    parentFocusKey: 'row-1',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 2 container (with closestChildFocusDirections and preferredChildFocusKey)
  SpatialNavigation.addFocusable({
    focusKey: 'row-2',
    node: {
      offsetLeft: 100,
      offsetTop: 400,
      offsetWidth: 900,
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
    focusable: false,
    trackChildren: false,
    forceFocus: false,
    autoRestoreFocus: true,
    saveLastFocusedChild: false,
    preferredChildFocusKey: 'child-2-1',
    closestChildFocusDirections: ['down'],
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onArrowPress: () => true,
    onArrowRelease: () => {},
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  // Row 2 children
  SpatialNavigation.addFocusable({
    focusKey: 'child-2-1',
    node: {
      offsetLeft: 100,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });

  SpatialNavigation.addFocusable({
    focusKey: 'child-2-2',
    node: {
      offsetLeft: 600,
      offsetTop: 400,
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
    parentFocusKey: 'row-2',
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
    onUpdateFocus: () => {},
    onUpdateHasFocusedChild: () => {}
  });
};
