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

  const { editImageOverlay } = useContext(ProfileContext) as ProfileContextTypes;
  const { targetLanguage, sourceLanguage, purpose } = editImageOverlay.deckInfo;

  return (
    <div id={`image-translation-box-${order}`}>
      {requestExists && <LoadingIcon elementClass="image-request" />}
      {(purpose === 'study' ||
        (purpose === 'learn' &&
          word[sourceLanguage!])) && (
        <Translation
          word={word}
          order={order}
          type="targetLanguage"
          setRequestExists={setRequestExists}
          setImagesToDisplay={setImagesToDisplay}
          elementClass={
            word[targetLanguage] ? undefined : 'not-found'
          }
        />
      )}
      {word[targetLanguage] && (
        <SoundContainer
          word={word[targetLanguage] as string}
          order={order}
          language={targetLanguage}
          audioMixer={audioMixer}
        />
      )}

      {(purpose === 'learn' ||
        (purpose === 'study' && word[targetLanguage] && sourceLanguage))
        && (
          <Translation
            word={word}
            order={order}
            type="sourceLanguage"
            setRequestExists={setRequestExists}
            setImagesToDisplay={setImagesToDisplay}
            elementClass={
              word[sourceLanguage!] ? undefined : 'not-found'
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
