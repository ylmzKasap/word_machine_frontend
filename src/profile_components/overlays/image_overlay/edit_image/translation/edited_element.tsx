import { useState, useContext, ChangeEvent } from 'react';
import axios from 'axios';
import { ProfileContext } from '../../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../../types/profilePageTypes';
import { specialCharacterRegex } from '../../../../common/regex';
import { get_row_default } from '../../../../types/overlayDefaults';
import { ImageRowTypes } from '../edit_image_overlay';
import limits from '../../../../common/constants/limits';
import { NavbarContext, NavbarContextTypes } from '../../../../../navbar/layout_with_navbar';
import { isProduction, serverUrl } from '../../../../../constants';

const EditedElement: React.FC<EditedElementPropTypes> = ({
  elementId,
  word,
  order,
  language,
  type,
  setRequestExists,
  setImagesToDisplay,
}) => {
  // Rendered by "./translation" -> Translation
  // Renders an input element which edits the text before.

  const { currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const {
    deckOverlay,
    editImageOverlay,
    setEditImageOverlay,
    requestError,
    setRequestError,
  } = useContext(ProfileContext) as ProfileContextTypes;

  // Get the input saved by the reducer.
  const savedInput = editImageOverlay.imageInfo[order].imageRow.filter(
    (x) => x.selected === true
  )[0][language] as string;

  const [inputValue, setInputValue] = useState(savedInput ? savedInput : '');

  const handleForbidden = (inputValue: string) => {
    // Warn the user when a forbidden value is entered.
    const forbiddenCharacter = inputValue.match(specialCharacterRegex);
    if (forbiddenCharacter) {
      setRequestError({
        exists: true,
        description: `Input cannot contain '${forbiddenCharacter}'`,
      });
      return true;
    } else {
      if (requestError.exists) {
        setRequestError({ exists: false, description: '' });
      }
    }
    return false;
  };

  const handleChange = (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setInputValue(element.value);
    handleForbidden(element.value);
  };

  const focusOut = () => {
    // Save the input and make an http request to get input info if necessary.

    const { targetLanguage, sourceLanguage } = deckOverlay.language;
    const trimmedInput = inputValue.trim();

    // Reject forbidden values.
    const forbiddenInput = handleForbidden(trimmedInput);
    if (forbiddenInput) {
      setInputValue(savedInput);
      setRequestError({ exists: false, description: '' });
      return;
    }

    if (trimmedInput === savedInput) {
      return;
    }

    // Save input by the reducer.
    setEditImageOverlay({
      type: 'changeValue',
      value: trimmedInput,
      key: language,
      index: order,
    });

    // Reset the images when the input is blank.
    if (
      !trimmedInput &&
      ((type === 'targetLanguage' && deckOverlay.purpose === 'study') ||
        (type === 'sourceLanguage' && deckOverlay.purpose === 'learn'))
    ) {
      setImagesToDisplay(3);
      setEditImageOverlay({
        type: 'changeImages',
        value: [get_row_default(deckOverlay)],
        index: order,
      });
      return;
    }

    // Get the image objects form the server
    if (
      (type === 'targetLanguage' && deckOverlay.purpose === 'study') ||
      (type === 'sourceLanguage' && deckOverlay.purpose === 'learn')
    ) {
      setRequestExists(true);
      axios
        .post(`${isProduction ? serverUrl : ''}/image_search`, {
          word_array: [trimmedInput],
          search:
            deckOverlay.purpose === 'learn' ? sourceLanguage : targetLanguage,
          target: targetLanguage,
          source: sourceLanguage ? sourceLanguage : null,
        })
        .then((res) => {
          if (!res.data[0].imageRow[0].image_path) {
            setRequestExists(false);
          }
          setImagesToDisplay(3);
          setEditImageOverlay({
            type: 'changeImages',
            value: res.data[0].imageRow,
            index: order,
          });
        })
        .catch((err) => {
          setRequestError({
            exists: true,
            description: err.response.data.errDesc,
          });
          setEditImageOverlay({
            type: 'changeValue',
            value: savedInput,
            key: language,
            index: order,
          });
          setRequestExists(false);
        });
    } else if (
      trimmedInput &&
      trimmedInput !== savedInput &&
      ((type === 'sourceLanguage' && deckOverlay.purpose === 'study') ||
        (type === 'targetLanguage' && deckOverlay.purpose === 'learn'))
    ) {
      if (!word.image_path) return;
      axios
        .put(`${isProduction ? serverUrl : ''}/translation`, {
          translation_id: word.translation_id,
          language:
            type === 'sourceLanguage'
              ? deckOverlay.language.sourceLanguage
              : deckOverlay.language.targetLanguage,
          translation: trimmedInput,
        })
        .then(() => {
          setEditImageOverlay({
            type: 'changeValue',
            value: currentUserInfo.username!,
            key: type === 'sourceLanguage'
              ? `${deckOverlay.language.sourceLanguage}_submitter`
              : `${deckOverlay.language.targetLanguage}_submitter`,
            index: order,
          });
        })
        .catch((err) => {
          const errMessage = err.response.status === 401
            ? 'Please log in to continue' : err.response.data.errDesc;
          setRequestError({
            exists: true,
            description: errMessage,
          });
          setEditImageOverlay({
            type: 'changeValue',
            value: savedInput,
            key: language,
            index: order,
          });
        });
    }
  };

  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      focusOut();
      setEditImageOverlay({ type: 'changeEdited', value: '' });
    } else if (event.key === 'Escape') {
      setInputValue(savedInput);
      setEditImageOverlay({ type: 'changeEdited', value: '' });
      setRequestError({ exists: false, description: '' });
    } else if (event.key === 'Tab') {
      event.preventDefault();
      focusOut();
      if (order + 1 >= limits.image_row) {
        setEditImageOverlay({ type: 'changeEdited', value: '' });
      } else if (order + 1 < editImageOverlay.imageInfo.length) {
        const idPrefix = elementId.match(/[a-z-]+/);
        setEditImageOverlay({
          type: 'changeEdited',
          value: `${idPrefix}${order + 1}`,
        });
      } else {
        setEditImageOverlay({
          type: 'addRow',
          value: {
            imageRow: [get_row_default(deckOverlay)],
            soundRow: {
              allSounds: [],
              selectedIndex: 0,
            },
          },
        });
        setEditImageOverlay({
          type: 'changeEdited',
          value: `image-target-language-${order + 1}`,
        });
      }
    }
  };

  return (
    <input
      id={`image-info-input-${order}`}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKey}
      onFocus={(event) => event.target.select()}
      onBlur={focusOut}
      autoFocus
    />
  );
};

interface EditedElementPropTypes {
  elementId: string;
  word: ImageRowTypes;
  order: number;
  type: string;
  language: string;
  setRequestExists: React.Dispatch<React.SetStateAction<boolean>>;
  setImagesToDisplay: React.Dispatch<React.SetStateAction<number>>;
}

export default EditedElement;
