import axios from 'axios';
import { useContext } from 'react';
import { isProduction, serverUrl } from '../../../constants';
import { NavbarContext, NavbarContextTypes } from '../../../navbar/layout_with_navbar';
import { ProfileContext } from '../../profile_page/profile_page';
import { ProfileContextTypes } from '../../types/profilePageTypes';
import { extract_int } from '../utils';

export const Filler: React.FC<FillerTypes> = (props) => {
  // Rendered by "../PageItems"
  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const {
    directoryUsername,
    drag,
    setDrag,
    resetDragWithTimeout,
    setReRender,
    setRequestError,
  } = useContext(ProfileContext) as ProfileContextTypes;

  // Style the filler on hovering.
  const handleFillerHover = (event: React.MouseEvent) => {
    // Check authentication
    if (currentUserInfo.username !== directoryUsername) {
      return;
    }
    
    // Disable interaction between different types of fillers.
    const element = event.target as HTMLElement;
    if (
      [props.siblingType, drag.draggedElement.type].includes('category') &&
      props.siblingType !== drag.draggedElement.type
    ) {
      return;
    }

    let nextElement = (
      props.type === 'regular'
        ? element.nextElementSibling
        : element.previousSibling
    ) as Element | null;
    if (!nextElement) return;

    if (drag.isDragging && !drag.cloneTimeout.exists) {
      if (nextElement.id !== drag.draggedElement.id) {
        if (event.type === 'mouseover') {
          props.setFillerClass('filler-hovered');
        } else {
          props.setFillerClass('');
        }
      }
    }
  };

  const handleFillerUp = (event: React.MouseEvent) => {
    // Check authentication
    if (currentUserInfo.username !== directoryUsername) {
      return;
    }

    if (!drag.isDragging || !drag.draggedElement.id) {
      return;
    }
    const element = event.target as HTMLElement;

    // Disable interaction between different types of fillers.
    if (
      [props.siblingType, drag.draggedElement.type].includes('category') &&
      props.siblingType !== drag.draggedElement.type
    ) {
      return;
    }

    const categoryContainer = element.closest('.category');
    if (props.type === 'regular') {
      let nextElement = element.nextElementSibling as Element | null;
      if (!nextElement) return;

      if (nextElement.id === drag.draggedElement.id) {
        resetDragWithTimeout();
        return;
      }
    } else if (props.type === 'last') {
      let previousElement = element.previousSibling as Element | null;
      if (!previousElement) return;

      if (previousElement.id === drag.draggedElement.id) {
        resetDragWithTimeout();
        return;
      }
    }

    props.setFillerClass('');
    setDrag({type: 'reset'});

    axios
      .put(`${isProduction ? serverUrl : ''}/file_order`, {
        item_id: extract_int(drag.draggedElement.id),
        category_id: categoryContainer
          ? extract_int(categoryContainer.id)
          : null,
        new_order: `${props.order}`,
        direction: props.type === 'last' ? 'after' : 'before',
      })
      .then(() => setReRender())
      .catch((err) =>
        setRequestError({
          exists: true,
          description: err.response.data.errDesc,
        })
      );
  };

  return (
    <div
      className={
        `${props.siblingType === 'category' ? 'category' : 'item'}-filler` +
        (props.fillerClass ? ` ${props.fillerClass}` : '') +
        (props.type === 'last' ? ' last-filler' : '')
      }
      onMouseOver={handleFillerHover}
      onMouseLeave={handleFillerHover}
      onMouseUp={handleFillerUp}
    />
  );
};

export interface FillerTypes {
  fillerClass: string;
  setFillerClass: React.Dispatch<React.SetStateAction<string>>;
  siblingType: string;
  order: number;
  type: string;
}

export default Filler;
