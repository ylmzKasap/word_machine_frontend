import { useEffect, useState } from 'react';
import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { audioMixer } from '../../question_intro/question_content/question_content';
import { WordInfoTypes } from '../../types/QuestionPageTypes';
import { is_mobile, play_audio } from '../utils';

export const IntroText: React.FC<IntroTextTypes> = (props) => {
  // Shared by IntroduceWord and AskFromText.

  const [isAnimated, setIsAnimated] = useState(false);
  const [isMobile] = useState(is_mobile);
  const [timeouts, handleTimeouts] = useState(introTextTimeoutDefaults);

  const useMountEffect = () =>
    useEffect(() => {
      handleTimeouts({
        'intro-sound': window.setTimeout(() => playSound(), 200),
      });
      setIsAnimated(true);
    }, []);

  useMountEffect();

  useEffect(() => {
    return () => {
      for (let key in timeouts) {
        window.clearTimeout(
          timeouts[key as keyof typeof introTextTimeoutDefaults]
        );
      }
    };
  }, [timeouts]);

  function toggleAnimation() {
    setIsAnimated((animated) => !animated);
  }

  function playSound() {
    audioMixer.src = props.word.sound_path as string;
    play_audio(audioMixer, 'Playback prevented by browser.');
  }

  const pageMessage = isMobile ? 'Tap' : 'Click';
  const pageIcon = isMobile ? 'fas fa-fingerprint' : 'fa fa-mouse-pointer';

  return (
    <label className={`text-intro-box ${props.animation}`}>
      <p
        className={`${props.type}-text ${isAnimated ? 'emphasize' : ''}`}
        onClick={() => {
          toggleAnimation();
          playSound();
        }}
        onAnimationEnd={toggleAnimation}
      >
        {props.word[props.wordInfo.target_language as keyof WordTypes]}
        {props.answeredCorrectly ?
          <span id="answer-sign" className="text correct">
            <i className="fa-solid fa-check" />
          </span> : ''
        }
        {props.answeredCorrectly === false ?
          <span id="answer-sign" className="text incorrect">
            <i className="fa-solid fa-xmark" />
          </span> : ''
        }
      </p>
      {props.type === 'intro' && (
        <div className="continue">
          <i className={`continue-icon ${pageIcon}`}></i> {pageMessage} anywhere
        </div>
      )}
    </label>
  );
};

const introTextTimeoutDefaults = {
  'intro-sound': 0,
};

export interface IntroTextTypes {
  wordInfo: WordInfoTypes;
  word: WordTypes;
  type: string;
  animation: string;
  answeredCorrectly?: null | boolean;
}
