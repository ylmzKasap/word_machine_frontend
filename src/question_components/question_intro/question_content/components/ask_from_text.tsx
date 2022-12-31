// AskFromText -> IntroText | ImageOptions -> ImageOptionBox -> NumberBox

import React, { useContext, useState, useReducer, useEffect } from 'react';
import { IntroText, NumberBox, WordTranslation } from '../../../common/components';
import { handleStyles } from '../../../common/reducers';
import { play_audio, shuffle } from '../../../common/utils';
import { audioMixer } from '../question_content';
import * as defaults from '../../../types/QuestionPageDefaults';
import * as types from '../../../types/QuestionPageTypes';
import axios from 'axios';
import { QuestionContext } from '../../question_intro';
import { isProduction, serverUrl } from '../../../../constants';

export const AskFromText: React.FC<types.QuestionComponentPropTypes> = ({
  wordInfo,
  word,
  options,
}) => {
  // Component of QuestionPage - Handled by './functions' -> generate_pages

  const [textAnimation, setTextAnimation] = useState('');
  const [shuffledOptions] = useState(() => shuffle(options));

  const { questionPage } =
    useContext(QuestionContext) as types.QuestionContextTypes;

  function animateText() {
    setTextAnimation('emphasize');
  }

  const currentPage = questionPage.pages[questionPage.pageNumber] as types.PageContent;
  // Children: ImageOptions, './shared' -> IntroText.
  return (
    <div className={'ask-from-text-box'}>
      <IntroText
        wordInfo={wordInfo}
        word={word}
        type="ask-from"
        animation={textAnimation}
        answeredCorrectly={currentPage.answeredCorrectly}
        showText={true}
      />
      <div className="image-options">
        {shuffledOptions.map((opt, index) => (
          <ImageOptionBox
            {...opt}
            wordInfo={wordInfo}
            animate={animateText}
            number={index + 1}
            key={`${opt[wordInfo.target_language]}-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

const ImageOptionBox: React.FC<types.OptionPropTypes> = (props) => {
  // Component of ImageOptions - Handled by './functions' -> getRandomOptions.

  const [optionStyle, setOptionStyle] = useReducer(
    handleStyles,
    defaults.optionStyleDefaults
  );

  const [answered, setAnswered] = useState(false);

  const { goForward, questionPage, setQuestionPage } =
    useContext(QuestionContext) as types.QuestionContextTypes;

  // Handle timeouts for the correct answer
  useEffect(() => {
    if (!props.isCorrect) return;
    if (optionStyle.animation === '') return;

    let soundTimeout = window.setTimeout(() => {
      props.animate();
      audioMixer.src = props.sound_path;
      play_audio(audioMixer, 'Sound interrupted by user.');
    }, 1000);

    let forwardTimeout = window.setTimeout(() => goForward(), 2000);

    return () => {
      window.clearTimeout(soundTimeout);
      window.clearTimeout(forwardTimeout);      
    };
  }, [answered]);

  function handleClick() {
    // The answer is previously clicked
    if (optionStyle.animation !== '') return;
    const { username, logged_in_user } = questionPage.deckInfo;

    const currentPage = questionPage.pages[questionPage.pageNumber] as types.PageContent;
    if (props.isCorrect === true) {
      // Correct answer
      audioMixer.src = questionPage.deckInfo.correct_sound;

      setAnswered(true);
      setOptionStyle({ type: 'image', answer: 'correct' });
      setQuestionPage({type: 'questionAnswered', value: props.isCorrect});

      if (currentPage.answered || username !== logged_in_user) return;
      axios.put(`${isProduction ? serverUrl : ''}/question_answer`, {
        word_id: currentPage.word.word_id,
        deck_id: currentPage.word.deck_id,
        is_correct: true
      });
    } else {
      // Incorrect answer
      audioMixer.src = questionPage.deckInfo.incorrect_sound;

      setOptionStyle({ type: 'image', answer: 'incorrect' });
      setQuestionPage({type: 'questionAnswered', value: props.isCorrect});

      if (currentPage.answered || username !== logged_in_user) return;
      axios.put(`${isProduction ? serverUrl : ''}/question_answer`, {
        word_id: currentPage.word.word_id,
        deck_id: currentPage.word.deck_id,
        is_correct: false
      });
    }
    play_audio(audioMixer, 'Sound interrupted by user.');
  }

  // Children: './shared/' -> NumberBox.
  return (
    <div
      className={`image-option-box ${optionStyle.animation}`}
      onClick={handleClick}
    >
      <img
        className="image-option"
        src={`${props.image_path}`}
        alt={`${props[props.wordInfo.target_language as keyof types.OptionPropTypes]}`}
      />
      {props.wordInfo.show_translation && (
        <WordTranslation
          translation={
            props[props.wordInfo.source_language as keyof types.OptionPropTypes] as string}
        />
      )}
      <NumberBox
        type="image"
        number={props.number}
        style={optionStyle.numStyle}
      />
    </div>
  );
};
