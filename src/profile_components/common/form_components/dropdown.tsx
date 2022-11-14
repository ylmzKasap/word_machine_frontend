import { seperate_language_region } from '../functions';

const DropDown: React.FC<SelectDropdownTypes> = ({
  description,
  handler,
  topic,
  choices,
  chosen,
  placeholder,
}) => {
  return (
    <div className="input-label">
      {description && (
        <label 
          id="label-dropdown" 
          htmlFor={`dropdown${topic ? '-' + topic.replace('_', '-') : ''}`}>
          {description}
        </label>
      )}
      <select
        id={`dropdown${topic ? '-' + topic.replace('_', '-') : ''}`}
        name={topic}
        className="overlay-dropdown"
        value={chosen ? chosen : 'choose'}
        onChange={handler}
        required
      >
        <option disabled value="choose">
          {placeholder}
        </option>
        {choices.map((v, i) => {
          return (
            <option key={`${v}_${i}`} value={v}>
              {seperate_language_region(v)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

interface SelectDropdownTypes {
  description: string;
  handler: (event: React.SyntheticEvent) => void;
  topic: string;
  choices: string[];
  chosen: string | undefined;
  placeholder: string;
}

export default DropDown;
