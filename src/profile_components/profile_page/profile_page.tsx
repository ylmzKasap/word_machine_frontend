/* eslint-disable react-hooks/exhaustive-deps */

// Libraries
import React, { useState, useEffect, useContext, useReducer, createContext } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import axios from 'axios';

// Hooks
import useWindowSize from '../common/hooks/use_column_number';

// Functions
import generate_directory from '../common/functions/generate_directory';
import scroll_div, {
  scrollingDefault,
  ScrollingTypes,
} from '../common/functions/scroll_div';
import find_closest_element from '../common/functions/find_closest_element';

import { DragClone, RequestInfo } from './other_components';
import { CardContainer } from './card_container';
import {
  create_context_menu,
} from '../common/handlers/create_context_menu';
import ItemContextMenu, {
  clipboardDefault,
} from '../common/components/item_context_menu';
import NotFound from '../common/components/not_found';
import * as types from '../types/profilePageTypes';
import * as defaults from '../types/profilePageDefaults';
import { handleDeckOverlay } from '../common/reducers/createDeckReducer';
import {
  categoryOverlayDefaults,
  deckOverlayDefaults,
  folderOverlayDefaults,
} from '../types/overlayDefaults';
import { handleFolderOverlay } from '../common/reducers/createFolderReducer';
import { handleCategoryOverlay } from '../common/reducers/createCategoryReducer';
import EditImageOverlay, {
  editImagesDefaults,
} from '../overlays/image_overlay/edit_image/edit_image_overlay';
import { handleEditImageOverlay } from '../overlays/image_overlay/addImageReducer';
import { SideBar } from './sidebar';
import { handleDrag } from '../common/reducers/dragReducer';
import { NavbarContext, NavbarContextTypes } from '../../navbar/layout_with_navbar';
import { 
  contextMenuDefaults, 
  handleContextMenuReducer } from '../common/reducers/contextMenuReducer';
import { isProduction, serverUrl } from '../../constants';

export const ProfileContext = createContext<
  types.ProfileContextTypes | undefined
>(undefined);

export const ProfilePage: React.FC<{ dir: string }> = ({ dir }) => {
  // Rendered by main.
  const params = useParams();

  const dirId = params.dirId;
  
  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const [rootDirectory, setRootDirectory] = useState('');
  const [directory, setDirectory] = useState(() => (dirId ? dirId : dir));
  const [directoryInfo, setDirectoryInfo] = useState<types.DirInfoTypes>(
    defaults.directoryInfoDefault
  );

  const [items, setItems] = useState<React.ReactElement[]>([]);
  const [rawItems, setRawItems] = useState<types.serverItemTypes[]>([
    defaults.serverItemDefault,
  ]);
  const [reRender, setReRender] = useReducer((x) => x + 1, 0);
  const [clipboard, setClipboard] =
    useState<types.ClipboardTypes>(clipboardDefault);

  // Content fetching related states.
  const [directoryLoaded, setDirectoryLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [requestError, setRequestError] = useState<types.RequestErrorTypes>(
    defaults.requestErrorDefault
  );
  const [requestMessage, setRequestMessage] = useState<types.RequestMessageTypes>(
    defaults.requestMessageDefault
  );
  
  const [scrolling, setScrolling] = useState<ScrollingTypes>(scrollingDefault);
  const [columnNumber] = useWindowSize(directoryInfo, directoryLoaded);

  const [drag, setDrag] = useReducer(
    handleDrag,
    defaults.dragDefault
  );

  const [contextMenu, setContextMenu] = useReducer(
    handleContextMenuReducer, contextMenuDefaults
  );

  // Overlay reducers
  const [deckOverlay, setDeckOverlay] = useReducer(
    handleDeckOverlay,
    deckOverlayDefaults
  );
  const [folderOverlay, setFolderOverlay] = useReducer(
    handleFolderOverlay,
    folderOverlayDefaults
  );
  const [categoryOverlay, setCategoryOverlay] = useReducer(
    handleCategoryOverlay,
    categoryOverlayDefaults
  );
  const [editImageOverlay, setEditImageOverlay] = useReducer(
    handleEditImageOverlay,
    editImagesDefaults
  );

  let currentContainer: string;
  if (directoryInfo) {
    currentContainer =
      directoryInfo.item_type === 'thematic_folder'
        ? '.category-container'
        : '.card-container';
  }

  // Render directory.
  useEffect(() => {
    const currentDir = dirId ? dirId : dir;
    axios
      .get(`${isProduction ? serverUrl : ''}/u/${params.username}/${currentDir}`)
      .then((response) => {
        const [dirItems, dirInfo] = response.data as types.userResponse;
        const rootDirectory = dirInfo.root_id;
        setItems(generate_directory(dirInfo, dirItems, dirInfo.owner));
        setRawItems(dirItems);
        setDirectoryInfo(dirInfo);
        setRootDirectory(rootDirectory);
        const newDirectory =
          currentDir === 'home' ? rootDirectory : currentDir;
        // Clear deck creation info on directory change
        if (newDirectory !== directory) {
          setDeckOverlay({ type: 'clear', value: '' });
          setFolderOverlay({ type: 'clear', value: '' });
          setCategoryOverlay({ type: 'clear', value: '' });
          setEditImageOverlay({
            type: 'view-edit-image',
            value: 'reset',
          });
          setContextMenu({type: 'reset'});
        }
        setDirectory(dirId ? dirId : rootDirectory);

        // Load directory user picture, remove after connecting to aws
        let image = new Image();
        if (dirInfo.user_picture) {
          image.src = dirInfo.user_picture;
        } else {
          image.src = dirInfo.user_picture;
        }
        image.onload = () => {
          setDirectoryInfo(prev => ({
            ...prev,
            user_picture: image.src
          }));
        };
      })
      .then(() => {
        setDrag({type: 'reset' });
        setDirectoryLoaded(true);
      })
      .catch(() => {
        setDirectoryLoaded(false);
        setFetchError(true);
      });
    return () => {
      setRequestError({ exists: false, description: '' });
      clearTimeout(drag.cloneTimeout['timeouts']);
      setFetchError(false);
      setDrag({ type: 'reset' });
      setContextMenu({type: 'reset'});
    };
  }, [dirId, params.username, reRender]);

  // Update clone position.
  useEffect(() => {
    if (drag.draggedElement.name && drag.isDragging) {
      setDrag({type: 'cloneElement'});
    }
  }, [drag.cloneStyle, drag.draggedElement, drag.isDragging]);

  // Cancel scrolling when item is no longer dragged.
  useEffect(() => {
    if (scrolling.exists) {
      setScrolling(prev => {
        clearInterval(prev.interval);
        return scrollingDefault;
      });
    }
  }, [drag.isDragging]);

  // Reset request error when something is copied to the clipboard.
  useEffect(() => {
    setRequestError({ exists: false, description: '' });
  }, [clipboard]);

  // Set and clear scrolling interval.
  useEffect(() => {
    if (!scrolling.exists) return;
    let newInterval = window.setInterval(() => {
      scrolling.element!.scrollBy({
        top: scrolling.spec.move_by,
      });
    }, scrolling.spec.timing);
    setScrolling(prev => ({...prev, interval: newInterval}));
    return () => {
      window.clearInterval(scrolling.interval);
    };
  }, [scrolling.spec]);

  const resetDragWithTimeout = () => {
    setDrag({
      type: 'reset',
      value: true,
      innerType: 'cloneLag',
      func: () => setDrag({type: 'reset', innerType: 'cloneLag'}) });
    setTimeout(() => setDrag({type: 'reset'}), 400);
  };

  // Set 'isDragging' value to true when mouse moves.
  const handleMouseAction = (event: React.MouseEvent): void => {
    if (drag.draggedElement.name && !drag.cloneTimeout.exists) {
      if (drag.dragCount > 6) {
        if (!drag.isDragging) {
          setDrag({ type: 'firstDrag' });
        }
        setDrag({type: 'cloneStyle', value: {
          left: `${event.clientX + 5}px`,
          top: `${event.clientY + 5}px`,
          width: '140px',
          height: '120px'
        }
        });
        const scrollDiv = scroll_div(event, scrolling, window);

        if (scrollDiv) {
          const scrolledElement = document.querySelector(currentContainer)!;
          const element = event.target as HTMLDivElement;
          const sidebarElement = element.closest('.sidebar-container');
          // Stop scrolling when cursor is hovered over the sidebar.
          if (sidebarElement) {
            setScrolling(prev => {
              window.clearInterval(prev.interval);
              return scrollingDefault;
            });
            return;
          }

          if (scrollDiv === 'continue') return;
          setScrolling(prev => {
            return {
              ...prev,
              exists: true,
              element: scrolledElement,
              spec: scrollDiv
            };
          });
        } else {
          setScrolling(prev => {
            window.clearInterval(prev.interval);
            return scrollingDefault;
          });
        }
      } else {
        setDrag({ type: 'incrementDragCount' });
      }
    }
  };

  const handleMouseUp = (event: React.MouseEvent): void => {
    const element = event.target as HTMLInputElement;
    let specialClass = '';
    try {
      specialClass = element.className.split(' ')[0];
    } catch {
      return;
    }
    if (
      drag.draggedElement.name &&
      drag.isDragging &&
      !['deck', 'folder', 'filler', 'drag-button'].includes(specialClass)
    ) {
      resetDragWithTimeout();
    }
  };

  const handleMouseDown = (event: React.MouseEvent): void => {
    // Prevent unnecessary renders
    if (editImageOverlay.display || deckOverlay.display) {
      return;
    }
    const element = event.target as HTMLInputElement;
    if (element.tagName !== 'MENU') {
      setContextMenu({type: 'reset'});
    }
  };

  const handleContextMenu = (event: React.MouseEvent): void => {
    event.preventDefault();
    if (drag.isDragging) {
      return;
    }
    setContextMenu({type: 'reset'});

    const container = document.querySelector(currentContainer) as HTMLElement;
    const closestItem = find_closest_element(event, [
      '.deck',
      '.folder',
      '.thematic-folder',
      '.category',
      '.card-container',
      '.category-container',
    ]);
    const contextMenuInfo = create_context_menu(
      event, closestItem, currentUserInfo.username, directoryInfo.owner);
      
    setContextMenu({
      type: 'view',
      value: contextMenuInfo,
      extraValue: container,
      event: event
    });
  };

  const handleScroll = (event: React.UIEvent<HTMLElement>): void => {
    const element = event.target as HTMLInputElement;
    const { contextMenuScroll } = contextMenu;

    if (contextMenu.exists) {
      const scrollTop = element.scrollTop;
      let scrollDiff = Math.abs(scrollTop - contextMenuScroll.scroll);
      scrollDiff = scrollTop >= contextMenuScroll.scroll ? -scrollDiff : scrollDiff;
      setContextMenu({type: 'scrollMenu', value: contextMenuScroll.top + scrollDiff});
    }
  };

  // Children: ProfileNavBar, SideBar | (Indirect) Folder, Deck
  return (
    <ProfileContext.Provider
      value={{
        directoryPicture: directoryInfo.user_picture,
        rootDirectory: rootDirectory,
        directory: directory,
        directoryInfo: directoryInfo,
        rawItems: rawItems,
        items: items,
        setReRender: setReRender,
        clipboard: clipboard,
        setClipboard: setClipboard,
        directoryLoaded: directoryLoaded,
        fetchError: fetchError,
        requestError: requestError,
        setRequestError: setRequestError,
        requestMessage: requestMessage,
        setRequestMessage: setRequestMessage,
        drag: drag,
        setDrag: setDrag,
        resetDragWithTimeout: resetDragWithTimeout,
        columnNumber: columnNumber,
        contextMenu: contextMenu,
        setContextMenu: setContextMenu,
        handleContextMenu: handleContextMenu,
        handleScroll: handleScroll,
        deckOverlay: deckOverlay,
        setDeckOverlay: setDeckOverlay,
        folderOverlay: folderOverlay,
        setFolderOverlay: setFolderOverlay,
        categoryOverlay: categoryOverlay,
        setCategoryOverlay: setCategoryOverlay,
        editImageOverlay: editImageOverlay,
        setEditImageOverlay: setEditImageOverlay,
      }}
    >
      <div className="profile-page">
        <div
          className="profile-container"
          onMouseMove={handleMouseAction}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          {directoryLoaded && (
            <div className="profile-content">
              {directoryInfo.item_type && <SideBar />}
              {contextMenu.exists && <ItemContextMenu username={currentUserInfo.username} />}
              <Outlet />
              {!params.dirId && <CardContainer />}
            </div>
          )}
          {drag.cloneElement.exists && <DragClone
            itemName={drag.cloneElement.itemName}
            cloneStyle={drag.cloneElement.cloneStyle}
            draggedElement={drag.cloneElement.draggedElement}
          />}
          {editImageOverlay.display && <EditImageOverlay />}
          {requestError.exists && <RequestInfo
            className="request-error"
            description={requestError.description}
            exitHandler={() => setRequestError({ exists: false, description: '' })} />}
          {requestMessage.description && <RequestInfo 
            className="request-message"
            loading={requestMessage.loading}
            link={requestMessage.link}
            linkDescription={requestMessage.linkDescription}
            description={requestMessage.description}
            exitHandler={() => setRequestMessage(defaults.requestMessageDefault)}
          />}
          {fetchError && <NotFound />}
        </div>
      </div>
    </ProfileContext.Provider>
  );
};
