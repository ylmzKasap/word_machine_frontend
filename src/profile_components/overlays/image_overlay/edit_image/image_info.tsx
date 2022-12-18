import { useContext, useState, useEffect } from 'react';
import LeftNumber from './left_number';
import ImageTranslation from './translation/image_translation';
import MainImage from './main_image/main_image';
import OtherImageContainer from './other_images/other_image_container';
import { ImageRowTypes, RowTypes } from './edit_image_overlay';
import { ProfileContext } from '../../../profile_page/profile_page';
import { ProfileContextTypes } from '../../../types/profilePageTypes';

const ImageInfo: React.FC<ImageInfoTypes> = (props) => {
  // Rendered by "./edit_image_content" -> EditImageContent
  // Renders following componenets:
  // "./left_number" -> LeftNumber
  // "./translation/image_translation" -> ImageTranslation
  // "./main_image/main_image" -> MainImage
  // "./other_images/other_image_container" -> OtherImageContainer

  const { 
    editImageOverlay, setEditImageOverlay } = useContext(ProfileContext) as ProfileContextTypes;
  const [requestExists, setRequestExists] = useState(false);
  const [imagesToDisplay, setImagesToDisplay] = useState(3);

  const { targetLanguage, sourceLanguage, purpose } = editImageOverlay.deckInfo;

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
    const target = selectedImage[targetLanguage] as string;
    const source = selectedImage[sourceLanguage!] as string;
    setEditImageOverlay({
      type: 'view-add-image',
      value: 'show',
      extraValue: {
        target: target ? target : '',
        source: source ? source : '',
      },
      index: props.order,
    });
  };

  if (!selectedImage) {
    throw Error('No image selected');
  }

  return (
    <div id={`edit-image-box-${props.order}`}>
      <LeftNumber 
        order={props.order}
        wordInfo={editImageOverlay.imageInfo}
        errorIndex={props.errorIndex} />
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
        {((purpose === 'study' &&
          selectedImage[targetLanguage]) ||
          (purpose === 'learn' &&
            selectedImage[sourceLanguage!])) && (
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
