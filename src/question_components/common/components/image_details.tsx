import { useContext } from 'react';
import OverlayNavbar from '../../../profile_components/overlays/common/components/overlay_navbar';
import { QuestionContext } from '../../question_intro/question_intro';
import { QuestionContextTypes } from '../../types/QuestionPageTypes';

export const ImageDetails: React.FC = () => {
  const { questionPage, setQuestionPage } = useContext(QuestionContext) as QuestionContextTypes;
  const { artistName, references } = questionPage.imageDetails;

  const handleClick = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.id === 'image-details') {
      setQuestionPage({type: 'imageDetails', value: {view: false}});
    }
  };

  return <div id="image-details" onClick={handleClick}>
    <div id="image-details-container">
      <OverlayNavbar
        handleExit={() => setQuestionPage({type: 'imageDetails', value: {view: false}})}
        description={'Image details'}
      />
      <div id="image-details-body">
        <header id="image-details-header">
          This image was created by <span className="image-artist">{artistName}</span>.
        </header>
        <div id="reference-list-header">References:</div>
        <ol id="image-reference-container">
          {references!.map((ref, index) => {
            let link = /^http/.test(ref) ? ref : `https://${ref}`;
            return <li 
              className="image-reference" key={index}>
              <a href={link} target="_blank" rel="noreferrer">{link}</a>
            </li>;
          })}
        </ol>
      </div>
    </div>
  </div>;
};

export interface ImageDetailsTypes {
  view: boolean;
  artistName?: string;
  references?: string[];
  submittedBy?: string;
  approved?: boolean;
};

export const ImageDetailsDefaults = {
  view: false,
  artistName: '',
  references: [],
  submittedBy: '',
  approved: false
};
