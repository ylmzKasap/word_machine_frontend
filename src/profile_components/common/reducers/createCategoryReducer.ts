import {
  categoryOverlayDefaults,
} from '../../types/overlayDefaults';
import { CategoryOverlayTypes } from '../../types/overlayTypes';

export const handleCategoryOverlay = (
  state: CategoryOverlayTypes,
  action: { 
    type: string;
    value: string | EditCategoryActionTypes;
    innerType?: string }
): CategoryOverlayTypes => {
  switch (action.type) {
    case 'categoryName':
      return {
        ...state,
        categoryName: action.value as string,
      };

    case 'purpose':
      return {
        ...state,
        includeTranslation: false,
        purpose: action.value as string,
        language: {
          ...state.language,
          sourceLanguage: undefined,
        },
      };

    case 'includeTranslation':
      return {
        ...state,
        includeTranslation: !state.includeTranslation,
        language: {
          ...state.language,
          sourceLanguage:
            state.purpose === 'learn'
              ? state.language.sourceLanguage
              : undefined,
        },
        errors: {
          ...state.errors,
          formError: '',
        },
      };

    case 'color':
      return {
        ...state,
        color: action.value as string,
      };

    case 'errors':
      const error = action.value as string;
      switch (action.innerType) {
        case 'name':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: '',
              nameError: error ? error : '',
            },
          };
        case 'form':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: error ? error : '',
            },
          };
        default:
          console.log(`Unknown error type: ${action.innerType}`);
          return state;
      }

    case 'language':
      switch (action.innerType) {
        case 'target_language':
          return {
            ...state,
            language: {
              ...state.language,
              targetLanguage: action.value as string,
            },
          };
        case 'source_language':
          return {
            ...state,
            language: {
              ...state.language,
              sourceLanguage: action.value as string,
            },
          };
        default:
          console.log(`Unknown language type: ${action.innerType}`);
          return state;
      }

    case 'view':
      const returnObj =  (action.value === 'reset' || state.editing) 
        ? categoryOverlayDefaults : state;

      return {
        ...returnObj,
        display: action.value === 'show'
      };

    case 'edit':
      const editingData = action.value as EditCategoryActionTypes;
      return {
        ...state,
        display: true,
        editing: true,
        categoryName: editingData.itemName,
        categoryId: editingData.itemId,
        color: editingData.color
      };

    case 'clear':
      return categoryOverlayDefaults;

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

export interface EditCategoryActionTypes {
  itemName: string;
  itemId: string;
  color: string;
}
