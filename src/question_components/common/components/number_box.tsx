export const NumberBox: React.FC<NumberBoxPropTypes> = (props) => {
  // Shared by AskFromPicture and AskFromText.
  return (
    <label className={`${props.type}-number-box ${props.style}`}>
      {props.number}
    </label>
  );
};

interface NumberBoxPropTypes {
  type: string;
  number: number;
  style: string;
}
