import { useContext } from 'react';
import { is_mobile } from '../../../../question_components/common/utils';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';

export const UploadedSound: React.FC = () => {
  // Rendered by "./add_sound"

  const mobileDevice = is_mobile();
  const { editImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleClick = () => {
    const inputElement = document.querySelector(
      '#sound-upload'
    ) as HTMLInputElement;
    inputElement.click();
  };

  const sound = editImageOverlay.soundOverlay;

  return (
    <div
      id="uploaded-sound-container"
      className={sound.soundFile ? 'file-present' : undefined}
      onClick={handleClick}
    >
      {!sound.soundFile && (
        <div className="action-to-add-file">
          <i className="arrow-down sound" />
          <p className="description sound">
            {mobileDevice ? 'Tap' : 'Click'}
            {(!mobileDevice ? ' or drag' : '') + ' to upload'}
          </p>
        </div>
      )}
      {sound.soundFile && (
        <audio controls id="uploaded-sound" src={sound.soundUrl} />
      )}
      {sound.soundFile && (
        <span id="file-selected" className="sound">
          {sound.soundFile?.name}
        </span>
      )}
    </div>
  );
};

export default UploadedSound;
