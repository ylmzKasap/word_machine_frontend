import { useContext } from 'react';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import OverlayNavbar from '../../common/components/overlay_navbar';
import { addImageDefaults, AddImageTypes } from '../add_image/add_image';
import {
  soundOverlayDefaults,
  SoundOverlayTypes,
} from '../add_sound/add_sound';
import EditAddImageContent from './edit_add_image_content';

const EditImageOverlay: React.FC = () => {
  // Rendered by "../../../profile_page" -> "ProfilePage"
  // Renders "../../../common/components/OverlayNavbar" and "EditImageContent"

  const { editImageOverlay, setEditImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleClick = (event: React.MouseEvent) => {
    // End editing process when some other element is clicked.
    const clickedElement = event.target as HTMLElement;
    const elemId = clickedElement.id;
    if (
      /^image-(target|source)-language/.test(elemId) ||
      elemId.startsWith('language-info') ||
      elemId.startsWith('image-info-input')
    ) {
      return;
    }
    if (editImageOverlay.editedId) {
      setEditImageOverlay({ type: 'changeEdited', value: '' });
    }
  };

  return (
    <div id="edit-image-overlay" onClick={handleClick}>
      <OverlayNavbar
        setOverlay={setEditImageOverlay}
        specialClass={'edit-image'}
        description="Image control panel"
      />
      <EditAddImageContent imageInfo={editImageOverlay.imageInfo} />
    </div>
  );
};

export interface SoundRowTypes {
  allSounds: {
    sound_id: string;
    sound_path: string;
  }[];
  selectedIndex: number;
}

export interface ImageRowTypes {
  image_id: string | null;
  translation_id: string | null;
  artist_content_id: string | null;
  image_path: string | null;
  selected: boolean | null;
  submitter: string | null;
  [x: string]: boolean | string | null | number;
}

export interface RowTypes {
  imageRow: ImageRowTypes[];
  soundRow: SoundRowTypes;
}

export const editImagesDefaults = {
  display: false,
  editedId: '',
  imageOverlay: addImageDefaults,
  soundOverlay: soundOverlayDefaults,
  imageInfo: [],
};

export interface EditImagesTypes {
  display: boolean;
  editedId: string;
  imageOverlay: AddImageTypes;
  soundOverlay: SoundOverlayTypes;
  imageInfo: RowTypes[];
}

export default EditImageOverlay;
