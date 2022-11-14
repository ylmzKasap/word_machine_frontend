import { useContext, useState } from 'react';
import { ProfileContextTypes } from '../../../types/profilePageTypes';
import LeftNumber from './left_number';
import ImageTranslation from './translation/image_translation';
import MainImage from './main_image/main_image';
import OtherImageContainer from './other_images/other_image_container';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ImageRowTypes, RowTypes } from './edit_image_overlay';

const ImageInfo: React.FC<ImageInfoTypes> = (props) => {
  // Rendered by "./edit_image_content" -> EditImageContent
  // Renders following componenets:
  // "./left_number" -> LeftNumber
  // "./translation/image_translation" -> ImageTranslation
  // "./main_image/main_image" -> MainImage
  // "./other_images/other_image_container" -> OtherImageContainer

  const { deckOverlay, setEditImageOverlay } = useContext(
    ProfileContext
  ) as ProfileContextTypes;
  const [requestExists, setRequestExists] = useState(false);
  const [imagesToDisplay, setImagesToDisplay] = useState(3);

  const getSelectedImage = (imageArray: ImageRowTypes[]) => {
    // Takes an array of image objects
    // Returns the selected image and not selected images.

    let selectedImage;
    let otherImages = [];
    for (const imageObj of imageArray) {
      if (imageObj['selected'] === true) {
        selectedImage = imageObj;
        continue;
      }
      otherImages.push(imageObj);
    }
    return [selectedImage, otherImages] as const;
  };

  const [selectedImage, otherImages] = getSelectedImage(
    props.rowArray.imageRow
  );

  const handleAddImage = () => {
    if (!selectedImage) return;
    const targetLanguage = selectedImage[
      deckOverlay.language.targetLanguage!
    ] as string;
    const sourceLanguage = selectedImage[
      deckOverlay.language.sourceLanguage!
    ] as string;
    setEditImageOverlay({
      type: 'view-add-image',
      value: 'show',
      extraValue: {
        target: targetLanguage ? targetLanguage : '',
        source: sourceLanguage ? sourceLanguage : '',
      },
      index: props.order,
    });
  };

  if (!selectedImage) {
    throw Error('No image selected');
  }

  return (
    <div id={`edit-image-box-${props.order}`}>
      <LeftNumber order={props.order} errorIndex={props.errorIndex} />
      <div className="image-box-content">
        <ImageTranslation
          word={selectedImage}
          order={props.order}
          requestExists={requestExists}
          setRequestExists={setRequestExists}
          setImagesToDisplay={setImagesToDisplay}
          audioMixer={props.audioMixer}
        />
        {/* Render image upload section when a translation is entered */}
        {((deckOverlay.purpose === 'study' &&
          selectedImage[deckOverlay.language.targetLanguage!]) ||
          (deckOverlay.purpose === 'learn' &&
            selectedImage[deckOverlay.language.sourceLanguage!])) && (
          <MainImage
            word={selectedImage}
            order={props.order}
            requestExists={requestExists}
            setRequestExists={setRequestExists}
            handleAddImage={handleAddImage}
          />
        )}
        <div id="other-images">
          {(otherImages.length > 0 || selectedImage.image_path) &&
            !requestExists && (
            <OtherImageContainer
              images={otherImages}
              selected={selectedImage}
              order={props.order}
              imagesToDisplay={imagesToDisplay}
              setImagesToDisplay={setImagesToDisplay}
              handleAddImage={handleAddImage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface ImageInfoTypes {
  rowArray: RowTypes;
  order: number;
  key: string;
  errorIndex: number;
  audioMixer: HTMLAudioElement;
}

export default ImageInfo;
