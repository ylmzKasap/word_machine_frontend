import { 
  CloneElementTypes,
  CloneStyleTypes,
  DraggedElementTypes 
} from '../../types/profilePageTypes';

import { 
  cloneElementDefault,
  cloneStyleDefault, 
  cloneTimeoutDefault,
  draggedElementDefault } from '../../types/profilePageDefaults';

export const handleDrag = (
  state: dragTypes,
  action: dragActionTypes
): dragTypes => {
  switch (action.type) {
    case 'cloneElement':
      return {
        ...state,
        cloneElement: {
          exists: true,
          itemName: state.draggedElement.name,
          cloneStyle: state.cloneStyle,
          draggedElement: state.draggedElement
        }
      };

    case 'cloneStyle':
      const newStyle = action.value as CloneStyleTypes;
      return {
        ...state,
        cloneStyle: newStyle
      };

    case 'incrementDragCount':
      return {
        ...state,
        dragCount: state.dragCount + 1
      };

    case 'draggedElement':
      const newDraggedElement = action.value as DraggedElementTypes;
      return {
        ...state,
        draggedElement: newDraggedElement
      };

    case 'firstDrag':
      return {
        ...state,
        isDragging: true,
        categoryIsDragging: state.draggedElement.type === 'category',
        cloneElement: {
          exists: true,
          itemName: state.draggedElement.name,
          cloneStyle: state.cloneStyle,
          draggedElement: state.draggedElement
        }
      };
    
    case 'reset':
      let timeout = action.value;
      if (timeout && state.draggedElement.name && state.draggedElement.id) {
        const { top, left, width, height } = document
          ?.getElementById(state.draggedElement.id)
          ?.getBoundingClientRect() as DOMRect;

        return {
          ...state,
          dragCount: 0,
          cloneStyle: {
            width: `${width}px`,
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
            transition: '.3s',
            boxShadow: 'none'
          },
          cloneTimeout: {
            exists: true,
            timeouts: window.setTimeout(action.func!, 150),
          }
        };    
      } else {
        return {
          dragCount: 0,
          draggedElement: draggedElementDefault,
          isDragging: false,
          cloneElement: action.innerType === 'cloneLag' ? state.cloneElement : cloneElementDefault,
          cloneStyle: action.innerType === 'cloneLag' ? state.cloneStyle : cloneStyleDefault,
          cloneTimeout: cloneTimeoutDefault,
          categoryIsDragging: false
        };
      }

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

export interface dragTypes {
  cloneElement: CloneElementTypes,
  cloneStyle: CloneStyleTypes,
  cloneTimeout: {
    exists: boolean,
    timeouts: number,
  },
  draggedElement: DraggedElementTypes,
  dragCount: number,
  isDragging: boolean,
  categoryIsDragging: boolean
}

export interface dragActionTypes {
  type: string; 
  value?: string | number | boolean | CloneStyleTypes | DraggedElementTypes; 
  innerType?: string, 
  func?: () => void
};
