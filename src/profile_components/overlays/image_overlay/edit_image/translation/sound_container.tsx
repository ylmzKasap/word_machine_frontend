import axios from 'axios';
import { useContext, useState } from 'react';
import LoadingIcon from '../../../../../assets/animations/loading_icon';
import { isProduction, serverUrl } from '../../../../../constants';
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

  async function generate_sound() {
    setRequestExists(true);

    let sound_id = '';
    if (editImageOverlay.deckInfo.editing) {
      const currentRow = editImageOverlay.imageInfo[order];
      await axios
        .post(`${isProduction ? serverUrl : ''}/word_sound_search`, {
          word_id: currentRow.imageRow[0].word_id
        }).then((res) => {
          sound_id = res.data.sound_id;
        }).catch(() => null);
    }

    axios
      .post(`${isProduction ? serverUrl : ''}/sound_generation`, {
        text: word,
        language: language,
      })
      .then((res) => {
        const sound_urls = res.data.sounds;
        let selectedSound = 0;
        if (sound_urls) {
          if (editImageOverlay.deckInfo.editing) {
            if (!sound_id) {
              sound_id = sound_urls[0].sound_id;
            }
            for (let i = 0; i < sound_urls.length; i++) {
              if (sound_urls[i].sound_id === sound_id) {
                selectedSound = i;
                break;
              }
            }
          }
          
          setEditImageOverlay({
            type: 'updateSounds',
            value: sound_urls,
            index: order,
            extraValue: selectedSound
          });
          audioMixer.src = sound_urls[selectedSound].sound_path;
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
     
    const incrementIndex = () => setEditImageOverlay(
      { type: 'incrementSoundIndex', value: newSoundIndex, index: order });

    if (editImageOverlay.deckInfo.editing) {
      const currentRow = editImageOverlay.imageInfo[order];
      const newSoundId = currentRow.soundRow.allSounds[newSoundIndex].sound_id;
      axios
        .put(`${isProduction ? serverUrl : ''}/sound_change`, {
          word_id: currentRow.imageRow[0].word_id,
          sound_id: newSoundId,
        })
        .then(() => {
          audioMixer.src = audioLinks[newSoundIndex].sound_path;
          incrementIndex();
        })
        .catch((err) =>  setRequestError({
          exists: true,
          description: err.response.data.errDesc,
        }));
    } else {
      audioMixer.src = audioLinks[newSoundIndex].sound_path;
      incrementIndex();
    }
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
