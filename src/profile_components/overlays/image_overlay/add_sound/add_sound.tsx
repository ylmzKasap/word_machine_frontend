import axios from 'axios';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import SubmitForm from '../../../common/form_components/submit_form';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import InputFile from '../../common/components/input_file';
import OverlayNavbar from '../../common/components/overlay_navbar';
import validate_sound_upload from '../functions/validate_sound';
import UploadedSound from './uploaded_sound';
import { seperate_language_region } from '../../../common/functions';

export const AddSoundOverlay: React.FC = () => {
  const [submitValid, setSubmitValid] = useState(false);
  const [submitRequest, setSubmitRequest] = useState(false);

  const {
    editImageOverlay,
    deckOverlay,
    setRequestError,
    setEditImageOverlay,
  } = useContext(ProfileContext) as ProfileContextTypes;

  useEffect(() => {
    const soundOverlay = editImageOverlay.soundOverlay;
    if (soundOverlay.soundFile && soundOverlay.soundText) {
      setSubmitValid(true);
    } else {
      setSubmitValid(false);
    }
  }, [editImageOverlay.soundOverlay]);

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
      validate_sound_upload(file, setEditImageOverlay);
    }
  };

  const handleChange = (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const file = element.files[0];
      validate_sound_upload(file, setEditImageOverlay);
    }
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      setEditImageOverlay({
        type: 'view-add-sound',
        value: 'hide'
      });
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!submitValid || submitRequest) {
      return;
    }

    if (!editImageOverlay.soundOverlay.soundFile) {
      setEditImageOverlay({
        type: 'changeUploadedSound',
        value: 'Select a sound',
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubmitRequest(true);
      axios
        .post('/sound_upload', {
          text: editImageOverlay.soundOverlay.soundText,
          language: deckOverlay.language.targetLanguage,
          sound_file: reader.result,
        })
        .then(() => {
          setEditImageOverlay({
            type: 'view-add-sound',
            value: 'reset',
          });
          axios
            .post('sound_generation', {
              text: editImageOverlay.soundOverlay.soundText,
              language: deckOverlay.language.targetLanguage,
            })
            .then((res) => {
              const sound_urls = res.data.sounds;
              if (sound_urls) {
                setEditImageOverlay({
                  type: 'updateSounds',
                  value: sound_urls,
                  index: parseInt(editImageOverlay.soundOverlay.soundToReload),
                });
              } else {
                if (res.data.errDesc) {
                  setRequestError({exists: true, description: res.data.errDesc});
                }
                setSubmitRequest(false);
              }
            });
        })
        .catch(err => {
          const errMessage = err.response.status === 401
            ? 'Please log in to continue' : err.response.data.errDesc;
          setSubmitRequest(false);
          setRequestError({exists: true, description: errMessage});
        });
    };
    reader.readAsDataURL(editImageOverlay.soundOverlay.soundFile);
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
        id="add-sound-overlay"
        className="create-item-info"
        onSubmit={handleSubmit}
      >
        <OverlayNavbar
          setOverlay={setEditImageOverlay}
          specialClass="add-sound"
          description="Upload a new sound"
        />
        <UploadedSound />
        <InputFile
          id="sound-upload"
          elemClass="hidden-upload"
          acceptType="audio/mp3"
          handleChange={handleChange}
        />
        <div className="form-box">
          <div className="form-box-info">
            {seperate_language_region(deckOverlay.language.targetLanguage!)}:
            <span className="form-box-value">
              {editImageOverlay.soundOverlay.soundText}
            </span>
          </div>
        </div>
        <SubmitForm
          description="Upload Sound"
          formError={editImageOverlay.soundOverlay.formError}
          submitting={submitRequest}
          canSubmit={submitValid && !submitRequest}
        />
      </form>
    </div>
  );
};

export const soundOverlayDefaults = {
  display: false,
  soundFile: null,
  soundUrl: '',
  soundText: '',
  formError: '',
  soundToReload: '',
};

export interface SoundOverlayTypes {
  display: boolean;
  soundFile: File | null;
  soundUrl: string;
  soundText: string;
  formError: string;
  soundToReload: string;
}
