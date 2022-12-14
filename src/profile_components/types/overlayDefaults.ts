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
  approval_id: '',
  translation_id: '',
  artist_content_id: '',
  image_id: '',
  image_path: '',
  image_approved: false,
  selected: true,
  times_selected: '0',
  submitted_by: '',   
  [targetLanguage]: '',
  [sourceLanguage ? sourceLanguage : 'source_language']: ''
});
