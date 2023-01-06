import React, { useEffect, useContext } from 'react';
import { IntroImage, IntroText } from '../../../common/components';

import {
  PageContent,
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
  
  const currentPage = questionPage.pages[questionPage.pageNumber] as PageContent;
  const { showText, showThumbs } = currentPage;

  useEffect(() => {
    if (showText) {
      var thumbsTimeout = window.setTimeout(
        () => setQuestionPage({type: 'showThumbs', value: questionPage.pageNumber}), 1900);
    }
    return () => {
      window.clearTimeout(thumbsTimeout);
    };
  }, [showText]);

  function handleClick(event: React.MouseEvent) {
    const element = event.target as HTMLDivElement;
    if (element.className.includes('fa-circle-info')) {
      return;
    }
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
          clickedThumbs={currentPage.clickedThumbs!}
          wordId={props.word.word_id}
          deckId={props.word.deck_id}
        />}
        <IntroText
          wordInfo={wordInfo}
          word={word}
          key={word[wordInfo.target_language as keyof WordTypes] + '-text'}
          type="revise"
          animation=""
          showText={currentPage.showText!}
        />
        {showThumbs && <Thumbs
          type="down"
          clickedThumbs={currentPage.clickedThumbs!}
          wordId={props.word.word_id}
          deckId={props.word.deck_id}
        />}
      </div>
    </div>
  );
};
