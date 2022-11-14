export const ExitButton: React.FC<{handleExit: () => void}> = ({handleExit}) => {
  return (
    <button className="exit-button" type="button" onClick={handleExit}>
      <p className="exit-sign">
        <span className="fa-solid fa-xmark"></span>
      </p>
    </button>   
  );
};
