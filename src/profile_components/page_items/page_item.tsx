import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isProduction, serverUrl } from '../../constants';
import { NavbarContext, NavbarContextTypes } from '../../navbar/layout_with_navbar';
import Filler from '../common/components/filler';
import handleDownOnDragged from '../common/handlers/handle_down_on_dragged';
import { extract_int } from '../common/utils';
import { ProfileContext } from '../profile_page/profile_page';
import { ProfileContextTypes, WordTypes } from '../types/profilePageTypes';
import CategoryContainer from './containers/category_container';
import ItemContainer from './containers/item_container';

export const ItemContext = createContext<PageItemContextTypes | undefined>(
  undefined
);

export const PageItem: React.FC<PageItemPropTypes> = (props) => {
  // Component of ProfilePage.
  // Deployed by './common/functions' -> generate_directory.

  const navigate = useNavigate();

  const [selfStyle, setSelfStyle] = useState({
    ...selfStyleDefault,
    order: props.order,
  });
  const [itemStyle, setItemStyle] = useState({
    backgroundColor: props.color ? props.color : '',
    boxShadow: '',
  });
  const [folderStyle, setFolderStyle] = useState('');
  const [fillerClass, setFillerClass] = useState('');
  const [lastFillerClass, setLastFillerClass] = useState('');

  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const {
    directoryUsername,
    setReRender,
    directoryInfo,
    columnNumber,
    drag,
    setDrag,
    resetDragWithTimeout,
    items,
    setRequestError,
  } = useContext(ProfileContext) as ProfileContextTypes;

  // Get children count for each category.
  let childCount;
  if (props.type === 'category') {
    const elemChildren = props.children as React.ReactNode[];
    childCount = elemChildren.length;
  } else {
    childCount = 0;
    const extraChildren = 1; // Unrelated children in a category like the top bar.
    if (directoryInfo.item_type === 'thematic_folder') {
      let elem = document.querySelector(`#${props.id}`);
      if (elem) {
        const closestElem = elem.closest('.category') as HTMLElement | null;
        const elemChildren = closestElem ? closestElem.children : 0;
        childCount = elemChildren
          ? elemChildren.length - extraChildren
          : elemChildren;
      }
    }
  }

  // Set the opacity of dragged element while dragging.
  useEffect(() => {
    if (drag.isDragging && drag.draggedElement.id === props.id) {
      setSelfStyle((prev) => ({
        ...prev,
        order: props.order,
        opacity: '0.5',
      }));
      if (props.type === 'folder') {
        setFolderStyle('dragged-folder');
      } 
    } else {
      setSelfStyle((prev) => ({ ...prev, order: props.order, opacity: '1' }));
      if (props.type === 'folder') {
        setFolderStyle('');
      }
    }
  }, [drag.isDragging, drag.draggedElement, props.name, props.type, props.order, props.id]);

  // Change directory after double clicking on a folder.
  const handleDoubleClick = () => {
    if (['folder', 'thematic-folder'].includes(props.type)) {
      navigate(`/user/${directoryUsername}/${extract_int(props.id)}`);
    }
  };

  // Set the properties of the 'to be dragged' element on mouse click.
  const handleMouseDown = (event: React.MouseEvent) => {
    // Only left click
    if (event.button !== 0 || drag.isDragging || currentUserInfo.username !== directoryUsername) {
      return;
    }
    var targetElem = event.target as HTMLElement;

    // Only drag categories through their navigation bar.
    if (
      props.type === 'category' ||
      targetElem.className === 'category-navbar-description'
    ) {
      if (
        !['category-header', 'category-navbar-description'].includes(
          targetElem.className
        )
      ) {
        return;
      }
    }

    if (targetElem.className !== props.type) {
      targetElem = targetElem.closest(`.${props.type}`)!;
    }

    if (!drag.cloneElement.exists) {
      const draggedElementSpecs = handleDownOnDragged(props, drag.cloneTimeout);
      setDrag({type: 'draggedElement', value: draggedElementSpecs});
    }  
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    // Check authentication
    if (currentUserInfo.username !== directoryUsername) {
      return;
    }

    // Only left click
    if (event.button !== 0) {
      return;
    }

    let targetElem = event.target as HTMLElement;
    if (!['deck', 'folder', 'category'].includes(targetElem.className)) {
      const closestElem = targetElem.closest(`.${props.type}`) as HTMLElement;
      if (closestElem) {
        targetElem = closestElem;
      }
    }

    if (
      (['deck', 'category', 'thematic-folder'].includes(targetElem.className) ||
        drag.draggedElement.id === targetElem.id) &&
      drag.isDragging
    ) {
      resetDragWithTimeout();
      return;
    }

    setItemStyle((prev) => ({
      ...prev,
      backgroundColor: props.color ? props.color : '',
    }));
    setFolderStyle('');

    if (drag.isDragging && drag.draggedElement.id ) {
      axios
        .put(`${isProduction ? serverUrl : ''}/file_directory`, {
          item_id: extract_int(drag.draggedElement.id),
          target_id: extract_int(targetElem.id),
        })
        .then(() => setReRender())
        .catch((err) =>
          setRequestError({
            exists: true,
            description: err.response.data.errDesc,
          })
        );
    }
    setDrag({type: 'reset'});
  };

  const handleClick = (event: React.MouseEvent) => {
    let targetElem = event.target as HTMLElement;
    if (!['deck', 'folder', 'category'].includes(targetElem.className)) {
      const closestElem = targetElem.closest(`.${props.type}`) as HTMLElement;
      if (closestElem) {
        targetElem = closestElem;
      }
    }

    if (targetElem.className === 'deck' && !drag.isDragging) {
      navigate(`/deck/${directoryUsername}/${extract_int(targetElem.id)}`);
    }
  };

  const handleHover = (event: React.MouseEvent) => {
    if (!drag.isDragging || drag.cloneTimeout.exists) {
      return;
    }

    const element = event.target as HTMLElement;
    const targeted = element.closest('div');
    if (!targeted) return;

    if (targeted.id === drag.draggedElement.id) {
      return;
    }
    if (targeted.className !== 'folder') {
      return;
    }
    if (event.type === 'mouseover') {
      setItemStyle({
        boxShadow: 'rgb(211, 210, 210) 0px 0px 5px 3px',
        backgroundColor: props.color ? props.color : '',
      });
      setFolderStyle('drag-hover-folder');
    } else if (event.type === 'mouseout') {
      setItemStyle({
        boxShadow: '',
        backgroundColor: props.color ? props.color : '',
      });
      setFolderStyle('');
    }
  };

  return (
    <div
      className={
        props.type === 'category' ? 'category-with-filler' : 'item-with-filler'
      }
      style={selfStyle}
      draggable="false"
    >
      {((props.type === 'category' &&
        drag.draggedElement.type === 'category' &&
        drag.categoryIsDragging &&
        !drag.cloneTimeout.exists &&
        drag.draggedElement.id !== props.id) ||
        props.type !== 'category') && (
        <Filler
          fillerClass={fillerClass}
          setFillerClass={setFillerClass}
          siblingType={props.type}
          order={props.order}
          type="regular"
        />
      )}

      <ItemContext.Provider
        value={{
          parentProps: props,
          itemStyle: itemStyle,
          folderStyle: folderStyle,
          handleDoubleClick: handleDoubleClick,
          handleClick: handleClick,
          handleMouseDown: handleMouseDown,
          handleMouseUp: handleMouseUp,
          handleHover: handleHover,
        }}
      >
        {props.type !== 'category' ? <ItemContainer /> : <CategoryContainer />}
      </ItemContext.Provider>

      {((items.length === props.order &&
        directoryInfo.item_type !== 'thematic_folder') ||
        (items.length === props.order && props.type === 'category') ||
        (props.order === childCount && props.type !== 'category') ||
        (props.order % columnNumber === 0 && props.type !== 'category')) && (
        <Filler
          fillerClass={lastFillerClass}
          setFillerClass={setLastFillerClass}
          siblingType={props.type}
          order={props.order}
          type="last"
        />
      )}
    </div>
  );
};

export interface PageItemPropTypes {
  key: string;
  id: string;
  name: string;
  type: string;
  order: number;
  words: WordTypes[];
  color?: string;
  purpose?: string;
  show_translation?: boolean;
  target_language?: string;
  source_language?: string;
  completed?: boolean;
  user: string;
  children?: boolean | React.ReactNode[];
}

export interface PageItemContextTypes {
  parentProps: PageItemPropTypes;
  itemStyle: {
    backgroundColor: string;
    boxShadow: string;
  };
  folderStyle: string;
  handleDoubleClick: () => void;
  handleClick: (event: React.MouseEvent) => void;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseUp: (event: React.MouseEvent) => void;
  handleHover: (event: React.MouseEvent) => void;
}

export const selfStyleDefault = {
  opacity: '1'
};

export default PageItem;
