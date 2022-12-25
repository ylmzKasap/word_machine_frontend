import axios from 'axios';
import { useEffect, useReducer, createContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionNavbar } from './question_content/components';
import { handleQuestionPage } from './question_intro_reducer';
import * as defaults from '../types/QuestionPageDefaults';
import * as types from '../types/QuestionPageTypes';
import NotFound from '../../profile_components/common/components/not_found';
import { QuestionIntroContent } from './components/question_intro_content';
import QuestionContent from './question_content/question_content';
import { isProduction, serverUrl } from '../../constants';
import { RequestMessageTypes } from '../../profile_components/types/profilePageTypes';
import { requestMessageDefault } from '../../profile_components/types/profilePageDefaults';
import { RequestInfo } from '../../profile_components/profile_page/other_components';

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

  useEffect(() => {
    if (questionPage.pages.length <= 1) return;
    const dirToGo = deckInfo.directory === deckInfo.root_id || fetchError 
      ? '' 
      : `/${deckInfo.directory}`;

    if (questionPage.pageNumber === questionPage.pages.length) {
      navigate(`/user/${params.username}${dirToGo}`);
    }

  }, [questionPage.pageNumber]);

  function goBack() {
    if (questionPage.pageNumber > 0) {
      setQuestionPage({type: 'goBack'});
    }
  }

  function goForward() {
    if (questionPage.pageNumber < questionPage.pages.length) {
      setQuestionPage({type: 'goForward'});
    }
  }

  const { deckInfo, fetchError, requestMessage } = questionPage;
  return (
    <QuestionContext.Provider
      value={{
        goForward: goForward,
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
        {requestMessage.description && <RequestInfo 
          className="request-message"
          loading={requestMessage.loading}
          link={requestMessage.link}
          linkDescription={requestMessage.linkDescription}
          description={requestMessage.description}
          exitHandler={() => setQuestionPage({type: 'requestMessage', value: 'reset'})}
        />}
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
  fetchError: boolean;
  requestMessage: RequestMessageTypes;
}

export const QuestionPageDefaults = {
  view: 'introduction',
  deckInfo: defaults.deckInfoDefault,
  wordInfo: defaults.wordInfoDefault,
  pages: defaults.pageDefault,
  pageNumber: 0,
  progress: 0,
  childAnimation: 'load-page',
  fetchError: false,
  requestMessage: requestMessageDefault
};
