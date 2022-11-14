const Checkbox: React.FC<CheckboxTypes> = (props) => {
  const { description, value, handler } = props;

  return (
    <label className="input-label checkbox">
      <div className="checkbox-info">
        <span id="checkbox-description" className={value ? 'checked' : 'unchecked'}>
          {description}
        </span>
        <input type="checkbox" onChange={handler} checked={value} />
        <span id="checkmark" className={value ? 'checked' : 'unchecked'}>
          {value 
            ? <i className="fa-solid fa-check" />
            : <i className="fa-solid fa-xmark"></i>}
        </span>
      </div>
    </label>
  );
};

interface CheckboxTypes {
  description: string;
  value: boolean;
  handler: () => void;
}

export default Checkbox;
