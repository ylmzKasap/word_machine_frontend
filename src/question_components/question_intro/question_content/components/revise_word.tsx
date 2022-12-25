import React, { useEffect, useContext } from 'react';
import { IntroImage, IntroText } from '../../../common/components';

import {
  QuestionComponentPropTypes,
  QuestionContextTypes,
} from '../../../types/QuestionPageTypes';
import { WordTypes } from '../../../../profile_components/types/profilePageTypes';
import { QuestionContext } from '../../question_intro';
import { Thumbs } from '../../../common/components/thumbs';

export const ReviseWord: React.FC<QuestionComponentPropTypes> = (props) => {
  // Component of QuestionPage - Handled by './functions' -> generate_pages

  const { wordInfo, word } = props;
  const { questionPage, setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;
  
  const { showText, showThumbs } = questionPage.pages[questionPage.pageNumber];

  useEffect(() => {
    if (showText) {
      var thumbsTimeout = window.setTimeout(
        () => setQuestionPage({type: 'showThumbs', value: questionPage.pageNumber}), 1900);
    }
    return () => {
      window.clearTimeout(thumbsTimeout);
    };
  }, [showText]);

  function handleClick() {
    if (!showText) {
      setQuestionPage({type: 'showText', value: questionPage.pageNumber});
    }
  }

  // Children: IntroText, IntroImage.
  return (
    <div
      className="intro-word revise"
      onClick={handleClick}
    >
      <IntroImage
        wordInfo={wordInfo}
        word={word}
        key={word[wordInfo.target_language as keyof WordTypes] + '-image'}
        className="revise"
      />
      <div id="revise-text-container">
        {showThumbs && <Thumbs 
          type="up"
          clickedThumbs={questionPage.pages[questionPage.pageNumber].clickedThumbs!}
          wordId={props.word.word_id}
          deckId={props.word.deck_id}
        />}
        <IntroText
          wordInfo={wordInfo}
          word={word}
          key={word[wordInfo.target_language as keyof WordTypes] + '-text'}
          type="revise"
          animation=""
          showText={questionPage.pages[questionPage.pageNumber].showText!}
        />
        {showThumbs && <Thumbs
          type="down"
          clickedThumbs={questionPage.pages[questionPage.pageNumber].clickedThumbs!}
          wordId={props.word.word_id}
          deckId={props.word.deck_id}
        />}
      </div>
    </div>
  );
};
