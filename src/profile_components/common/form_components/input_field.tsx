import Trash from '../../../assets/font_awesome/Trash';

const InputField: React.FC<InputFieldTypes> = (props) => {
  const { description, error, value, handler, placeholder, deleter } = props;

  return (
    <label className="input-label">
      {description && (
        <div className="input-info">
          {description}
          <span className="input-error">{error}</span>
        </div>
      )}
      <div className="text-input-container">
        <input
          className={`text-input ${error ? 'forbidden-input' : ''}`}
          value={value}
          onChange={handler}
          placeholder={placeholder ? placeholder : undefined}
          required
        />
        {deleter && deleter.display && (
          <Trash
            elementClass={deleter.className}
            clickHandler={deleter.clickHandler}
          />
        )}
      </div>
    </label>
  );
};

export interface InputFieldTypes {
  description: string;
  error: string;
  value: string;
  handler: (event: React.ChangeEvent) => void;
  placeholder: string;
  deleter?: {
    className: string;
    display: boolean;
    clickHandler: () => void;
  };
}

export default InputField;
