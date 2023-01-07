import { DeckInfo } from './deck_info';
import { WordSuccess } from './word_success';

export const QuestionIntroContent: React.FC<{type: string}> = (props) => {
  
  return (
    <div id="question-intro-content">
      <DeckInfo type={props.type} />
      <WordSuccess title="Word stats" />
    </div>
  );
};
