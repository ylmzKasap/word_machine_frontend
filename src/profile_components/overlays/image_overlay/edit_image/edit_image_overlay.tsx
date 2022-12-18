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

const EditImageOverlay: React.FC<EditImageOverlayPropTypes> = ({exitHandler}) => {
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
        description={editImageOverlay.deckInfo.editing 
          ? `Edit ${editImageOverlay.deckInfo.name}`
          : 'Image control panel'}
      />
      <EditAddImageContent 
        imageInfo={editImageOverlay.imageInfo}
        exitHandler={exitHandler}
      />
    </div>
  );
};

export interface EditImageOverlayPropTypes {
  exitHandler: () => void;
}

export interface WordSoundTypes {
  sound_id: string;
  sound_path: string;
}

export interface SoundRowTypes {
  allSounds: WordSoundTypes[];
  selectedIndex: number;
}

export interface ImageRowTypes {
  image_id: string | null;
  translation_id: string | null;
  artist_content_id: string | null;
  image_path: string | null;
  selected: boolean | null;
  submitter: string | null;
  times_selected: string;
  [x: string]: boolean | string | null;
}

export interface RowTypes {
  imageRow: ImageRowTypes[];
  soundRow: SoundRowTypes;
}

export interface EditImageDeckTypes {
  id: string;
  name: string;
  targetLanguage: string;
  sourceLanguage?: string | null;
  purpose: string;
  includeTranslation: boolean;
  editing?: boolean;
}

export const editImageDeckDefaults = {
  id: '',
  name: '',
  targetLanguage: '',
  sourceLanguage: '',
  purpose: '',
  includeTranslation: false,
  editing: false
};

export const editImageCategoryDefaults = {
  id: '',
  targetLanguage: '',
  sourceLanguage: '',
  purpose: ''
};

export const editImagesDefaults = {
  display: false,
  editedId: '',
  imageOverlay: addImageDefaults,
  soundOverlay: soundOverlayDefaults,
  deckInfo: editImageDeckDefaults,
  categoryInfo: editImageCategoryDefaults,
  imageInfo: []
};

export interface EditImagesTypes {
  display: boolean;
  editedId: string;
  imageOverlay: AddImageTypes;
  soundOverlay: SoundOverlayTypes;
  deckInfo: EditImageDeckTypes;
  categoryInfo: {
    id: string;
    targetLanguage: string;
    sourceLanguage: string | null;
    purpose: string;
  }
  imageInfo: RowTypes[];
}

export default EditImageOverlay;
