const OverlayNavbar: React.FC<OverlayNavbarTypes> = ({
  handleExit,
  specialClass,
  description,
  extra,
}) => {
  // Component of CreateDeckOverlay, CreateFolderOverlay, CreateCategoryOverlay,
  // AddImageOverlay and EditImageOverlay

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
  handleExit: () => void;
  description: string;
  specialClass?: string;
  extra?: string;
}

export default OverlayNavbar;
