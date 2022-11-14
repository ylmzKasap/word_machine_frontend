import axios from 'axios';
import { useContext, useState } from 'react';
import LoadingIcon from '../../../../../assets/animations/loading_icon';
import { ProfileContext } from '../../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../../types/profilePageTypes';

export const SoundContainer: React.FC<{
  word: string;
  language: string;
  order: number;
  audioMixer: HTMLAudioElement;
}> = ({ word, language, order, audioMixer }) => {
  // Rendered by "./image_translation"
  const { setRequestError, editImageOverlay, setEditImageOverlay } =
    useContext(ProfileContext) as ProfileContextTypes;

  const [requestExists, setRequestExists] = useState(false);

  function generate_sound() {
    setRequestExists(true);
    axios
      .post('sound_generation', {
        text: word,
        language: language,
      })
      .then((res) => {
        const sound_urls = res.data.sounds;
        if (sound_urls) {
          setEditImageOverlay({
            type: 'updateSounds',
            value: sound_urls,
            index: order,
          });
          audioMixer.src = sound_urls[0].sound_path;
        } else {
          if (res.data.errDesc) {
            setRequestError({exists: true, description: res.data.errDesc});
          }
        }
        setRequestExists(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setRequestError({exists: true, description: 'Please log in to continue'});
        }
        setRequestExists(false);
      });
  }

  const handlePlay = () => {
    const audioLinks = editImageOverlay.imageInfo[order].soundRow.allSounds;
    const selectedIndex =
      editImageOverlay.imageInfo[order].soundRow.selectedIndex;
    if (audioLinks[selectedIndex]) {
      audioMixer.src = audioLinks[selectedIndex].sound_path;
      return;
    }
    generate_sound();
  };

  const handlePlusClick = () => {
    setEditImageOverlay({
      type: 'view-add-sound',
      value: 'show',
      extraValue: word,
      index: order,
    });
  };

  const handleNextSound = () => {
    const audioLinks = editImageOverlay.imageInfo[order].soundRow.allSounds;
    if (audioLinks.length === 1) {
      return;
    }
    const selectedIndex =
      editImageOverlay.imageInfo[order].soundRow.selectedIndex;
    const newSoundIndex = (selectedIndex + 1) % audioLinks.length;
    audioMixer.src = audioLinks[newSoundIndex].sound_path;
    setEditImageOverlay({ type: 'incrementSoundIndex', value: newSoundIndex, index: order });
  };

  const soundRow = editImageOverlay.imageInfo[order].soundRow;

  return (
    <div className="sound-container">
      {soundRow.allSounds[0] ? (
        <i className="fas fa-plus-circle add-sound" onClick={handlePlusClick} />
      ) : (
        ''
      )}
      {!requestExists && (
        <i className="fa-solid fa-volume-high" onClick={handlePlay}>
          {soundRow.allSounds[0] ? (
            <div className="audio-counter">
              {`${soundRow.selectedIndex + 1}/${soundRow.allSounds.length}`}
            </div>
          ) : (
            ''
          )}
        </i>
      )}
      {requestExists && <LoadingIcon elementClass="audio-loading" />}
      {soundRow.allSounds[0] ? (
        <i
          className={
            'fa-solid fa-circle-chevron-right' +
            `${
              editImageOverlay.imageInfo[order].soundRow.allSounds.length <= 1
                ? ' disabled'
                : ''
            }`
          }
          onClick={handleNextSound}
        />
      ) : (
        ''
      )}
    </div>
  );
};
