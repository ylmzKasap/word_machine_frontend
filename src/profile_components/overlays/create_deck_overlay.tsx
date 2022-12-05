import React, { useContext, useState, useRef } from 'react';
import axios from 'axios';

import { ProfileContext } from '../profile_page/profile_page';
import OverlayNavbar from './common/components/overlay_navbar';
import InputField from '../common/form_components/input_field';
import Checkbox from '../common/form_components/checkbox';
import DropDown from '../common/form_components/dropdown';
import DoubleChoice from '../common/form_components/double_choice';
import SubmitForm from '../common/form_components/submit_form';
import allLanguages from '../common/constants/all_languages';
import { ProfileContextTypes } from '../types/profilePageTypes';
import { itemNameFilter, specialCharacterRegex } from '../common/regex';
import { handleItemName } from '../common/form_components/handlers/handle_item_name';
import limits from '../common/constants/limits';
import { seperate_language_region } from '../common/functions';
import { isProduction, serverUrl } from '../../constants';


export const CreateDeckOverlay: React.FC = () => {
  // Component of ProfileNavbar.

  const [submitRequest, setSubmitRequest] = useState(false);
  const submitErrorRef = useRef<null | HTMLDivElement>(null);

  const {
    setReRender,
    deckOverlay,
    setDeckOverlay,
    setEditImageOverlay
  } = useContext(ProfileContext) as ProfileContextTypes;

  const handleNameChange = (event: React.ChangeEvent) => {
    const [itemName, itemNameError] = handleItemName(event, 40, itemNameFilter);
    setDeckOverlay({ type: 'deckName', value: itemName });
    setDeckOverlay({ type: 'errors', innerType: 'name', value: itemNameError });
  };

  const handlePurpose = (selectedPurpose: string) => {
    setDeckOverlay({ type: 'purpose', value: selectedPurpose });
  };

  const handleWordChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    const wordLength = element.value.split('\n').filter((x) => x.trim()).length;
    if (wordLength > limits.image_row) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'word',
        value: `Word limit: ${wordLength} > ${limits.image_row}`,
      });
    } else if (specialCharacterRegex.test(element.value)) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'word',
        value: `Forbidden character ' ${element.value.match(
          specialCharacterRegex
        )} '`,
      });
    } else {
      setDeckOverlay({ type: 'errors', innerType: 'word', value: '' });
    }
    setDeckOverlay({ type: 'words', value: element.value });
  };

  const handleLanguageChange = (event: React.SyntheticEvent) => {
    const element = event.target as HTMLInputElement;
    const field = element.name;
    const language = element.value;
    setDeckOverlay({ type: 'language', innerType: field, value: language });
  };

  const handleTranslationDecision = () => {
    setDeckOverlay({ type: 'includeTranslation', value: '' });
  };

  const scrollToFormError = () => {
    setTimeout(() => {
      submitErrorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }, 100);
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    
    if (element.className === 'input-overlay') {
      setDeckOverlay(({type: 'view', value: 'hide'}));
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (deckOverlay.errors.nameError) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Fix the problem above',
      });
      return;
    }

    if (deckOverlay.editing) {
      setSubmitRequest(true);
      axios
        .put(`${isProduction ? serverUrl : ''}/edit_deck`, {
          item_id: deckOverlay.deckId,
          item_name: deckOverlay.deckName,
          show_translation: deckOverlay.includeTranslation
        })
        .then(() => {
          setSubmitRequest(false);
          setDeckOverlay(({type: 'view', value: 'hide'}));
          setReRender();
        })
        .catch((err) => {
          setSubmitRequest(false);
          setDeckOverlay({
            type: 'errors',
            innerType: 'form',
            value: err.response.data.errDesc,
          });
          scrollToFormError();  
        });
      return;
    }

    let allWords = deckOverlay.words
      .split('\n')
      .map((x) => x.trim())
      .filter((word) => word !== '')
      .filter((word) => !word.match(/^[\s]+$/));

    if (!deckOverlay.language.targetLanguage && !deckOverlay.categoryInfo.id) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Pick a target language',
      });
      scrollToFormError();
    } else if (
      (deckOverlay.purpose === 'learn' &&
        !deckOverlay.language.sourceLanguage &&
        !deckOverlay.categoryInfo.id) ||
      (deckOverlay.includeTranslation && !deckOverlay.language.sourceLanguage)
    ) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Pick a source language',
      });
      scrollToFormError();
    } else if (deckOverlay.errors.wordError) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Fix the problem(s) above',
      });
      scrollToFormError();
    } else if (allWords.length === 0) {
      setDeckOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Enter at least one word',
      });
      scrollToFormError();
    } else if (deckOverlay.words === '') {
      setDeckOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Enter a deck name',
      });
      scrollToFormError();
    } else {
      
      setSubmitRequest(true);
      axios
        .post(`${isProduction ? serverUrl : ''}/image_search`, {
          word_array: allWords,
          search:
            deckOverlay.purpose === 'study'
              ? deckOverlay.language.targetLanguage
              : deckOverlay.language.sourceLanguage,
          target: deckOverlay.language.targetLanguage,
          source: deckOverlay.language.sourceLanguage
            ? deckOverlay.language.sourceLanguage
            : null,
        })
        .then((res) => {
          setEditImageOverlay({ type: 'setImages', value: res.data });
          setSubmitRequest(false);
          setReRender();
        })
        .catch((err) => {
          setSubmitRequest(false);
          setDeckOverlay({
            type: 'errors',
            innerType: 'form',
            value: err.response.data.errDesc,
          });
          scrollToFormError();  
        });
    }
  };

  const { targetLanguage, sourceLanguage } = deckOverlay.language;

  // Children: OverlayNavbar.
  return (
    <div className="input-overlay" onClick={handleOverlayExitByFocus}>
      <form className={`create-item-info${deckOverlay.editing ? ' short' : ''}`}
        onSubmit={handleSubmit}>
        <OverlayNavbar
          setOverlay={setDeckOverlay}
          description={deckOverlay.editing ? 'Edit deck' : 'Create a new deck'}
        />
        <div className="form-content">
          {/* Deck name */}
          <InputField
            description="Deck Name:"
            error={deckOverlay.errors.nameError}
            value={deckOverlay.deckName}
            handler={handleNameChange}
            placeholder="Enter a deck name"
          />
          {/* Purpose */}
          {!deckOverlay.categoryInfo.id && !deckOverlay.editing && (
            <DoubleChoice
              description="I want to..."
              choice_one="learn"
              choice_two="study"
              chosen={deckOverlay.purpose}
              handler={handlePurpose}
            />
          )}
          {!deckOverlay.categoryInfo.id && deckOverlay.purpose && !deckOverlay.editing && (
            <DropDown
              description=""
              handler={handleLanguageChange}
              topic="target_language"
              choices={allLanguages.filter(
                (i) => i !== deckOverlay.language.sourceLanguage
              )}
              chosen={deckOverlay.language.targetLanguage}
              placeholder={`Choose a language to ${deckOverlay.purpose}`}
            />
          )}
          {/* Source language for learning */}
          {!deckOverlay.categoryInfo.id && deckOverlay.purpose === 'learn'
           && !deckOverlay.editing && (
            <DropDown
              description="My language is"
              handler={handleLanguageChange}
              topic="source_language"
              choices={allLanguages.filter(
                (i) => i !== deckOverlay.language.targetLanguage
              )}
              chosen={deckOverlay.language.sourceLanguage}
              placeholder="Choose the language that you will enter the words"
            />
          )}
          {/* Words */}
          {((deckOverlay.purpose === 'study' && targetLanguage) ||
            (deckOverlay.purpose === 'learn' && sourceLanguage && targetLanguage) ||
            deckOverlay.categoryInfo.id) && !deckOverlay.editing && (
            <label className="input-label">
              <div className="input-info">
                {deckOverlay.purpose === 'study'
                  ? `${seperate_language_region(targetLanguage!)}
                  words that I will study`
                  : `${seperate_language_region(sourceLanguage!)}
                  words that I want to learn in
                  ${seperate_language_region(targetLanguage!)}`}
                  :
                <span className="input-error">
                  {deckOverlay.errors.wordError}
                </span>
              </div>
              <textarea
                className={`word-input ${
                  deckOverlay.errors.wordError ? 'forbidden-input' : ''
                }`}
                value={deckOverlay.words}
                onChange={handleWordChange}
                placeholder="Enter a word for each line"
                required
              />
            </label>
          )}
          {((deckOverlay.purpose === 'study' &&
            (deckOverlay.categoryInfo.id ? sourceLanguage : true)) ||
            (deckOverlay.purpose === 'learn' && sourceLanguage)) && (
            <Checkbox
              description="Show translations on pictures"
              handler={handleTranslationDecision}
              value={deckOverlay.includeTranslation}
            />
          )}
          {!deckOverlay.categoryInfo.id &&
            deckOverlay.purpose === 'study' &&
            deckOverlay.includeTranslation &&
            !deckOverlay.editing && (
            <DropDown
              description=""
              handler={handleLanguageChange}
              topic="source_language"
              choices={allLanguages.filter(
                (i) => i !== deckOverlay.language.targetLanguage
              )}
              chosen={deckOverlay.language.sourceLanguage}
              placeholder="Choose a language to display the translations"
            />
          )}
          {/* Submit & Error */}
          <SubmitForm
            description={deckOverlay.editing ? 'Save' : 'Search pictures'}
            formError={deckOverlay.errors.formError}
            submitting={submitRequest}
            errorRef={submitErrorRef}
            buttonClass={deckOverlay.editing ? 'green' : ''}
          />
        </div>
      </form>
    </div>
  );
};
