import { DeckInfo } from './deck_info';
import { WordSuccess } from './word_success';

export const QuestionIntroContent = () => {
  
  return (
    <div id="question-intro-content">
      <DeckInfo />
      <WordSuccess title="Word stats" />
    </div>
  );
};
