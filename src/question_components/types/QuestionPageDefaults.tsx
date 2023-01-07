import { wordDefault } from '../../profile_components/types/profilePageDefaults';

export const pageDefault = [
  {
    component: null,
    type: '',
    word: wordDefault[0],
    options: [],
    order: 0,
    answered: false,
    answeredCorrectly: null
  }
];

export const optionStyleDefaults = {
  animation: '',
  numStyle: '',
};

export const wordInfoDefault = {
  words: wordDefault,
  target_language: '',
  source_language: '',
  show_translation: false
};

export const deckInfoDefault = {
  isLoaded: false,
  deck_name: '',
  category_name: '',
  root_id: '',
  directory: '',
  username: '',
  logged_in_user: null,
  correct_sound: '',
  incorrect_sound: ''
};
