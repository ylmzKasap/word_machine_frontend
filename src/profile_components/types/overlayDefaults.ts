import { categoryInfoDefault } from './profilePageDefaults';

export const deckErrorDefault = {
  nameError: '',
  wordError: '',
  formError: '',
};

export const folderErrorDefault = {
  nameError: '',
  formError: '',
};

export const categoryErrorDefault = {
  nameError: '',
  formError: '',
};

export const languageDefault = {
  targetLanguage: '',
  targetStem: '',
  targetRegion: '',
  sourceLanguage: '',
  sourceStem: '',
  sourceRegion: '',
};

export const deckOverlayDefaults = {
  deckName: '',
  deckId: '',
  words: '',
  purpose: '',
  includeTranslation: false,
  errors: deckErrorDefault,
  language: languageDefault,
  categoryInfo: categoryInfoDefault,
  display: false,
  editing: false
};

export const folderOverlayDefaults = {
  folderName: '',
  folderId: '',
  folderType: 'Regular folder',
  errors: folderErrorDefault,
  display: false,
  editing: false
};

export const categoryOverlayDefaults = {
  categoryName: '',
  categoryId: '',
  purpose: '',
  includeTranslation: false,
  color: '#bbbbbb',
  language: languageDefault,
  errors: categoryErrorDefault,
  display: false,
  editing: false
};

export const get_row_default = (targetLanguage: string, sourceLanguage?: string | null) => ({
  artist_content_id: null,
  image_id: null,
  translation_id: null,
  image_path: null,
  [targetLanguage]: null,
  [sourceLanguage ? sourceLanguage : 'source_language']: null,
  times_selected: '0',
  selected: true,
  submitter: null,
});
