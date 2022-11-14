import axios from 'axios';
import { useEffect, useReducer, createContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionNavbar } from './question_content/components';
import { handleQuestionPage } from './question_page_reducer';
import * as defaults from '../types/QuestionPageDefaults';
import * as types from '../types/QuestionPageTypes';
import NotFound from '../../profile_components/common/components/not_found';
import { QuestionIntroContent } from './components/question_intro_content';
import QuestionContent from './question_content/question_content';
import { isProduction, serverUrl } from '../../constants';

export const QuestionContext = createContext<
  types.QuestionContextTypes | undefined
>(undefined);

export const QuestionIntro = () => {
  const params = useParams<types.ParamTypes>();
  const navigate = useNavigate();

  const [questionPage, setQuestionPage] = useReducer(handleQuestionPage, QuestionPageDefaults);
  const [reRender, setReRender] = useReducer(x => x + 1, 0);

  // Get the content from state or fetch it.
  useEffect(() => {
    if (['question'].includes(questionPage.view)) return;
    let deck_id = params.deckId;

    // Show laoding icon after half a second
    setTimeout(() => {
      setQuestionPage({type: 'showLoading', value: 'true'});
    }, 500);

    axios
      .get(`${isProduction ? serverUrl : ''}/deck/${params.username}/${deck_id}`)
      .then((res) => {
        const response = res.data as types.DeckResponseTypes;
        setQuestionPage({type: 'setDeckData', value: response});
        setReRender();
      })
      .catch(() => 
        setQuestionPage({type: 'fetchError', value: 'true'})
      );
  }, [questionPage.view]);

  function goBack() {
    if (questionPage.pageNumber > 0) {
      setQuestionPage({type: 'goBack'});
    }
  }

  function goForward() {
    const { deckInfo, fetchError, pageNumber, pages } = questionPage;
    const dirToGo = deckInfo.directory === deckInfo.root_id || fetchError 
      ? '' 
      : `/${deckInfo.directory}`;

    if (pageNumber < pages.length) {
      setQuestionPage({type: 'goForward'});
    }
    if (pageNumber === pages.length - 1) {
      navigate(`/user/${params.username}${dirToGo}`);
    }
  }

  function handleIncorrect() {
    if (!questionPage.correctFound) {
      setQuestionPage({type: 'insertRevision'});
    }
  }

  const { deckInfo, fetchError } = questionPage;
  return (
    <QuestionContext.Provider
      value={{
        goForward: goForward,
        handleIncorrect: handleIncorrect,
        questionPage: questionPage,
        setQuestionPage: setQuestionPage,
        reRender: reRender
      }}
    >
      <div id="question-intro">
        <QuestionNavbar
          goBack={goBack}
          goForward={goForward}
          user={params.username}
        />
        {questionPage.view === 'introduction' && deckInfo.isLoaded 
          && <QuestionIntroContent />}
        {questionPage.view === 'question' && deckInfo.isLoaded
          && <QuestionContent />}
        {fetchError && <NotFound />}
      </div>
    </QuestionContext.Provider>
  );
};

export interface QuestionPageTypes {
  view: string;
  deckInfo: types.DeckInfoTypes;
  wordInfo: types.WordInfoTypes;
  pages: types.PageTypes;
  pageNumber: number;
  progress: number;
  childAnimation: string;
  correctFound: boolean;
  fetchError: boolean;
}

export const QuestionPageDefaults = {
  view: 'introduction',
  deckInfo: defaults.deckInfoDefault,
  wordInfo: defaults.wordInfoDefault,
  pages: defaults.pageDefault,
  pageNumber: 0,
  progress: 0,
  childAnimation: 'load-page',
  correctFound: false,
  fetchError: false
};
