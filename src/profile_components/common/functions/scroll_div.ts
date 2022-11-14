function scroll_div(
  event: React.MouseEvent,
  scrolling: ScrollingTypes,
  windowObj: Window
) {
  // Used by: ../ProfilePage -> HandleMouseAction event handler.

  // Scroll bottom
  if (windowObj.innerHeight - 100 < event.clientY) {
    let interval = windowObj.innerHeight - event.clientY;
    interval = interval < 7 ? 7 : interval > 30 ? 30 : interval;
    if (!scrolling.exists) {
      return {'cursor': event.clientY, 'move_by': 10, 'timing': interval};
    } else {
      if (Math.abs(event.clientY - scrolling.spec.cursor) > 5) {
        return {'cursor': event.clientY, 'move_by': 10, 'timing': interval};
      } else {
        return 'continue';
      }
    }
    // Scroll top
  } else if (event.clientY < 150) {
    let interval = event.clientY;
    interval = interval < 7 ? 7 : interval > 30 ? 30 : interval;
    if (!scrolling.exists) {
      return {'cursor': event.clientY, 'move_by': -10, 'timing': interval};
    } else {
      if (Math.abs(event.clientY - scrolling.spec.cursor) > 5) {
        return {'cursor': event.clientY, 'move_by': -10, 'timing': interval};
      } else {
        return 'continue';
      }
    } 
  } else {
    return false;
  } 
}
export interface ScrollingTypes {
  exists: boolean;
  element: Element | undefined;
  spec: {
    cursor: number;
    move_by: number;
    timing: number;
  };
  interval: number;
}

export const scrollingDefault = {
  exists: false,
  element: undefined,
  spec: {
    cursor: 0,
    move_by: 0,
    timing: 0
  },
  interval: 0
};

export default scroll_div;
