import { useContext } from 'react';
import { seperate_language_region } from '../../../profile_components/common/functions';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';
import { QuestionContext } from '../question_intro';

export const DeckInfo = () => {
  const { questionPage, setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;

  const handleStudy = () => {
    setQuestionPage({type: 'startQuestion'});
  };

  const { target_language, source_language } = questionPage.wordInfo;
  const totalWords = questionPage.wordInfo.words.length;
  return (
    <div id="deck-info-intro">
      <div id="deck-name-intro">
        <div>{questionPage.deckInfo.deck_name}</div>
      </div>
      <DeckInfoRow
        description={`${totalWords} ${totalWords <= 1 ? 'word' : 'words'}`}
      />
      <DeckInfoRow
        description={`${seperate_language_region(target_language)}`}
        extraDescription={source_language 
          ? `from ${seperate_language_region(source_language)}`
          : ''}
      />
      <button 
        type="button"
        className="study-button"
        onClick={handleStudy}>
          Study
      </button>
    </div>
  );
};

const DeckInfoRow: React.FC<DeckInfoRowPropTypes> = (
  {
    description,
    extraDescription,
    rowClass
  }
) => {
  return (
    <div className={`deck-info-intro-row${rowClass ? ` ${rowClass}` : ''}`}>
      {description} 
      {extraDescription 
        && <span className="extra-description">&nbsp;{`(${extraDescription})`}</span>}
    </div>
  );
};

interface DeckInfoRowPropTypes {
  description: string;
  extraDescription?: string;
  rowClass?: string;
};
