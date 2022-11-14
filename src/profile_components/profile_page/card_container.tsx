import { useContext } from 'react';
import { ProfileContext } from './profile_page';
import { ProfileContextTypes } from '../types/profilePageTypes';
import { CreateDeckOverlay } from '../overlays/create_deck_overlay';
import { CreateCategoryOverlay } from '../overlays/create_category_overlay';
import { CreateFolderOverlay } from '../overlays/create_folder_overlay';

export const CardContainer: React.FC = () => {
  const { handleContextMenu, handleScroll, items,
    directoryInfo, deckOverlay, categoryOverlay, folderOverlay } =
    useContext(ProfileContext) as ProfileContextTypes;

  const containerClass =
    directoryInfo.item_type === 'thematic_folder'
      ? 'category-container'
      : 'card-container';

  return (
    <div
      className={containerClass}
      onContextMenu={handleContextMenu}
      onScroll={handleScroll}
    >
      {items}
      {items.length === 0 && (
        <h2 className="nothing-to-see">
          {directoryInfo.parent_id === null
            ? 'Nothing to see here yet...'
            : 'Folder is empty.'}
        </h2>
      )}
      {deckOverlay.display && <CreateDeckOverlay />}
      {categoryOverlay.display && <CreateCategoryOverlay />} 
      {folderOverlay.display && <CreateFolderOverlay />}
    </div>
  );
};
