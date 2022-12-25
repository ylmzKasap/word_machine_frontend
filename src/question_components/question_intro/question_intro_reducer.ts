import { RequestMessageTypes } from '../../profile_components/types/profilePageTypes';
import { cache_question_audio, cache_question_image, generate_pages } from '../common/handlers';
import { randint } from '../common/utils';
import { DeckResponseTypes, PageContent } from '../types/QuestionPageTypes';
import { ReviseWord } from './question_content/components/revise_word';
import { QuestionPageTypes } from './question_intro';

export const handleQuestionPage = (
  state: QuestionPageTypes,
  action: {
    type: string,
    value?: string | boolean | number | DeckResponseTypes | RequestMessageTypes,
    index?: number
  }
): QuestionPageTypes => {
  switch (action.type) {
    case 'view':
      return {
        ...state,
        view: action.value as string
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
        pages: questionPages // Set back to questionPages
      };

    case 'startQuestion':
      return {
        ...state,
        view: 'question',
        pageNumber: 0,
        progress: 0,
        pages: generate_pages(state.wordInfo)
      };

    case 'goBack':
      return {
        ...state,
        pageNumber: state.pageNumber - 1,
        childAnimation: state.childAnimation === 'load-page' ? 'load-page-2' : 'load-page',
        progress: ((state.pageNumber - 1) * 100) / (state.pages.length - 1)
      };

    case 'goForward':
      return {
        ...state,
        pageNumber: state.pageNumber + 1,
        childAnimation: state.childAnimation === 'load-page' ? 'load-page-2' : 'load-page',
        progress: ((state.pageNumber + 1) * 100) / (state.pages.length - 1)
      };

    case 'showLoading':
      return {
        ...state,
        deckInfo: {
          ...state.deckInfo,
          showLoading: action.value === 'true'
        }
      };

    case 'fetchError':
      return {
        ...state,
        fetchError: action.value === 'true'
      };

    case 'requestMessage':      
      return {
        ...state,
        requestMessage: action.value as RequestMessageTypes
      };

    case 'questionAnswered': {
      const isCorrect = action.value as boolean;
      const pages = state.pages;
      let pagesToReturn : PageContent[] = [];

      if (pages[state.pageNumber].answered) return state;
      
      const pagesSoFar = pages.slice(0, state.pageNumber);
      const otherPages = pages.slice(state.pageNumber + 1);
      const currentPage = {
        ...pages[state.pageNumber],
        answered: true,
        answeredCorrectly: isCorrect
      };

      const updatedPages =  [...pagesSoFar, currentPage, ...otherPages];
      if (isCorrect) {
        const revisionIndex = state.pageNumber + randint(2, 5);
  
        const pagesBeforeRevision = updatedPages.slice(0, revisionIndex);
        const pagesAfterRevision = updatedPages.slice(revisionIndex);
        const revision = {
          component: ReviseWord,
          type: 'ReviseWord',
          word: pages[state.pageNumber].word,
          options: [],
          order: state.pages.length + 1,  // For unique key
          answered: false,
          answeredCorrectly: null,
          showText: false,
          showThumbs: false,
          clickedThumbs: ''
        };
        pagesToReturn = [...pagesBeforeRevision, revision, ...pagesAfterRevision];
      } else {
        const repeatIndex = state.pageNumber + randint(2, 4);

        const pagesBeforeRepeat = updatedPages.slice(0, repeatIndex);
        const pagesAfterRepeat = updatedPages.slice(repeatIndex);
        let repeatPage = {
          component: currentPage.component,
          type: currentPage.type,
          word: currentPage.word,
          options: currentPage.options,
          order: state.pages.length + 1,
          answered: false,
          answeredCorrectly: null
        };
        pagesToReturn = [...pagesBeforeRepeat, repeatPage, ...pagesAfterRepeat];
      }

      return {
        ...state,
        pages:  pagesToReturn,
        progress: !isCorrect ? (state.pageNumber - 1) * 110 / state.pages.length : state.progress
      };
    }

    case 'showText': {
      const pages = state.pages;
      const pageIndex = action.value as number;

      const pagesSoFar = pages.slice(0, pageIndex);
      const otherPages = pages.slice(pageIndex + 1);
      const currentPage = {
        ...pages[pageIndex],
        showText: true
      };
      const pagesToReturn = [...pagesSoFar, currentPage, ...otherPages];

      return {
        ...state,
        pages: pagesToReturn
      };
    }

    case 'showThumbs': {
      const pages = state.pages;
      const pageIndex = action.value as number;

      const pagesSoFar = pages.slice(0, pageIndex);
      const otherPages = pages.slice(pageIndex + 1);
      const currentPage = {
        ...pages[pageIndex],
        showThumbs: true
      };
      const pagesToReturn = [...pagesSoFar, currentPage, ...otherPages];

      return {
        ...state,
        pages: pagesToReturn
      };
    }

    case 'changeThumbs': {
      const pages = state.pages;
      const pageIndex = action.index as number;
      let pagesToReturn : PageContent[] = [];

      const pagesSoFar = pages.slice(0, pageIndex);
      const otherPages = pages.slice(pageIndex + 1);
      const currentPage = {
        ...pages[pageIndex],
        clickedThumbs: action.value as string
      };
      pagesToReturn = [...pagesSoFar, currentPage, ...otherPages];

      if (action.value === 'down') {
        const repeatIndex = state.pageNumber + randint(2, 4);

        const pagesBeforeRepeat = pagesToReturn.slice(0, repeatIndex);
        const pagesAfterRepeat = pagesToReturn.slice(repeatIndex);
        const pageToRepeat = pagesBeforeRepeat.find(
          p => p.word.translation_id === currentPage.word.translation_id
            && p.options.length
        ) as PageContent;
        let repeatPage = {
          component: pageToRepeat.component,
          type: pageToRepeat.type,
          word: pageToRepeat.word,
          options: pageToRepeat.options,
          order: state.pages.length + 1,
          answered: false,
          answeredCorrectly: null
        };
        pagesToReturn = [...pagesBeforeRepeat, repeatPage, ...pagesAfterRepeat];
      }

      return {
        ...state,
        pages: pagesToReturn,
        progress: action.value === 'down' 
          ? ((state.pageNumber - 1) * 100) / (state.pages.length - 1)
          : state.progress
      };
    }

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};
