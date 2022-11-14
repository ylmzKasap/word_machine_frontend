// AskFromPicture -> TextOptions -> TextOptionBox -> NumberBox | IntroImage

import { useState, useContext, useEffect, useReducer } from 'react';
import { WordTypes } from '../../../../profile_components/types/profilePageTypes'; 
import { IntroImage, NumberBox } from '../../../common/components';
import { handleStyles } from '../../../common/reducers';
import { play_audio, shuffle } from '../../../common/utils';
import { audioMixer } from '../question_content';
import {
  optionStyleDefaults,
} from '../../../types/QuestionPageDefaults';
import * as types from '../../../types/QuestionPageTypes';
import axios from 'axios';
import { QuestionContext } from '../../question_intro';

export const AskFromPicture: React.FC<types.QuestionComponentPropTypes> = ({
  wordInfo,
  word,
  options,
}) => {
  // Component of QuestionPage - Handled by './functions' -> generate_pages

  const [imageAnimation, setImageAnimtion] = useState('');
  const [layout] = useState(Math.random());
  const [shuffledOptions] = useState(() => shuffle(options));

  const { questionPage, setQuestionPage } =
    useContext(QuestionContext) as types.QuestionContextTypes;

  const useMountEffect = () =>
    useEffect(() => {
      if (questionPage.correctFound) {
        setQuestionPage({type: 'correctFound', value: 'false'});
      }
    }, []);

  useMountEffect();

  function animateImage() {
    setImageAnimtion('emphasize');
  }

  // Children: TextOptions, IntroImage.
  return (
    <div className="ask-from-picture">
      <div
        className="text-options"
        style={{ order: layout >= 0.25 && window.innerWidth > 1024 ? 0 : 2 }}
      >
        {shuffledOptions.map((opt, index) => (
          <TextOptionBox
            {...opt}
            wordInfo={wordInfo}
            animate={animateImage}
            number={index + 1}
            key={`${opt[wordInfo.target_language]}-${index}`}
          />
        ))}
      </div>
      <IntroImage
        wordInfo={wordInfo}
        word={word}
        animation={imageAnimation}
        key={word[wordInfo.target_language as keyof WordTypes] + '-image'}
        style={{ order: 1 }}
        answeredCorrectly={questionPage.pages[questionPage.pageNumber].answeredCorrectly}
      />
    </div>
  );
};

const TextOptionBox: React.FC<types.OptionPropTypes> = (props) => {
  // Component of TextOptions - Hanled by './functions' -> getRandomOptions.

  const [optionStyle, setOptionStyle] = useReducer(
    handleStyles,
    optionStyleDefaults
  );

  const { goForward, handleIncorrect, questionPage, setQuestionPage } =
    useContext(QuestionContext) as types.QuestionContextTypes;

  // Handle timeouts for the correct answer
  useEffect(() => {
    if (!questionPage.correctFound) return;
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
  }, [questionPage.correctFound]);

  function handleClick() {
    // The answer is previously clicked
    if (optionStyle.animation !== '') return;
    const { username, logged_in_user } = questionPage.deckInfo;

    const currentPage = questionPage.pages[questionPage.pageNumber];
    if (props.isCorrect === true) {
      // Correct answer
      audioMixer.src = questionPage.deckInfo.correct_sound;

      setQuestionPage({type: 'correctFound', value: 'true'});
      setOptionStyle({ type: 'text', answer: 'correct' });

      if (currentPage.answered || username !== logged_in_user) return;
      setQuestionPage({type: 'questionAnswered', value: props.isCorrect});
      axios.put('/question_answer', {
        translation_id: props.translation_id,
        deck_id: props.deck_id,
        is_correct: true
      });
    } else {
      // Incorrect answer
      audioMixer.src = questionPage.deckInfo.incorrect_sound;

      setOptionStyle({ type: 'text', answer: 'incorrect' });
      handleIncorrect();

      if (currentPage.answered || username !== logged_in_user) return;
      setQuestionPage({type: 'questionAnswered', value: props.isCorrect});
      axios.put('/question_answer', {
        translation_id: currentPage.word.translation_id,
        deck_id: currentPage.word.deck_id,
        is_correct: false
      });
    }
    play_audio(audioMixer, 'Sound interrupted by user.');
  }

  // Children: './shared' -> NumberBox.
  return (
    <label
      className={`text-option ${optionStyle.animation}`}
      key={props.number}
      onClick={handleClick}
    >
      <NumberBox
        type="text"
        number={props.number}
        style={optionStyle.numStyle}
      />
      <div className="option-text">
        <>{props[props.wordInfo.target_language as keyof types.OptionPropTypes]}</>
      </div>
    </label>
  );
};
