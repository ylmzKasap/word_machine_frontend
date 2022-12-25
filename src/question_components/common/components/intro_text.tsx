import { useLayoutEffect, useState } from 'react';
import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { audioMixer } from '../../question_intro/question_content/question_content';
import { WordInfoTypes } from '../../types/QuestionPageTypes';
import { is_mobile, play_audio } from '../utils';

export const IntroText: React.FC<IntroTextTypes> = (props) => {
  // Shared by IntroduceWord and AskFromText.

  const [isAnimated, setIsAnimated] = useState(false);
  const [reviseAnimation, setReviseAnimation] = useState(false);
  const [isMobile] = useState(is_mobile);

  useLayoutEffect(() => {
    let soundDelay = 200;
    let animationLength = 700;
    if (props.showText) {
      if (props.type === 'revise') {
        setReviseAnimation(true);
        var slideInTimeout = window.setTimeout(() => setReviseAnimation(false), animationLength);
        soundDelay += animationLength;
      }
      var introSoundTimeout = window.setTimeout(() => {
        playSound();
        setIsAnimated(true);
      }, soundDelay);
    }
    return () => {
      window.clearTimeout(introSoundTimeout);
      window.clearTimeout(slideInTimeout);
    };
  }, [props.showText]);

  function toggleAnimation() {
    if (!reviseAnimation) {
      setIsAnimated((animated) => !animated);
    }
  }

  function playSound() {
    audioMixer.src = props.word.sound_path as string;
    play_audio(audioMixer, 'Playback prevented by browser.');
  }

  const pageMessage = isMobile ? 'tap' : 'click';
  const pageIcon = isMobile ? 'fas fa-fingerprint' : 'fa fa-mouse-pointer';

  return (
    <label className={'text-intro-box'
      + `${props.animation ? ` ${props.animation}` : ''}`
      + `${reviseAnimation ? ' text-pop-up' : ''}`}>
      {props.showText &&
      <p
        className={`${props.type}-text` 
        + `${isAnimated ? ' emphasize' : ''}`}
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
      }
      {(props.type === 'intro' || (props.type === 'revise' && !props.showText)) && (
        <div className="continue">
          <i className={`continue-icon ${pageIcon}`} />
          {props.type === 'revise' ? `Guess and ${pageMessage}` : `${pageMessage} anywhere`}
        </div>
      )}
    </label>
  );
};

export interface IntroTextTypes {
  wordInfo: WordInfoTypes;
  word: WordTypes;
  type: string;
  showText: boolean;
  animation: string;
  answeredCorrectly?: null | boolean;
}
