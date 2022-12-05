import { CategoryInfoTypes } from './profilePageTypes';

export interface LanguageTypes {
  targetLanguage: string | undefined;
  sourceLanguage: string | undefined;
}

export interface DeckOverlayTypes {
  deckName: string;
  words: string;
  purpose: string;
  includeTranslation: boolean;
  errors: {
    nameError: string;
    wordError: string;
    formError: string;
  };
  language: LanguageTypes;
  categoryInfo: CategoryInfoTypes;
  display: boolean;
  editing: boolean;
  deckId?: string;
}

export interface FolderOverlayTypes {
  folderName: string;
  folderId?: string;
  folderType: string;
  errors: {
    nameError: string;
    formError: string;
  };
  display: boolean;
  editing: boolean;
}

export interface CategoryOverlayTypes {
  categoryName: string;
  categoryId: string;
  purpose: string;
  includeTranslation: boolean;
  color: string;
  language: LanguageTypes;
  errors: {
    nameError: string;
    formError: string;
  };
  display: boolean;
  editing: boolean;
}
