import axios from 'axios';
import { useContext } from 'react';
import { isProduction, serverUrl } from '../../../../../constants';
import { ProfileContext } from '../../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../../types/profilePageTypes';
import { ImageRowTypes } from '../edit_image_overlay';

const OtherImage: React.FC<OtherImageTypes> = ({ imgObj, order }) => {
  // Rendered by "./other-image-container"  -> OtherImageContainer

  const { setEditImageOverlay, editImageOverlay, setRequestError } = useContext(
    ProfileContext
  ) as ProfileContextTypes;

  const handleClick = () => {
    // Set the image object as the main one.
    setEditImageOverlay({
      type: 'changePicture',
      value: imgObj.translation_id as string,
      index: order,
    });

    if (editImageOverlay.deckInfo.editing) {
      axios
        .put(`${isProduction ? serverUrl : ''}/image_change`, {
          word_id: imgObj.word_id,
          image_id: imgObj.image_id,
          translation_id: imgObj.translation_id
        })
        .then(() => null)
        .catch(err => setRequestError({
          exists: true,
          description: err.response.data.errDesc,
        }));
    }
  };

  return (
    <img
      onClick={handleClick}
      src={imgObj.image_path as string}
      alt={imgObj[editImageOverlay.deckInfo.targetLanguage] as string}
    />
  );
};

interface OtherImageTypes {
  imgObj: ImageRowTypes;
  order: number;
}

export default OtherImage;
