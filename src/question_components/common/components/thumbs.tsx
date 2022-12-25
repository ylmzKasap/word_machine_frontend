import axios from 'axios';
import { useContext, useEffect } from 'react';
import { isProduction, serverUrl } from '../../../constants';
import { QuestionContext } from '../../question_intro/question_intro';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';

export const Thumbs: React.FC<ThumbsPropTypes> = (props) => {
  const { 
    questionPage,
    setQuestionPage,
    goForward } = useContext(QuestionContext) as QuestionContextTypes;
  let nextPageTimeout: number;

  useEffect(() => {
    return () => {
      window.clearTimeout(nextPageTimeout);
    };
  }, []);

  const handleClick = () => {
    if (!props.clickedThumbs) {
      setQuestionPage({type: 'changeThumbs', value: props.type, index: questionPage.pageNumber});
      axios.put(`${isProduction ? serverUrl : ''}/question_answer`, {
        word_id: props.wordId,
        deck_id: props.deckId,
        is_correct: props.type === 'up'
      });
    }
    nextPageTimeout = window.setTimeout(() => goForward(), 700);
  };

  // Type is either 'up' or 'down'
  return (
    <label
      id={`thumbs-${props.type}`}
      className={`thumbs-container${props.clickedThumbs === props.type
        ? ' selected'
        : props.clickedThumbs && props.clickedThumbs !== props.type
          ? ' unselected' : ''}`}
      onClick={handleClick}>
      <i className={`fa-solid fa-thumbs-${props.type}`} />
    </label>
  );
};

interface ThumbsPropTypes {
  type: string;
  clickedThumbs: string;
  wordId: string;
  deckId: string;
}
