import { ChangeEvent } from 'react';

export const InputFile: React.FC<InputFileTypes> = (props) => {
  return (
    <input
      id={props.id}
      className={props.elemClass}
      accept={props.acceptType}
      type="file"
      onChange={props.handleChange}
    />
  );
};

interface InputFileTypes {
  id: string;
  elemClass: string;
  acceptType: string;
  handleChange: (event: ChangeEvent) => void;
}

export default InputFile;
