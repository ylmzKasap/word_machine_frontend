import { ChangeEvent, useContext } from 'react';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import validate_image_upload from '../functions/validate_image';
import InputFile from '../../common/components/input_file';
import UploadedImage from './uploaded_image';

export const ImageUploader: React.FC<{scrollToFormError: () => void}> = ({scrollToFormError}) => {
  // Rendered by "./add_image"

  const { editImageOverlay, setEditImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleChange = (event: ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const file = element.files[0];
      validate_image_upload(file, setEditImageOverlay, scrollToFormError);
    }
  };

  return (
    <div id="image-to-add">
      {editImageOverlay.imageOverlay.uploadType === 'from_device' && (
        <>
          <InputFile
            id="image-upload"
            elemClass="hidden-upload"
            acceptType="image/png, image/jpg, image/jpeg, image/webp"
            handleChange={handleChange}
          />
          <UploadedImage />
        </>
      )}
    </div>
  );
};

export default ImageUploader;
