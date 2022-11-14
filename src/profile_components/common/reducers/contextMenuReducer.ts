import React from 'react';
import { 
  ContextMenuInfoTypes,
  contextOpenedElemDefault,
  ContextOpenedElemTypes
} from '../handlers/create_context_menu';

export const handleContextMenuReducer = (
  state: ContextMenuTypes,
  action: {
    type: string;
    value?: string | number| ContextMenuInfoTypes;
    extraValue?: HTMLElement;
    event?: React.MouseEvent
  }
): ContextMenuTypes => {
  switch (action.type) {
    case 'view':
      const contextMenuInfo = action.value as ContextMenuInfoTypes;
      const container = action.extraValue as HTMLElement;

      let top = action.event!.clientY;
      let left = action.event!.clientX;
      if (contextMenuInfo.closest) {
        // Height of each menu should be 60px.
        if (window.innerHeight - top < contextMenuInfo.ops.length * 60) {
          top -= contextMenuInfo.ops.length * 60;
        }
        let contextOffset = window.innerWidth < 480 ? 170 : 200;
        // Width of the context menu should be 200px.
        if (window.innerWidth - left < contextOffset) {
          left -= contextOffset;
        }
      }

      return {
        exists: true,
        contextOpenedElem: contextMenuInfo.openedElem,
        contextOptions: contextMenuInfo.ops[0] ? contextMenuInfo.ops : ['no actions'],
        contextMenuScroll: { scroll: container.scrollTop, top: top },
        contextMenuStyle: { top: top, left: left }
      };

    case 'reset':
      return {
        exists: false,
        contextOptions: [''],
        contextOpenedElem: contextOpenedElemDefault,
        contextMenuScroll: { top: 0, scroll: 0 },
        contextMenuStyle: { top: 0, left: 0 }
      };

    case 'scrollMenu': {
      return {
        ...state,
        contextMenuStyle: {
          ...state.contextMenuStyle,
          top: action.value as number
        }
      };
    }
    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

export interface ContextMenuTypes {
  exists: boolean;
  contextOpenedElem: ContextOpenedElemTypes;
  contextOptions: string[];
  contextMenuStyle: {
    top: number;
    left: number;
  },
  contextMenuScroll: {
    top: number;
    scroll: number;
  }
}

export const contextMenuDefaults = {
  exists: false,
  contextOpenedElem: contextOpenedElemDefault,
  contextOptions: [''],
  contextMenuStyle: { top: 0, left: 0 },
  contextMenuScroll: { top: 0, scroll: 0 }
};

export interface ContextReducerActionTypes {
  type: string;
  value?: string | number| ContextMenuInfoTypes;
  extraValue?: HTMLElement;
  event?: React.MouseEvent
}

