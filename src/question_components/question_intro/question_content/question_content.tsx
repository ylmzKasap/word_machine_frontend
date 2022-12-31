/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import * as handlers from '../../common/handlers';
import LoadingIcon from '../../../assets/animations/loading_icon';
import { QuestionContext } from '../question_intro';
import { ProgressBar, QuestionBody } from './components';
import { 
  PageContent,
  PageTypes,
  QuestionContextTypes } from '../../types/QuestionPageTypes';
import { ReviseWords } from './components/words_revision';
import { WordTypes } from '../../../profile_components/types/profilePageTypes';

export var audioMixer = new Audio();

export const QuestionContent: React.FC = () => {
  // Rendered by '../index.js' -> 'Deck' component.

  const { questionPage } = useContext(QuestionContext) as QuestionContextTypes;

  const setPages = (): JSX.Element => {
    if (questionPage.view === 'question') {
      const pages = questionPage.pages as PageTypes;
      if (pages[0].component !== null && pageNumber < pages.length ) {
        return <QuestionBody
          animation={questionPage.childAnimation}
          page={handlers.process_page_object(pages[pageNumber] as PageContent, wordInfo)}
        />;
      } else return <></>;
    } else if (questionPage.view === 'revision') {
      const pages = questionPage.pages as WordTypes[][];
      if (pageNumber < pages.length) {
        return <ReviseWords />;
      } else return <></>;
    } else return <></>;
  };

  // Cache images
  useEffect(() => {
    if (questionPage.view === 'question') {
      const pages = questionPage.pages as PageTypes;
      if (pages[0].component) {
        handlers.cache_question_image(pages, questionPage.pageNumber, 2);
        handlers.cache_question_audio(pages, questionPage.pageNumber, 1); 
      }
    }
  }, [questionPage.pages, questionPage.pageNumber]);

  const { deckInfo, pageNumber, wordInfo } = questionPage;
  // Children: NavBar, ProgressBar, QuestionBody.
  return (
    <div className="question-page">
      <ProgressBar width={questionPage.progress} />
      {!deckInfo.isLoaded && deckInfo.showLoading &&
        <LoadingIcon elementClass="image-request white" />}
      {setPages()}
    </div>
  );
};

export default QuestionContent;
