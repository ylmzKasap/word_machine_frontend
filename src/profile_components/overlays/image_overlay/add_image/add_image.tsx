import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import OverlayNavbar from '../../common/components/overlay_navbar';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import { ImageUploader } from './image_uploader';
import validate_image_upload from '../functions/validate_image';
import InputField from '../../../common/form_components/input_field';
import { handleItemName } from '../../../common/form_components/handlers/handle_item_name';
import {
  artistNameRegex,
  specialCharacterRegex,
  urlRegex,
} from '../../../common/regex';
import axios from 'axios';
import SubmitForm from '../../../common/form_components/submit_form';
import { seperate_language_region } from '../../../common/functions';
import { isProduction, serverUrl } from '../../../../constants';

export const AddImageOverlay = () => {
  // Rendered by "../edit_image/edit_add_image_content".
  // If editImageOverlay.imageOverlay.display is true.

  const {
    editImageOverlay,
    setEditImageOverlay,
    setRequestError,
  } = useContext(ProfileContext) as ProfileContextTypes;

  const [submitValid, setSubmitValid] = useState(false);
  const [submitRequest, setSubmitRequest] = useState(false);
  const addMoreRef = useRef<null | HTMLDivElement>(null);
  const submitErrorRef = useRef<null | HTMLDivElement>(null);

  const { targetLanguage, sourceLanguage, purpose } = editImageOverlay.deckInfo;

  const scrollToFormError = () => {
    setTimeout(() => {
      submitErrorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }, 100);
  };

  // Find the next error when image references are changed.
  // To highlight one reference error at once.
  useEffect(() => {
    if (editImageOverlay.imageOverlay.artistReferenceError) return;
    const nextReferenceError = editImageOverlay.imageOverlay.references.find(
      (x) => x.error
    )?.error;
    if (nextReferenceError) {
      setEditImageOverlay({
        type: 'changeReferenceError',
        value: nextReferenceError,
      });
    }
  }, [editImageOverlay.imageOverlay.references]);

  // Change the apperance of submit button based on the form input.
  // To make it visible that form is ready to submit or not.
  useEffect(() => {
    const imageOverlay = editImageOverlay.imageOverlay;
    if (
      imageOverlay.imageFile &&
      !imageOverlay.target.error &&
      imageOverlay.target.value &&
      (Boolean(sourceLanguage)
        ? !imageOverlay.source.error
        : true) &&
      (Boolean(sourceLanguage)
        ? imageOverlay.source.value
        : true) &&
      !imageOverlay.artist.error &&
      imageOverlay.artist.value &&
      !imageOverlay.artistReferenceError &&
      imageOverlay.references[0].value
    ) {
      setSubmitValid(true);
    } else {
      setSubmitValid(false);
    }
  }, [editImageOverlay.imageOverlay]);

  // Set submit request to false only after the overlay is hidden.
  useEffect(() => {
    setSubmitRequest(false);
  }, [editImageOverlay.imageOverlay.display]);

  const handleTargetChange = (event: ChangeEvent) => {
    const [inputValue, inputError] = handleItemName(
      event,
      50,
      specialCharacterRegex
    );
    setEditImageOverlay({
      type: 'changeTarget',
      value: {
        value: inputValue,
        error: inputError,
      },
    });
  };

  const handleSourceChange = (event: ChangeEvent) => {
    const [inputValue, inputError] = handleItemName(
      event,
      50,
      specialCharacterRegex
    );
    setEditImageOverlay({
      type: 'changeSource',
      value: {
        value: inputValue,
        error: inputError,
      },
    });
  };

  const handleArtistChange = (event: ChangeEvent) => {
    const [inputValue, inputError] = handleItemName(event, 50, artistNameRegex);
    setEditImageOverlay({
      type: 'changeArtist',
      value: {
        value: inputValue,
        error: inputError,
      },
    });
  };

  const handleArtistReferenceChange = (event: ChangeEvent, index: number) => {
    const [inputValue, inputError] = handleItemName(event, 250, urlRegex);
    setEditImageOverlay({
      type: 'changeArtistReference',
      value: {
        value: inputValue,
        error: inputError,
      },
      index: index,
    });
  };

  const handleNewReference = () => {
    setEditImageOverlay({
      type: 'editArtistReference',
      value: 'add',
    });
    setTimeout(() => {
      addMoreRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }, 100);
  };

  const handleDrag = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const element = event.dataTransfer;
    if (element.files && element.files[0]) {
      const file = element.files[0];
      validate_image_upload(file, setEditImageOverlay, scrollToFormError);
    }
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      setEditImageOverlay({
        type: 'view-add-image',
        value: 'hide'
      });
    }
  };

  const handleSubmit =  (event: React.SyntheticEvent) => {
    event.preventDefault();

    const imageOverlay = editImageOverlay.imageOverlay;
    if (!imageOverlay.imageFile) {
      setEditImageOverlay({
        type: 'changeImageFormError',
        value: 'Select an image',
      });
      scrollToFormError();
      return;
    } else if (
      imageOverlay.target.error ||
      imageOverlay.source.error ||
      imageOverlay.artist.error ||
      imageOverlay.artistReferenceError
    ) {
      setEditImageOverlay({
        type: 'changeImageFormError',
        value: 'Fix the problem(s) highlighted in red',
      });
      scrollToFormError();
      return;
    }

    if (!submitValid || submitRequest) {
      return;
    }

    let translation_object = {
      [targetLanguage!]: imageOverlay.target.value,
      fileName: imageOverlay.target.value,
    };

    if (sourceLanguage) {
      translation_object[sourceLanguage!] =
        imageOverlay.source.value;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setSubmitRequest(true);

      await axios
        .post(`${isProduction ? serverUrl : ''}/image_upload`, {
          artist_name: imageOverlay.artist.value.toLowerCase(),
          references: imageOverlay.references.map((x) => x.value),
          image: reader.result,
          extension: imageOverlay.extension.toLowerCase(),
          translation_object: translation_object,
        }).then(async () => {
          let wordId = '';
          if (editImageOverlay.deckInfo.editing) {
            const index = editImageOverlay.imageOverlay.displayedIndex;
            const currentImages = editImageOverlay.imageInfo[index as number].imageRow;
            if (!currentImages[0].image_path) {
              await axios
                .put(`${isProduction ? serverUrl : ''}/word_change`, {
                  new_word: translation_object[targetLanguage],
                  word_id: currentImages[0].word_id ? currentImages[0].word_id : null,
                  deck_id: editImageOverlay.deckInfo.id
                })
                .then(res => {
                  if (res.data.word_id) {
                    wordId = res.data.word_id;
                  }
                })
                .catch(err => setRequestError({
                  exists: true,
                  description: err.response.data.errDesc,
                }));
            }
          }
          axios
            .post(`${isProduction ? serverUrl : ''}/image_search`, {
              word_array:
                purpose === 'learn'
                  ? [imageOverlay.source.value]
                  : [imageOverlay.target.value],
              search:
                purpose === 'learn'
                  ? sourceLanguage
                  : targetLanguage,
              target: targetLanguage,
              source: sourceLanguage || null
            })
            .then((res) => {
              setEditImageOverlay({
                type: 'changeImages',
                value: res.data[0].imageRow,
                extraValue: wordId,
                index: editImageOverlay.imageOverlay.displayedIndex as number,
              });
              setEditImageOverlay({
                type: 'view-add-image',
                value: 'reset',
              });
            });
        }).catch(err => {
          const errMessage = err.response.status === 401
            ? 'Please log in to continue' : err.response.data.errDesc;
          setRequestError({
            exists: true,
            description: errMessage,
          });
          setSubmitRequest(false);
        });
    };
    reader.readAsDataURL(editImageOverlay.imageOverlay.imageFile!);
  };

  return (
    <div
      className="input-overlay"
      onClick={handleOverlayExitByFocus}
      onDrop={handleDrop}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
    >
      <form
        id="add-image-overlay"
        className="create-item-info"
        onSubmit={handleSubmit}
      >
        <OverlayNavbar
          setOverlay={setEditImageOverlay}
          specialClass="add-image"
          description="Upload a new image"
        />
        <div id="add-image-content">
          <ImageUploader scrollToFormError={scrollToFormError} />
          <div id="add-image-info">
            <InputField
              description={seperate_language_region(targetLanguage)}
              error={editImageOverlay.imageOverlay.target.error}
              value={editImageOverlay.imageOverlay.target.value}
              handler={handleTargetChange}
              placeholder=""
            />
            {sourceLanguage && (
              <InputField
                description={seperate_language_region(sourceLanguage)}
                error={editImageOverlay.imageOverlay.source.error}
                value={editImageOverlay.imageOverlay.source.value}
                handler={handleSourceChange}
                placeholder=""
              />
            )}
            <InputField
              description="Artist:"
              error={editImageOverlay.imageOverlay.artist.error}
              value={editImageOverlay.imageOverlay.artist.value}
              handler={handleArtistChange}
              placeholder=""
            />
            <div id="artist-references">
              <label className="input-label">
                <div className="input-info no-padding">
                  Links to the artist:
                  <span className="input-error">
                    {editImageOverlay.imageOverlay.artistReferenceError}
                  </span>
                </div>
              </label>
              {editImageOverlay.imageOverlay.references.map((val, i) => (
                <div id={`artist-reference-${i}`} key={i}>
                  <InputField
                    description={''}
                    error={val.error}
                    value={val.value}
                    handler={(event) => handleArtistReferenceChange(event, i)}
                    placeholder=""
                    deleter={{
                      className: 'artist-reference',
                      display:
                        editImageOverlay.imageOverlay.references.length > 1,
                      clickHandler: () =>
                        setEditImageOverlay({
                          type: 'editArtistReference',
                          value: 'delete',
                          index: i,
                        }),
                    }}
                  />
                </div>
              ))}
              {editImageOverlay.imageOverlay.references.length < 10 && (
                <div
                  id="add-more-reference"
                  onClick={handleNewReference}
                  ref={addMoreRef}
                >
                  Add more references
                </div>
              )}
            </div>
            <SubmitForm
              description="Upload Image"
              formError={editImageOverlay.imageOverlay.formError}
              submitting={submitRequest}
              canSubmit={submitValid && !submitRequest}
              errorRef={submitErrorRef}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

type ValueWithErrorType = {
  value: string;
  error: string;
};

export const valueWithError = {
  value: '',
  error: '',
};

export interface AddImageTypes {
  display: boolean;
  displayedIndex: number | null;
  uploadType: string;
  imageUrl: string;
  imageFile: File | null;
  imageName: string;
  extension: string;
  imageLoading: boolean;
  target: ValueWithErrorType;
  source: ValueWithErrorType;
  artist: ValueWithErrorType;
  references: {
    value: string;
    error: string;
  }[];
  artistReferenceError: string;
  formError: string;
}

export const addImageDefaults = {
  display: false,
  displayedIndex: null,
  uploadType: 'from_device',
  imageUrl: '',
  imageName: '',
  extension: '',
  imageFile: null,
  imageLoading: false,
  target: valueWithError,
  source: valueWithError,
  artist: valueWithError,
  references: [
    {
      value: '',
      error: '',
    },
  ],
  artistReferenceError: '',
  formError: '',
};

export default AddImageOverlay;
