import {
  SetDeckOverlayType,
  SetFolderOverlayType,
  SetCategoryOverlayType
} from '../../../types/profilePageTypes';
import { ImageOverlayReducerTypes } from '../../image_overlay/addImageReducer';

const OverlayNavbar: React.FC<OverlayNavbarTypes> = ({
  setOverlay,
  specialClass,
  description,
  extra,
}) => {
  // Component of CreateDeckOverlay, CreateFolderOverlay, CreateCategoryOverlay,
  // AddImageOverlay and EditImageOverlay

  const handleExit = (event: React.MouseEvent) => {
    event.preventDefault();
    if (specialClass) {
      setOverlay({ type: `view-${specialClass}`, value: 'hide' });
    } else {
      setOverlay({ type: 'view', value: 'hide' });
    }
  };

  return (
    <div className={`overlay-nav ${specialClass ? `${specialClass}-navbar` : ''}`}>
      <div className="overlay-description">
        {description}{' '}
        {extra ? <span className="extra-info">({extra})</span> : ''}
      </div>
      <button className="exit-button" onClick={handleExit}>
        <p className="exit-sign">
          <span className="fa-solid fa-xmark" />
        </p>
      </button>
    </div>
  );
};

interface OverlayNavbarTypes {
  setOverlay: SetDeckOverlayType
   | SetFolderOverlayType
   | SetCategoryOverlayType
   | React.Dispatch<ImageOverlayReducerTypes>;
  description: string;
  specialClass?: string;
  extra?: string;
}

export default OverlayNavbar;
