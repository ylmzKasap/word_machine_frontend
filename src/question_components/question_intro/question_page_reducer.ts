import { cache_question_audio, cache_question_image, generate_pages } from '../common/handlers';
import { randint } from '../common/utils';
import { DeckResponseTypes } from '../types/QuestionPageTypes';
import { QuestionPageTypes } from './question_intro';

export const handleQuestionPage = (
  state: QuestionPageTypes,
  action: {
    type: string,
    value?: string | boolean | DeckResponseTypes
  }
): QuestionPageTypes => {
  switch (action.type) {
    case 'view':
      return {
        ...state,
        view: action.value as string,
        correctFound: false
      };

    case 'setDeckData':
      const response = action.value as DeckResponseTypes;

      const wordInfo = {
        words: response.words,
        target_language: response.target_language,
        source_language: response.source_language,
        show_translation: response.show_translation
      };

      const questionPages = generate_pages(wordInfo);
      cache_question_image(questionPages, 0, 1);
      cache_question_audio(questionPages, 0, 1);

      return {
        ...state,
        view: 'introduction',
        wordInfo: wordInfo,
        deckInfo: {
          isLoaded: true,
          showLoading: false,
          deck_name: response.deck_name,
          root_id: response.root_id,
          directory: response.directory,
          username: response.username,
          logged_in_user: response.logged_in_user,
          correct_sound: response.correct_sound,
          incorrect_sound: response.incorrect_sound
        },
        pages: questionPages
      };

    case 'startQuestion':
      return {
        ...state,
        view: 'question',
        pageNumber: 0,
        progress: 0,
        pages: generate_pages(state.wordInfo),
        correctFound: false
      };

    case 'goBack':
      return {
        ...state,
        pageNumber: state.pageNumber - 1,
        childAnimation: state.childAnimation === 'load-page' ? 'load-page-2' : 'load-page',
        progress: ((state.pageNumber - 1) * 110) / state.pages.length + 5
      };

    case 'goForward':
      return {
        ...state,
        pageNumber: state.pageNumber + 1,
        childAnimation: state.childAnimation === 'load-page' ? 'load-page-2' : 'load-page',
        progress: ((state.pageNumber + 1) * 110) / state.pages.length + 5
      };

    case 'showLoading':
      return {
        ...state,
        deckInfo: {
          ...state.deckInfo,
          showLoading: action.value === 'true'
        }
      };

    case 'insertRevision':
      let restOfPages = state.pages.slice(state.pageNumber + 1);
      let currentPage = state.pages[state.pageNumber];

      for (let i = 0; i < restOfPages.length; i++) {
        if (restOfPages[i].word.translation_id === currentPage.word.translation_id) {
          return state;
        }
      }

      let repeatPage = {
        component: currentPage.component,
        type: currentPage.type,
        word: currentPage.word,
        options: currentPage.options,
        order: state.pages.length + 1,
        answered: false,
        answeredCorrectly: null
      };
      let copyPages = [...state.pages];

      copyPages.splice(state.pageNumber + randint(2, 4), 0, repeatPage);

      return {
        ...state,
        pages: copyPages,
        progress: (state.pageNumber - 1) * 110 / state.pages.length
      };

    case 'fetchError':
      return {
        ...state,
        fetchError: action.value === 'true'
      };

    case 'correctFound':      
      return {
        ...state,
        correctFound: action.value === 'true'
      };

    case 'questionAnswered':
      const pages = state.pages;
      const pagesSoFar = pages.slice(0, state.pageNumber);
      const otherPages = pages.slice(state.pageNumber + 1);
      const curPage = {
        ...pages[state.pageNumber],
        answered: true,
        answeredCorrectly: action.value as boolean
      };

      return {
        ...state,
        pages:  [...pagesSoFar, curPage, ...otherPages]
      };


    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
