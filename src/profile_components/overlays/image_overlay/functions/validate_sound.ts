import { soundNameRegex } from '../../../common/regex';
import { ImageOverlayReducerTypes } from '../addImageReducer';

export default function validate_sound_upload(
  file: File,
  setEditImageOverlay: React.Dispatch<ImageOverlayReducerTypes>
) {
  if (!file) {
    setEditImageOverlay({
      type: 'changeUploadedSound',
      value: {
        error: 'Please upload a valid sound file',
      },
    });
    return;
  }

  if (file.size / 1000000 > 0.3) {
    setEditImageOverlay({
      type: 'changeUploadedSound',
      value: {
        error: 'File size too big ( > 300kb )',
      },
    });
    return;
  }

  if (!file.name.match(soundNameRegex)) {
    setEditImageOverlay({
      type: 'changeUploadedSound',
      value: {
        error: 'Please upload an MP3 file',
      },
    });
    return;
  }

  var sound = new Audio();

  sound.onerror = () => {
    setEditImageOverlay({
      type: 'changeUploadedSound',
      value: {
        error: 'Please upload a valid sound file',
      },
    });
  };
  sound.oncanplaythrough = () => {
    sound.play();
  };
  sound.src = URL.createObjectURL(file);
  setEditImageOverlay({
    type: 'changeUploadedSound',
    value: {
      soundUrl: sound.src,
      soundFile: file,
    },
  });
}

export interface changeUploadedSoundTypes {
  soundFile?: File;
  soundUrl?: string;
  error?: string;
  extraValue?: string; // For updating the text instantly when the overlay is displayed.
}
