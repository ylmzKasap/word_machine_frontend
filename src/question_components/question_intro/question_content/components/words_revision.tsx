import React, { useContext, useEffect, useState } from 'react';
import { WordTypes } from '../../../../profile_components/types/profilePageTypes';
import { play_audio } from '../../../common/utils';
import { QuestionContextTypes } from '../../../types/QuestionPageTypes';
import { QuestionContext } from '../../question_intro';
import { audioMixer } from '../question_content';

export const ReviseWords: React.FC = () => {
  const { questionPage, setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;

  const [clickedWord, setClickedWord] = useState('');
  const [shownIndex, setShownIndex] = useState(0);

  useEffect(() => {
    setShownIndex(0);
  }, [questionPage.pageNumber]);

  const handleClick = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    const pages = questionPage.pages as WordTypes[][];
    if (element.className === 'word-revision' || element.id === 'revise-words') {
      if (shownIndex < pages[questionPage.pageNumber].length) {
        setShownIndex(x => x + 1);
      } else {
        setQuestionPage({type: 'goForward'});
      }
    }
  };

  const handleAnimationEnd = (event: React.AnimationEvent, word: WordTypes) => {
    setClickedWord('');
    if (event.animationName === 'slideUp') {
      setClickedWord(word.word_id);
      audioMixer.src = word.sound_path;
      play_audio(audioMixer, 'Playback failed');
    }
  };

  const pages = questionPage.pages as WordTypes[][];
  return (
    <div id="revise-words-container" onClick={handleClick}>
      <header id="revise-header">Time to revise!</header>
      <div id="revise-words">
        {pages[questionPage.pageNumber].map((word, index) => {
          const vocab = word[questionPage.wordInfo.target_language as keyof WordTypes] as string;
          return <div className="word-revision" key={word.word_id}>
            {index <= shownIndex
              && <div 
                className={'revision-picture-container'
                  + (index === shownIndex ? ' disabled' : '')
                  + (index === 0 ? ' first-image' : '')}
                onClick={() => {
                  if (index === shownIndex) return;
                  audioMixer.src = word.sound_path;
                  play_audio(audioMixer, 'Playback failed');
                }}>
                <img 
                  className="revision-picture"
                  src={word.image_path}
                  alt={vocab} />
                {questionPage.wordInfo.show_translation 
                  && <div className="word-translation">
                    {word[questionPage.wordInfo.source_language as keyof WordTypes]}
                  </div>}
              </div>}
            {index + 1 <= shownIndex 
              && <div 
                className={'revision-text' + (clickedWord === word.word_id ? ' emphasize' : '')}
                onClick={() => {
                  setClickedWord(word.word_id);
                  audioMixer.src = word.sound_path;
                  play_audio(audioMixer, 'Playback failed');
                }}
                onAnimationEnd={(event) => handleAnimationEnd(event, word)}
              >
                {vocab}
              </div>}
          </div>;
        })}
      </div>
    </div>
  );
};

