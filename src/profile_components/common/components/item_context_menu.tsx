import { useContext } from 'react';
import axios from 'axios';
import { ProfileContext } from '../../profile_page/profile_page';
import { ProfileContextTypes } from '../../types/profilePageTypes';
import delete_item from '../functions/delete_item';
import { extract_int } from '../utils';
import { isProduction, serverUrl } from '../../../constants';

const ItemContextMenu: React.FC = () => {
  const {
    directory,
    setReRender,
    contextMenu,
    setContextMenu,
    clipboard,
    directoryInfo,
    setClipboard,
    setRequestError,
  } = useContext(ProfileContext) as ProfileContextTypes;

  const { contextOpenedElem, contextMenuStyle, contextOptions } = contextMenu;
  const restrictions: ContextRestrictTypes = {
    paste: {
      [`${!clipboard.id}`]: 'Clipboard is empty',

      // Pasting category into category.
      [`${
        (contextOpenedElem.id === clipboard.id ||
          contextOpenedElem.type === clipboard.type) &&
        clipboard.id
      }`]: 'Cannot paste category here',

      // Pasting category into a regular folder.
      [`${
        clipboard.type === 'category' &&
        directoryInfo.item_type !== 'thematic_folder'
      }`]: 'Cannot paste category here',

      // Pasting an item outside of a category in a thematic folder.
      [`${
        directoryInfo.item_type === 'thematic_folder' &&
        clipboard.type !== 'category' &&
        contextOpenedElem.type !== 'category'
      }`]: 'Can only paste in a category',

      [`${contextOpenedElem.type === 'category' && clipboard.type !== 'deck'}`]:
        'Categories can only contain decks',
    },
    'no actions': {
      [`${true}`]: ''
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement;

    if (element.className === 'disabled-context') {
      if (element.title === 'no actions') {
        setContextMenu({type: 'reset'});
        return;
      }
      setRequestError({
        exists: true,
        description: restrictions[element.title]['true'],
      });
      return;
    }
    const action = element.title;
    if (['cut', 'copy'].includes(action)) {
      setClipboard({
        action: action,
        id: contextOpenedElem.id,
        type: contextOpenedElem.type,
        directory: directory,
      });
    } else if (action === 'delete') {
      delete_item(contextOpenedElem, setReRender, setRequestError);
    } else if (action === 'paste') {
      // Type guard
      if (!clipboard.id) throw Error;

      axios
        .put(`${isProduction ? serverUrl : ''}/paste`, {
          item_id: extract_int(clipboard.id),
          new_parent: directory,
          category_id:
            contextOpenedElem.type === 'category'
              ? extract_int(contextOpenedElem.id!)
              : null,
          action: clipboard.action,
        })
        .then(() => {
          if (clipboard.action === 'cut') {
            setClipboard(clipboardDefault);
          }
          setReRender();
        })
        .catch((err) =>
          setRequestError({
            exists: true,
            description: err.response.data.errDesc,
          })
        );
    }
    setContextMenu({type: 'reset'});
  };

  return (
    <div
      id="item-context-menu"
      className="context-menu"
      style={contextMenuStyle}
      onContextMenu={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      {contextOptions.map((menuItem) => {
        let menuClass =
          menuItem in restrictions &&
          Object.keys(restrictions[menuItem]).some((x) => x === 'true')
            ? 'disabled-context'
            : 'context-item';
        if (menuItem ===  'delete') {
          menuClass += ' delete';
        }
        return (
          <menu className={menuClass} title={menuItem} key={menuItem}></menu>
        );
      })}
    </div>
  );
};

interface ContextRestrictTypes {
  [paste: string]: {
    [key: string]: string;
  };
}

export const clipboardDefault = {
  action: undefined,
  id: undefined,
  type: undefined,
  directory: undefined,
};

export default ItemContextMenu;
