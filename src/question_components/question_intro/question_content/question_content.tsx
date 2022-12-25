/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import * as handlers from '../../common/handlers';
import LoadingIcon from '../../../assets/animations/loading_icon';
import { QuestionContext } from '../question_intro';
import { ProgressBar, QuestionBody } from './components';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';

export var audioMixer = new Audio();

export const QuestionContent: React.FC = () => {
  // Rendered by '../index.js' -> 'Deck' component.

  const { questionPage } = useContext(QuestionContext) as QuestionContextTypes;

  // Cache images
  useEffect(() => {
    const { pages, pageNumber } = questionPage;
    if (pages[0].component) {
      handlers.cache_question_image(pages, pageNumber, 2);
      handlers.cache_question_audio(pages, pageNumber, 1);
    }
  }, [questionPage.pages, questionPage.pageNumber]);

  const { deckInfo, wordInfo, pages, pageNumber } = questionPage;
  // Children: NavBar, ProgressBar, QuestionBody.
  return (
    <div className="question-page">
      <ProgressBar width={questionPage.progress} />
      {!deckInfo.isLoaded && deckInfo.showLoading &&
        <LoadingIcon elementClass="image-request white" />  
      }
      {/* Context consumed by AskFromPicture, AskFromText, IntroduceWord */}
      {pages[0].component !== null && pageNumber < pages.length && (
        <QuestionBody
          animation={questionPage.childAnimation}
          page={handlers.process_page_object(pages[pageNumber], wordInfo)}
        />
      )}
    </div>
  );
};

export default QuestionContent;
