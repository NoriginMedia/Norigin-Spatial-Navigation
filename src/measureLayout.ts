const getRect = (node: HTMLElement) => {
  const rect = node.getBoundingClientRect();

  return {
    height: Math.ceil(rect.height),
    left: Math.ceil(rect.left),
    top: Math.ceil(rect.top),
    width: Math.ceil(rect.width)
  };
};

const measureLayout = (node: HTMLElement) => {
  const relativeNode = node && node.parentElement;

  if (node && relativeNode) {
    const relativeRect = getRect(relativeNode);
    const { height, left, top, width } = getRect(node);
    const x = left - relativeRect.left;
    const y = top - relativeRect.top;

    return {
      x,
      y,
      width,
      height,
      left,
      top
    };
  }

  return { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 };
};

export default measureLayout;
