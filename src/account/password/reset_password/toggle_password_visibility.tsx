export const TogglePasswordVisibility: React.FC<
{handleVisibility: React.Dispatch<React.SetStateAction<boolean>>}> = ({handleVisibility}) => {
  return (
    <div className="toggle-password-visibility">
      <input 
        id="toggle-password-checkbox"
        type="checkbox"
        onClick={() => handleVisibility(prev => !prev)} />
      <label 
        className="form-checkbox-label"
        htmlFor="toggle-password-checkbox">Show password</label>  
    </div>
  );
};
