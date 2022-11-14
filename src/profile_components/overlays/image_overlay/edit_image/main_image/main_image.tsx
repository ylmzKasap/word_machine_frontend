import { useContext, useEffect } from 'react';
import LoadingIcon from '../../../../../assets/animations/loading_icon';
import { ProfileContext } from '../../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../../types/profilePageTypes';
import { ImageRowTypes } from '../edit_image_overlay';
import ImageNotFound from './image_not_found';

const MainImage: React.FC<MainImagePropTypes> = (props) => {
  // Rendered by "../image_info" -> ImageInfo

  const { deckOverlay } = useContext(ProfileContext) as ProfileContextTypes;

  useEffect(() => {
    if (!props.word.image_path) return;
    const newImage = new Image();
    props.setRequestExists(true);
    newImage.onload = () => props.setRequestExists(false);
    newImage.onerror = () => props.setRequestExists(false);
    newImage.src = props.word.image_path;
  }, [props.word.image_path]);

  return (
    <div
      id={`image-box-${props.order}`}
      className={props.word.image_path ? '' : 'not-found'}
    >
      {props.requestExists && <LoadingIcon elementClass="image-request" />}
      {props.word.image_path ? (
        <img
          src={props.word.image_path as string}
          alt={props.word[deckOverlay.language.targetLanguage!] as string}
        />
      ) : (
        !props.requestExists && (
          <ImageNotFound
            handleAddImage={props.handleAddImage}
            order={props.order}
          />
        )
      )}
    </div>
  );
};

interface MainImagePropTypes {
  word: ImageRowTypes;
  order: number;
  requestExists: boolean;
  setRequestExists: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddImage: () => void;
}

export default MainImage;
