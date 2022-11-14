import {
  deckOverlayDefaults
} from '../../types/overlayDefaults';
import { DeckOverlayTypes } from '../../types/overlayTypes';
import { CategoryInfoTypes } from '../../types/profilePageTypes';

export const handleDeckOverlay = (
  state: DeckOverlayTypes,
  action: {
    type: string;
    value: string;
    innerType?: string;
    categoryInfo?: CategoryInfoTypes;
  }
): DeckOverlayTypes => {
  switch (action.type) {
    case 'deckName':
      return {
        ...state,
        deckName: action.value,
      };

    case 'words':
      return {
        ...state,
        words: action.value,
        errors: {
          ...state.errors,
          formError: '',
        },
      };

    case 'purpose':
      return {
        ...state,
        includeTranslation: false,
        purpose: action.value,
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
        },
      };

    case 'errors':
      switch (action.innerType) {
        case 'name':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: '',
              nameError: action.value ? action.value : '',
            },
          };
        case 'word':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: '',
              wordError: action.value ? action.value : '',
            },
          };
        case 'form':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: action.value
                ? action.value
                : '',
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
              targetLanguage: action.value?.toLowerCase()
            },
          };
        case 'source_language':
          return {
            ...state,
            language: {
              ...state.language,
              sourceLanguage: action.value?.toLowerCase()
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
      const returnObj = action.value === 'reset' ? deckOverlayDefaults : state;
      return {
        ...returnObj,
        display: action.value === 'show',
      };

    case 'clear':
      return deckOverlayDefaults;

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
