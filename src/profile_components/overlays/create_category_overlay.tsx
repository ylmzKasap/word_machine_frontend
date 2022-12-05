import React, { useContext, useState } from 'react';
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
import { handleItemName } from '../common/form_components/handlers/handle_item_name';
import { itemNameFilter } from '../common/regex';
import { isProduction, serverUrl } from '../../constants';


export const CreateCategoryOverlay: React.FC = () => {
  // Component of ProfileNavbar.

  const [submitRequest, setSubmitRequest] = useState(false);
  const {
    directory,
    setReRender,
    categoryOverlay,
    setCategoryOverlay,
  } = useContext(ProfileContext) as ProfileContextTypes;

  const handleNameChange = (event: React.ChangeEvent) => {
    const [itemName, itemNameError] = handleItemName(event, 40, itemNameFilter);
    setCategoryOverlay({ type: 'categoryName', value: itemName });
    setCategoryOverlay({
      type: 'errors',
      innerType: 'name',
      value: itemNameError,
    });
  };

  const handleLanguageChange = (event: React.SyntheticEvent) => {
    const element = event.target as HTMLInputElement;
    const field = element.name;
    const language = element.value;
    setCategoryOverlay({ type: 'language', innerType: field, value: language });
  };

  const handlePurpose = (selectedPurpose: string) => {
    setCategoryOverlay({ type: 'purpose', value: selectedPurpose });
  };

  const handleTranslationDecision = () => {
    setCategoryOverlay({ type: 'includeTranslation', value: '' });
  };

  const handleColorChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setCategoryOverlay({ type: 'color', value: element.value });
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      setCategoryOverlay(({type: 'view', value: 'hide'}));
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (categoryOverlay.errors.nameError) {
      setCategoryOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Fix the problem above',
      });
      return;
    }

    if (categoryOverlay.editing) {
      setSubmitRequest(true);
      axios
        .put(`${isProduction ? serverUrl : ''}/edit_category`, {
          item_id: categoryOverlay.categoryId,
          item_name: categoryOverlay.categoryName,
          color: categoryOverlay.color
        })
        .then(() => {
          setSubmitRequest(false);
          setCategoryOverlay(({type: 'view', value: 'hide'}));
          setReRender();
        })
        .catch((err) => {
          setSubmitRequest(false);
          setCategoryOverlay({
            type: 'errors',
            innerType: 'form',
            value: err.response.data.errDesc,
          });
        });
      return;
    }

    if (!categoryOverlay.language.targetLanguage) {
      setCategoryOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Pick a target language',
      });
    } else if (
      (categoryOverlay.purpose === 'learn' &&
        !categoryOverlay.language.sourceLanguage) ||
      (categoryOverlay.includeTranslation &&
        !categoryOverlay.language.sourceLanguage)
    ) {
      setCategoryOverlay({
        type: 'errors',
        innerType: 'form',
        value: 'Pick a source language',
      });
    } else {
      setSubmitRequest(true);
      axios
        .post(`${isProduction ? serverUrl : ''}/category`, {
          category_name: categoryOverlay.categoryName,
          parent_id: directory,
          color: categoryOverlay.color,
          target_language:
            categoryOverlay.language.targetLanguage.toLowerCase(),
          source_language: categoryOverlay.language.sourceLanguage
            ? categoryOverlay.language.sourceLanguage.toLowerCase()
            : null,
          purpose: categoryOverlay.purpose,
        })
        .then(() => {
          setCategoryOverlay({ type: 'clear', value: '' });
          setSubmitRequest(false);
          setReRender();
        })
        .catch((err) => {
          setSubmitRequest(false);
          setCategoryOverlay({
            type: 'errors',
            innerType: 'form',
            value: err.response.data.errDesc,
          });
        }
        );
    }
  };

  return (
    <div className="input-overlay" onClick={handleOverlayExitByFocus}>
      <form 
        className={`create-item-info${categoryOverlay.editing ? ' short' : ''}`}
        onSubmit={handleSubmit}>
        <OverlayNavbar
          setOverlay={setCategoryOverlay}
          description={categoryOverlay.editing ? 'Edit category' : 'Create a new category'}
        />
        <div className="form-content">
          {/* Category name */}
          <InputField
            description="Category name:"
            error={categoryOverlay.errors.nameError}
            value={categoryOverlay.categoryName}
            handler={handleNameChange}
            placeholder="Enter a category name"
          />
          {/* Purpose */}
          {!categoryOverlay.editing && <DoubleChoice
            description="I want to..."
            choice_one="learn"
            choice_two="study"
            chosen={categoryOverlay.purpose}
            handler={handlePurpose}
          />}
          {categoryOverlay.purpose && (
            <DropDown
              description=""
              handler={handleLanguageChange}
              topic="target_language"
              choices={allLanguages.filter(
                (i) => i !== categoryOverlay.language.sourceLanguage
              )}
              chosen={categoryOverlay.language.targetLanguage}
              placeholder={`Choose a language to ${categoryOverlay.purpose}`}
            />
          )}
          {/* Source language for learning */}
          {categoryOverlay.purpose === 'learn' && (
            <DropDown
              description="My language is"
              handler={handleLanguageChange}
              topic="source_language"
              choices={allLanguages.filter(
                (i) => i !== categoryOverlay.language.targetLanguage
              )}
              chosen={categoryOverlay.language.sourceLanguage}
              placeholder="Choose the language that you will enter the words"
            />
          )}
          {categoryOverlay.purpose === 'study' && (
            <Checkbox
              description="Show translations on pictures"
              handler={handleTranslationDecision}
              value={categoryOverlay.includeTranslation}
            />
          )}
          {categoryOverlay.includeTranslation && (
            <DropDown
              description=""
              handler={handleLanguageChange}
              topic="source_language"
              choices={allLanguages.filter(
                (i) => i !== categoryOverlay.language.targetLanguage
              )}
              chosen={categoryOverlay.language.sourceLanguage}
              placeholder="Choose a language to display the translations"
            />
          )}
          <label className="color-info">
            <input
              type="color"
              value={categoryOverlay.color}
              onChange={handleColorChange}
            />
            <span className="input-info">Pick a background color</span>
          </label>
          {/* Submit & Error */}
          <SubmitForm
            description={categoryOverlay.editing ? 'Save' : 'Create category'}
            formError={categoryOverlay.errors.formError}
            submitting={submitRequest}
            buttonClass={categoryOverlay.editing ? 'green' : ''}
          />
        </div>
      </form>
    </div>
  );
};
