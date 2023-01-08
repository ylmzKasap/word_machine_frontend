import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuestionContextTypes } from '../../../types/QuestionPageTypes';
import { QuestionContext } from '../../question_intro';

export const QuestionNavbar: React.FC<NavBarTypes> = (props) => {
  // Component of QuestionPage.
  const navigate = useNavigate();
  const location = useLocation();

  const { questionPage, setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;
  const { deckInfo, fetchError, pageNumber } = questionPage;

  let currentDirectory = '';
  if (deckInfo.directory !== deckInfo.root_id && !fetchError) {
    currentDirectory = `/${deckInfo.directory}`;
  }

  const handleHomeClick = () => {
    if (questionPage.view === 'introduction') {
      navigate(`/user/${props.user}${currentDirectory}`, 
        {state: {scrollTop: location.state.scrollTop}});
    } else if (['question', 'revision', 'test'].includes(questionPage.view)) {
      setQuestionPage({type: 'view', value: 'introduction'});
    }
  };

  return (
    <div className="navbar">
      <>
        {/* Back Arrow */}
        {!fetchError && deckInfo.isLoaded && pageNumber > 0 
          && ['question', 'revision', 'test'].includes(questionPage.view)
        && (
          <i className="fas fa-arrow-left navbar-arrow" onClick={props.goBack} />
        )}

        {/* Return home */}
        {(deckInfo.isLoaded || fetchError) && 
          <i className="fas fa-home navbar-home"
            onClick={handleHomeClick} />
        }
        
        {/* Forward arrow */}
        {!fetchError && deckInfo.isLoaded
        && ['question', 'revision', 'test'].includes(questionPage.view) && (
          <i className="fas fa-arrow-right navbar-arrow" onClick={props.goForward}></i>
        )}  
      </>
    </div>
  );
};

export interface NavBarTypes {
  goBack: () => void;
  goForward: () => void;
  user: string | undefined;
}
