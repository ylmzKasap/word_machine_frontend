import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { WordInfoTypes } from '../../types/QuestionPageTypes';
import { WordTranslation } from './word_translation';

export const IntroImage: React.FC<IntroImageTypes> = (props) => {
  // Shared by IntroduceWord and AskFromPicture.

  let imgAnim = props.animation === undefined ? '' : props.animation;
  return (
    <div 
      className={'intro-img-box'
      + (imgAnim ? ` ${imgAnim}` : '')
      + (props.className ? ` ${props.className}` : '')}
      style={props.style}>
      <img
        className="intro-img"
        src={`${props.word.image_path}`}
        alt={`${props.word[props.wordInfo.target_language as keyof WordTypes]}`}
      />
      {props.answeredCorrectly ?
        <span id="answer-sign" className="image correct">
          <i className="fa-solid fa-check" />
        </span> : ''
      }
      {props.answeredCorrectly === false ?
        <span id="answer-sign" className="image incorrect">
          <i className="fa-solid fa-xmark" />
        </span> : ''
      }
      {props.wordInfo.show_translation && (
        <WordTranslation
          translation={props.word[props.wordInfo.source_language as keyof WordTypes] as string}
        />
      )}
    </div>
  );
};

export interface IntroImageTypes {
  wordInfo: WordInfoTypes;
  word: WordTypes;
  key: string;
  animation?: string;
  style?: {
    order: number;
  };
  answeredCorrectly?: null | boolean;
  className?: string;
}

