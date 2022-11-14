import { useContext } from 'react';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';

const ImageUploadOption: React.FC<{ option: string; value: string }> = (
  props
) => {
  // Currently not implemented | Can be used to allow different upload methods.
  const { setEditImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleClick = () => {
    setEditImageOverlay({
      type: 'changeImageUploadOption',
      value: props.value,
    });
  };

  return (
    <div className="custom-image-upload" onClick={handleClick}>
      {props.option}
    </div>
  );
};

export default ImageUploadOption;
