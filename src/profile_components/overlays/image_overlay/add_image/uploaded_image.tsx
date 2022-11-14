import React, { useContext } from 'react';
import LoadingIcon from '../../../../assets/animations/loading_icon';
import { is_mobile } from '../../../../question_components/common/utils';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';

export const UploadedImage: React.FC = (props) => {
  // Rendered by "./image_uploader"

  const mobileDevice = is_mobile();
  const { editImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleClick = () => {
    const inputElement = document.querySelector(
      '#image-upload'
    ) as HTMLInputElement;
    inputElement.click();
  };

  const image = editImageOverlay.imageOverlay;

  return (
    <div id="uploaded-image-container" onClick={handleClick}>
      {editImageOverlay.imageOverlay.imageLoading && (
        <LoadingIcon elementClass="image-request" />
      )}
      {!image.imageUrl && (
        <div className="action-to-add-file">
          <i className="arrow-down" />
          <p className="description">
            {mobileDevice ? 'Tap' : 'Click'}
            {(!mobileDevice ? ' or drag' : '') + ' to upload'}
          </p>
        </div>
      )}
      {image.imageUrl && (
        <img id="uploaded-image" src={image.imageUrl} alt={image.imageName} />
      )}
      {image.imageUrl && (
        <span id="file-selected">{image.imageFile?.name}</span>
      )}
    </div>
  );
};

export default UploadedImage;
