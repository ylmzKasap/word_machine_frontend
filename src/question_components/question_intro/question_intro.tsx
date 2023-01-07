import axios from 'axios';
import { useEffect, useReducer, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { QuestionNavbar } from './question_content/components';
import { handleQuestionPage } from './question_intro_reducer';
import * as defaults from '../types/QuestionPageDefaults';
import * as types from '../types/QuestionPageTypes';
import NotFound from '../../profile_components/common/components/not_found';
import { QuestionIntroContent } from './components/question_intro_content';
import QuestionContent from './question_content/question_content';
import { isProduction, serverUrl } from '../../constants';
import { RequestMessageTypes, WordTypes } from '../../profile_components/types/profilePageTypes';
import { requestMessageDefault } from '../../profile_components/types/profilePageDefaults';
import { RequestInfo } from '../../profile_components/profile_page/other_components';
import { ImageDetailsDefaults, ImageDetailsTypes } from '../common/components/image_details';
import LoadingIcon from '../../assets/animations/loading_icon';

export const QuestionContext = createContext<
  types.QuestionContextTypes | undefined
>(undefined);

export const QuestionIntro: React.FC<{type: string}> = (props) => {
  const params = useParams<types.ParamTypes>();

  const [questionPage, setQuestionPage] = useReducer(handleQuestionPage, QuestionPageDefaults);
  const [reRender, setReRender] = useReducer(x => x + 1, 0);

  // Get the content from state or fetch it.
  useEffect(() => {
    if (['question', 'revision', 'test'].includes(questionPage.view)) return;
    let item_id = params.itemId;

    axios
      .get(`${isProduction ? serverUrl : ''}/${props.type}/${params.username}/${item_id}`)
      .then((res) => {
        let response = res.data as types.DeckResponseTypes;
        let orderedwords: WordTypes[];
        if (props.type === 'category') {
          orderedwords = response.words.map((word, index) => ({...word, word_order: index}));
          response.words = orderedwords;
        }
        setQuestionPage({type: 'setDeckData', value: response});
        setReRender();
      })
      .catch(() => 
        setQuestionPage({type: 'fetchError', value: 'true'})
      );
  }, [questionPage.view]);

  useEffect(() => {
    if (questionPage.pages.length < 1) return;

    if (questionPage.pageNumber === questionPage.pages.length) {
      setQuestionPage({type: 'view', value: 'introduction'});
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
        {!deckInfo.isLoaded && <LoadingIcon elementClass="image-request" />}
        {questionPage.view === 'introduction' && deckInfo.isLoaded 
          && <QuestionIntroContent type={props.type} />}
        {['question', 'revision', 'test'].includes(questionPage.view) && deckInfo.isLoaded
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
  pages: types.PageTypes | WordTypes[][];
  imageDetails: ImageDetailsTypes;
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
  imageDetails: ImageDetailsDefaults,
  pageNumber: 0,
  progress: 0,
  childAnimation: 'load-page',
  fetchError: false,
  requestMessage: requestMessageDefault
};
