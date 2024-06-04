import measureLayout, { getBoundingClientRect } from '../measureLayout';

const node = {
  offsetLeft: 400,
  offsetTop: 200,
  offsetWidth: 200,
  offsetHeight: 100,
  parentElement: {
    offsetLeft: 10,
    offsetTop: 20,
    offsetWidth: 2000,
    offsetHeight: 1000,
    scrollLeft: 0,
    scrollTop: 0,
    nodeType: Node.ELEMENT_NODE,
    offsetParent: {
      offsetLeft: 10,
      offsetTop: 10,
      scrollLeft: 20,
      scrollTop: 0,
      nodeType: Node.ELEMENT_NODE
    }
  },
  offsetParent: {
    offsetLeft: 10,
    offsetTop: 20,
    offsetWidth: 2000,
    offsetHeight: 1000,
    scrollLeft: 0,
    scrollTop: 0,
    nodeType: Node.ELEMENT_NODE,
    offsetParent: {
      offsetLeft: 10,
      offsetTop: 10,
      scrollLeft: 0,
      scrollTop: 0,
      nodeType: Node.ELEMENT_NODE
    }
  },
  getBoundingClientRect() {
    return {
      x: 420,
      y: 200,
      top: 200,
      left: 420,
      width: 200,
      height: 100
    };
  }
} as unknown as HTMLElement;

describe('measureLayout utils', () => {
  it('should return the correct layout relative to its parent', () => {
    const layout = measureLayout(node);

    expect(layout).toEqual({
      x: 420,
      y: 200,
      top: 230,
      right: 620,
      bottom: 330,
      left: 420,
      width: 200,
      height: 100
    });
  });

  it('should return the correct layout relative to the viewport', () => {
    const layout = getBoundingClientRect(node);

    expect(layout).toEqual({
      x: 420,
      y: 200,
      top: 200,
      right: 620,
      bottom: 300,
      left: 420,
      width: 200,
      height: 100
    });
  });
});
