import { useContext } from 'react';
import { seperate_language_region } from '../../../profile_components/common/functions';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';
import { QuestionContext } from '../question_intro';

export const DeckInfo: React.FC<{type: string}> = (props) => {
  const { questionPage, setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;

  const handleStudy = () => {
    if (totalWords === 0) return;
    setQuestionPage({type: 'startQuestion'});
  };

  const handleRevise = () => {
    if (totalWords === 0) return;
    setQuestionPage({type: 'startRevise'});
  };

  const handleTest = () => {
    if (totalWords === 0) return;
    setQuestionPage({type: 'startTest'});
  };

  const { target_language, source_language, words } = questionPage.wordInfo;
  const totalWords = words[0].image_id ? words.length : 0;
  return (
    <div id="deck-info-intro">
      <div id="deck-name-intro">
        <div>{props.type === 'category' 
          ? questionPage.deckInfo.category_name
          : questionPage.deckInfo.deck_name}</div>
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
        className={`study-button${totalWords === 0 ? ' disabled' : ''}`}
        onClick={handleStudy}>
        <i className="fa-solid fa-book"></i>Study
      </button>
      <button 
        type="button"
        className={`revise-button${totalWords === 0 ? ' disabled' : ''}`}
        onClick={handleRevise}>
        <i className="fa-solid fa-magnifying-glass" /> Revise
      </button>
      <button 
        type="button"
        className={`test-button${totalWords === 0 ? ' disabled' : ''}`}
        onClick={handleTest}>
        <i className="fa-solid fa-star"></i> Test
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
