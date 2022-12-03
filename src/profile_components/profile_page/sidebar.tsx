import axios from 'axios';
import { useContext, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isProduction, serverUrl } from '../../constants';
import { NavbarContext, NavbarContextTypes } from '../../navbar/layout_with_navbar';
import delete_item from '../common/functions/delete_item';
import { extract_int } from '../common/utils';
import { ProfileContextTypes } from '../types/profilePageTypes';
import { ProfileContext } from './profile_page';
import { SideBarItem } from './sidebar_item';

export const SideBar: React.FC = () => {
  // Component of ProfilePage.
  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const {
    directoryPicture,
    rootDirectory,
    directory,
    fetchError,
    directoryLoaded,
    directoryInfo,
    drag,
    setDrag,
    setDeckOverlay, 
    setFolderOverlay,
    setRequestError,
    setReRender,
    setCategoryOverlay } = useContext(ProfileContext) as ProfileContextTypes;

  const navigate = useNavigate();
  const [backDisplay, setBackDisplay] = useState(false);
  const userAtHome = currentUserInfo.username === directoryInfo.owner;
  const isThematic = directoryInfo.item_type === 'thematic_folder';
  const canSendBack = userAtHome && directoryLoaded && drag.isDragging 
  && drag.draggedElement.type !== 'category' && ![rootDirectory, 'home', ''].includes(directory);

  useLayoutEffect(() => {
    if (
      ![rootDirectory, 'home', ''].includes(directory) &&
      !fetchError && directoryLoaded
    ) {
      setBackDisplay(true);
    } else {
      setBackDisplay(false);
    }
  }, [directory, fetchError, directoryLoaded, rootDirectory]);

  const handleBackClick = () => {
    const prevDirectory =
      directoryInfo.parent_id === rootDirectory
        ? ''
        : `/${directoryInfo.parent_id}`;
    navigate(`/user/${directoryInfo.owner}${prevDirectory}`);
  };

  const sendBack = () => {
    // Move dragged item to parent folder.
    if (!drag.draggedElement.id) {
      return;
    }
    axios
      .put(`${isProduction ? serverUrl : ''}/file_directory`, {
        item_id: extract_int(drag.draggedElement.id),
        target_id: null,
      })
      .then(() => setReRender())
      .catch((err) =>
        setRequestError({
          exists: true,
          description: err.response.data.errDesc,
        })
      );
    setDrag({ type: 'reset' });
  };

  const destroyItem = () => {
    // Delete dragged the item.
    setDrag({ type: 'reset' });
    if (!drag.cloneTimeout.exists) {
      delete_item(drag.draggedElement, setReRender, setRequestError);
    } else {
      setDrag({ type: 'reset' });
    }
  };

  return (
    <div className="sidebar-container">
      { directoryLoaded && !userAtHome &&
        <div className="sidebar-image-container" >
          {directoryPicture && 
          <img className="sidebar-user-image" 
            src={directoryPicture}
            alt={directoryInfo.owner} />}
          <div className="sidebar-username"> {directoryInfo.owner} </div>
        </div>
      }
      {backDisplay && <SideBarItem 
        description="Go back"
        icon="fas fa-arrow-left sidebar-arrow fa-2x"
        clickHandler={drag.isDragging ? () => {} : handleBackClick}
        specialClass={drag.isDragging ? 'disabled' : 'blue'} />}
      { userAtHome && directoryLoaded && !isThematic && 
      <SideBarItem 
        description="New deck"
        icon="fa-solid fa-language fa-2x"
        clickHandler={drag.isDragging ? () => {} 
          : () => setDeckOverlay({ type: 'view', value: 'show' })}
        specialClass={drag.isDragging ? 'disabled' : ''} />}
      { userAtHome && directoryLoaded && !isThematic && 
      <SideBarItem 
        description="New folder"
        icon="fas fa-folder-plus fa-2x"
        clickHandler={drag.isDragging ? () => {} 
          : () => setFolderOverlay({ type: 'view', value: 'show' })}
        specialClass={drag.isDragging ? 'disabled' : ''} />}
      { userAtHome && directoryLoaded && isThematic && 
      <SideBarItem 
        description="New category"
        icon="fa-solid fa-book-open fa-2x"
        clickHandler={() => setCategoryOverlay({ type: 'view', value: 'show' })}
        specialClass={drag.isDragging ? 'disabled' : ''} />}
      { canSendBack &&
      <SideBarItem 
        description="Send back"
        icon="fas fa-arrow-left sidebar-arrow fa-2x"
        mouseUpHandler={sendBack}
        specialClass="bottom blue" />}
      { userAtHome && directoryLoaded && drag.isDragging && 
      <SideBarItem 
        description="Delete"
        icon="fas fa-trash-alt fa-2x"
        mouseUpHandler={destroyItem}
        specialClass={`red${!canSendBack ? ' bottom' : ''}`} />}
    </div>
  );
};
