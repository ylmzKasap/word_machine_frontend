import {
  deckOverlayDefaults
} from '../../types/overlayDefaults';
import { DeckOverlayTypes } from '../../types/overlayTypes';
import { CategoryInfoTypes } from '../../types/profilePageTypes';

export const handleDeckOverlay = (
  state: DeckOverlayTypes,
  action: {
    type: string;
    value: string | EditDeckActionTypes;
    innerType?: string;
    categoryInfo?: CategoryInfoTypes;
  }
): DeckOverlayTypes => {
  switch (action.type) {
    case 'deckName':
      return {
        ...state,
        deckName: action.value as string,
      };

    case 'words':
      return {
        ...state,
        words: action.value as string,
        errors: {
          ...state.errors,
          formError: '',
        },
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
          sourceLanguage: state.categoryInfo.sourceLanguage
            ? state.categoryInfo.sourceLanguage
            : state.purpose === 'learn'
              ? state.language.sourceLanguage
              : undefined,
        },
        errors: {
          ...state.errors,
          formError: '',
        }
      };

    case 'switchIncludeTranslation':
      // For changing it while editing.
      return {
        ...state,
        includeTranslation: !state.includeTranslation
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
        case 'word':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: '',
              wordError: error ? error : '',
            },
          };
        case 'form':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: error
                ? error
                : '',
            },
          };
        default:
          console.log(`Unknown error type: ${action.innerType}`);
          return state;
      }

    case 'language':
      const language = action.value as string;
      switch (action.innerType) {
        case 'target_language':
          return {
            ...state,
            language: {
              ...state.language,
              targetLanguage: language.toLowerCase()
            },
          };
        case 'source_language':
          return {
            ...state,
            language: {
              ...state.language,
              sourceLanguage: language?.toLowerCase()
            },
          };
        default:
          console.log(`Unknown language type: ${action.innerType}`);
          return state;
      }

    case 'category':
      if (!action.categoryInfo) {
        console.log('categoryInfo is not defined');
        return state;
      }
      const sourceLanguage = action.categoryInfo.sourceLanguage;
      const targetLanguage = action.categoryInfo.targetLanguage;
      return {
        ...state,
        language: {
          sourceLanguage: sourceLanguage?.toLowerCase(),
          targetLanguage: targetLanguage?.toLowerCase()
        },
        includeTranslation: false,
        purpose: action.categoryInfo.purpose ? action.categoryInfo.purpose : '',
        categoryInfo: action.categoryInfo,
        display: true,
      };

    case 'view':
      const returnObj =  (action.value === 'reset' || state.editing) ? deckOverlayDefaults : state;
      return {
        ...returnObj,
        display: action.value === 'show',
      };

    case 'edit':
      const editingData = action.value as EditDeckActionTypes;
      return {
        ...state,
        display: true,
        editing: true,
        deckName: editingData.itemName,
        purpose: editingData.purpose,
        language: {
          targetLanguage: editingData.targetLanguage,
          sourceLanguage: editingData.sourceLanguage
        },
        includeTranslation: editingData.includeTranslation,
        deckId: editingData.deckId
      };

    case 'clear':
      return deckOverlayDefaults;

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

export interface EditDeckActionTypes {
  itemName: string;
  purpose: string;
  targetLanguage: string;
  sourceLanguage?: string;
  includeTranslation: boolean;
  deckId?: string;
}
