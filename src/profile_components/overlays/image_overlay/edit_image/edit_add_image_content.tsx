import { useContext, useEffect, useRef, useState } from 'react';
import { get_row_default } from '../../../types/overlayDefaults';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import ImageInfo from './image_info';
import AddImageOverlay from '../add_image/add_image';
import { RowTypes } from './edit_image_overlay';
import axios from 'axios';
import LoadingIcon from '../../../../assets/animations/loading_icon';
import { AddSoundOverlay } from '../add_sound/add_sound';
import limits from '../../../common/constants/limits';
import { isProduction, serverUrl } from '../../../../constants';

const EditAddImageContent: React.FC<EditAddImageContentTypes> = (props) => {
  // Rendered by "./edit_image_overlay" -> EditImageOverlay
  // Renders a list of "./image_info" -> ImageInfo components.

  const {
    editImageOverlay,
    setEditImageOverlay,
    deckOverlay,
    setDeckOverlay,
    requestError,
    setRequestError,
    directory,
    setReRender,
  } = useContext(ProfileContext) as ProfileContextTypes;

  const addMoreRef = useRef<null | HTMLDivElement>(null);
  const [errorIndex, setErrorIndex] = useState(-1);
  const [showDownArrow, setShowDownArrow] = useState(false);
  const [submitRequest, setSubmitRequest] = useState(false);

  let audioMixer = new Audio();
  audioMixer.addEventListener('canplaythrough', () => {
    audioMixer.play();
  });

  // Clear the error when user interacts with the page.
  useEffect(() => {
    setErrorIndex(-1);
  }, [editImageOverlay.imageInfo]);

  // Clear all errors when image upload page is displayed.
  useEffect(() => {
    setRequestError({ exists: false, description: '' });
    setErrorIndex(-1);
  }, [editImageOverlay.imageOverlay.display]);

  const addImageRow = () => {
    if (editImageOverlay.imageInfo.length >= limits.image_row) return;

    const rowDefault = get_row_default(deckOverlay);
    setEditImageOverlay({
      type: 'addRow',
      value: {
        imageRow: [rowDefault],
        soundRow: {
          allSounds: [],
          selectedIndex: 0,
        },
      },
    });
    setTimeout(() => {
      addMoreRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }, 100);
  };

  const handleScroll = (event: React.UIEvent) => {
    const elem = event.target as HTMLDivElement;
    if (
      Math.floor(elem.scrollTop + elem.clientHeight) >
      elem.scrollHeight - 100
    ) {
      if (showDownArrow) {
        setShowDownArrow(false);
      }
    } else {
      if (!showDownArrow) {
        setShowDownArrow(true);
      }
    }
  };

  const handleScrollDown = () => {
    addMoreRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'start',
    });
  };

  const handleSubmit = () => {
    if (submitRequest) return;
    const allImages = editImageOverlay.imageInfo;
    let selectedImages = [];
    let problem = '';

    if (editImageOverlay.imageInfo.length === 0) {
      setRequestError({
        exists: true,
        description: `Include at least one word to ${deckOverlay.purpose}`
      });
      return;
    }

    for (let i = 0; i < allImages.length; i++) {
      let selectedImage = allImages[i].imageRow.filter((x) => x.selected)[0];
      let selectedSound = allImages[i].soundRow.allSounds[0]
        ? allImages[i].soundRow.allSounds[allImages[i].soundRow.selectedIndex].sound_id
        : false;
      selectedImage['sound_id'] = selectedSound ? selectedSound : 'default';
      if (!selectedImage.image_path) {
        problem = 'Image missing';
      } else if (!selectedImage[deckOverlay.language.targetLanguage!]) {
        problem = 'Target language translation missing';
      } else if (
        deckOverlay.language.sourceLanguage &&
        !selectedImage[deckOverlay.language.sourceLanguage]
      ) {
        problem = 'Source language translation missing';
      }
      if (problem) {
        setErrorIndex(i);
        if (i >= 0) {
          const rowToScroll = document.querySelector(`#edit-image-box-${i}`);
          rowToScroll?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
          });
        }
        setRequestError({
          exists: true,
          description: `Row ${i + 1}: ${problem}`,
        });
        return;
      } else {
        setErrorIndex(-1);
        if (requestError.exists) {
          setRequestError({ exists: false, description: '' });
        }
      }
      selectedImages.push(selectedImage);
    }

    setSubmitRequest(true);
    axios
      .post(`${isProduction ? serverUrl : ''}/deck`, {
        deck_name: deckOverlay.deckName,
        selected_ids: selectedImages.map((i) => ({
          image_id: i.image_id,
          translation_id: i.translation_id,
          sound_id: i.sound_id,
          text: i[deckOverlay.language.targetLanguage!],
        })),
        parent_id: directory,
        category_id: deckOverlay.categoryInfo.id
          ? deckOverlay.categoryInfo.id
          : null,
        target_language: deckOverlay.categoryInfo.id
          ? deckOverlay.categoryInfo.targetLanguage
          : deckOverlay.language.targetLanguage!.toLowerCase(),
        source_language: deckOverlay.categoryInfo.id
          ? deckOverlay.categoryInfo.sourceLanguage
            ? deckOverlay.categoryInfo.sourceLanguage!.toLocaleLowerCase()
            : null
          : deckOverlay.language.sourceLanguage
            ? deckOverlay.language.sourceLanguage.toLowerCase()
            : null,
        show_translation: deckOverlay.includeTranslation,
        purpose: deckOverlay.purpose,
      })
      .then(() => {
        setEditImageOverlay({ type: 'view-edit-image', value: 'reset' });
        setDeckOverlay({ type: 'view', value: 'reset' });
        setReRender();
      })
      .catch((err) => {
        setSubmitRequest(false);
        setRequestError({
          exists: true,
          description: err.response.data.errDesc,
        });
      });
  };

  return (
    <div id="edit-image-content" onScroll={handleScroll}>
      {props.imageInfo.map((arr, i) => (
        <ImageInfo
          rowArray={arr}
          order={i}
          key={`image-content-${i}`}
          errorIndex={errorIndex}
          audioMixer={audioMixer}
        />
      ))}
      <div
        id="edit-image-row"
        className={
          editImageOverlay.imageInfo.length < limits.image_row
            ? undefined
            : 'disabled'
        }
        ref={addMoreRef}
        onClick={addImageRow}
      >
        {editImageOverlay.imageInfo.length < limits.image_row
          ? 'Add more'
          : 'Deck limit reached'}
      </div>
      <button
        id="create-deck-button"
        className={`submit-form-button${submitRequest ? ' submitting' : ''}`}
        type="button"
        onClick={handleSubmit}
      >
        {!submitRequest && (
          <div className="submit-description">Create deck</div>
        )}
        {submitRequest && <LoadingIcon elementClass="submitting" />}
      </button>
      {showDownArrow && (
        <i
          className="fa-solid fa-circle-chevron-down fa-2x"
          onClick={handleScrollDown}
        />
      )}
      {editImageOverlay.imageOverlay.display && <AddImageOverlay />}
      {editImageOverlay.soundOverlay.display && <AddSoundOverlay />}
    </div>
  );
};

interface EditAddImageContentTypes {
  imageInfo: RowTypes[];
}

export default EditAddImageContent;
