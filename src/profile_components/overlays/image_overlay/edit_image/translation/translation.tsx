import { useContext } from 'react';
import { NavbarContext, NavbarContextTypes } from '../../../../../navbar/layout_with_navbar';
import { ProfileContext } from '../../../../profile_page/profile_page';
import { LanguageTypes } from '../../../../types/overlayTypes';
import { ProfileContextTypes } from '../../../../types/profilePageTypes';
import { ImageRowTypes } from '../edit_image_overlay';
import EditedElement from './edited_element';

const Translation: React.FC<TranslationTypes> = ({
  word,
  order,
  type,
  setRequestExists,
  setImagesToDisplay,
  elementClass = undefined,
}) => {
  // Rendered by "./image_translation" -> ImageTranslation
  // Renders translation divs and "EditedElement" if it exists.

  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const { editImageOverlay, setEditImageOverlay } =
    useContext(ProfileContext) as ProfileContextTypes;

  const { sourceLanguage, targetLanguage, purpose } = editImageOverlay.deckInfo;

  // Id depends on the type of the translation box.
  const componentId =
    type === 'sourceLanguage'
      ? `image-source-language-${order}`
      : `image-target-language-${order}`;

  // Class is either 'image-info-edited', 'editable', 'not-found' or null.
  let componentClass;
  if (editImageOverlay.editedId === componentId) {
    componentClass = 'image-info-edited';
  } else if (
    type === 'sourceLanguage' &&
    purpose === 'learn' &&
    elementClass !== 'not-found'
  ) {
    componentClass = 'editable';
  } else if (
    type === 'targetLanguage' &&
    purpose === 'study' &&
    elementClass !== 'not-found'
  ) {
    componentClass = 'editable';
  } else {
    componentClass = elementClass;
  }

  const handleClick = () => {
    // Discard edited element when non-editable source is clicked.
    if (
      type === 'targetLanguage' &&
      purpose !== 'study' &&
      word.image_path
    ) {
      if (
        word[`${targetLanguage}_submitter`] !== currentUserInfo.username &&
        word[targetLanguage]
      ) {
        setEditImageOverlay({ type: 'changeEdited', value: '' });
        return;
      }
    } else if (
      type === 'sourceLanguage' &&
      purpose !== 'learn' &&
      word.image_path
    ) {
      if (
        word[`${sourceLanguage}_submitter`] !== currentUserInfo.username &&
        word[sourceLanguage!]
      ) {
        setEditImageOverlay({ type: 'changeEdited', value: '' });
        return;
      }
    }
    setEditImageOverlay({ type: 'changeEdited', value: componentId });
  };

  const languageBase = editImageOverlay.deckInfo[type as keyof LanguageTypes]?.split('_');

  return (
    <div id={componentId} className={componentClass} onClick={handleClick}>
      {editImageOverlay.editedId === componentId ? (
        <EditedElement
          elementId={componentId}
          word={word}
          order={order}
          type={type}
          language={editImageOverlay.deckInfo[type as keyof LanguageTypes]!}
          setRequestExists={setRequestExists}
          setImagesToDisplay={setImagesToDisplay}
        />
      ) : componentClass === 'not-found' ? (
        'add translation'
      ) : (
        word[editImageOverlay.deckInfo[type as keyof LanguageTypes]!]
      )}
      {componentClass === 'not-found' &&
      editImageOverlay.editedId !== componentId ? (
          <div id={`language-info-${order}`}>
          (
            {`${languageBase ? languageBase[0] : ''}` +
            `${
              languageBase
                ? languageBase[1]
                  ? ` - ${languageBase[1].toUpperCase()}`
                  : ''
                : ''
            }`}
          )
          </div>
        ) : (
          ''
        )}
    </div>
  );
};

interface TranslationTypes {
  word: ImageRowTypes;
  order: number;
  type: string;
  setRequestExists: React.Dispatch<React.SetStateAction<boolean>>;
  elementClass: string | undefined;
  setImagesToDisplay: React.Dispatch<React.SetStateAction<number>>;
}

export default Translation;
