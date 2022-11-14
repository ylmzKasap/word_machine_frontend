import React, { useState, useContext } from 'react';
import { IntroImage, IntroText } from '../../../common/components';

import {
  QuestionComponentPropTypes,
  QuestionContextTypes,
} from '../../../types/QuestionPageTypes';
import { WordTypes } from '../../../../profile_components/types/profilePageTypes';
import { QuestionContext } from '../../question_intro';

export const IntroduceWord: React.FC<QuestionComponentPropTypes> = (props) => {
  // Component of QuestionPage - Handled by './functions' -> generate_pages

  const [layout] = useState(Math.random());
  const { wordInfo, word } = props;

  const pageItems = [
    <IntroText
      wordInfo={wordInfo}
      word={word}
      key={word[wordInfo.target_language as keyof WordTypes] + '-text'}
      type="intro"
      animation=""
    />,
    <IntroImage
      wordInfo={wordInfo}
      word={word}
      key={word[wordInfo.target_language as keyof WordTypes] + '-image'}
    />,
  ];

  const { goForward } = useContext(
    QuestionContext
  ) as QuestionContextTypes;

  function handle_click(event: React.MouseEvent) {
    const element = event.target as HTMLInputElement;
    if (!/^intro-text/.test(element.className)) {
      goForward();
    }
  }

  // Children: IntroText, IntroImage.
  return (
    <div
      className="intro-word"
      onClick={(elem) => handle_click(elem)}
    >
      {layout >= 0.5 && window.innerWidth > 1024
        ? [...pageItems]
        : [...pageItems.reverse()]}
    </div>
  );
};
