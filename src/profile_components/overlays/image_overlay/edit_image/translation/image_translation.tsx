import { useContext } from 'react';
import { ProfileContext } from '../../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../../types/profilePageTypes';
import LoadingIcon from '../../../../../assets/animations/loading_icon';
import Translation from './translation';
import { ImageRowTypes } from '../edit_image_overlay';
import { SoundContainer } from './sound_container';

const ImageTranslation: React.FC<ImageTranslationTypes> = ({
  word,
  order,
  requestExists,
  setRequestExists,
  setImagesToDisplay,
  audioMixer,
}) => {
  // Rendered by "../image_info" -> ImageInfo
  // Renders two "./translation" -> Translation components
  // One as the target and one as the source language.

  const { deckOverlay } = useContext(ProfileContext) as ProfileContextTypes;

  return (
    <div id={`image-translation-box-${order}`}>
      {requestExists && <LoadingIcon elementClass="image-request" />}
      {(deckOverlay.purpose === 'study' ||
        (deckOverlay.purpose === 'learn' &&
          word[deckOverlay.language.sourceLanguage!])) && (
        <Translation
          word={word}
          order={order}
          type="targetLanguage"
          setRequestExists={setRequestExists}
          setImagesToDisplay={setImagesToDisplay}
          elementClass={
            word[deckOverlay.language.targetLanguage!] ? undefined : 'not-found'
          }
        />
      )}
      {word[deckOverlay.language.targetLanguage!] && (
        <SoundContainer
          word={word[deckOverlay.language.targetLanguage!] as string}
          order={order}
          language={deckOverlay.language.targetLanguage!}
          audioMixer={audioMixer}
        />
      )}

      {(deckOverlay.purpose === 'learn' ||
        (deckOverlay.purpose === 'study' &&
          word[deckOverlay.language.targetLanguage!] &&
          deckOverlay.language.sourceLanguage)) && (
        <Translation
          word={word}
          order={order}
          type="sourceLanguage"
          setRequestExists={setRequestExists}
          setImagesToDisplay={setImagesToDisplay}
          elementClass={
            word[deckOverlay.language.sourceLanguage!] ? undefined : 'not-found'
          }
        />
      )}
    </div>
  );
};

interface ImageTranslationTypes {
  word: ImageRowTypes;
  order: number;
  requestExists: boolean;
  setRequestExists: React.Dispatch<React.SetStateAction<boolean>>;
  setImagesToDisplay: React.Dispatch<React.SetStateAction<number>>;
  audioMixer: HTMLAudioElement;
}

export default ImageTranslation;
