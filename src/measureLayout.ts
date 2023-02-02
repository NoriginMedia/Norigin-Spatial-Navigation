const measureLayout = (node: HTMLElement) => {
  if (node && node.getBoundingClientRect) {
    const rect = node.getBoundingClientRect();

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top
    };
  }

  return { x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 };
};

export default measureLayout;
