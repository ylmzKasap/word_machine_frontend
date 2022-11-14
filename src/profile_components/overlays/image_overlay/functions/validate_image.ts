import { imageNameRegex } from '../../../common/regex';
import { ImageOverlayReducerTypes } from '../addImageReducer';

export default function validate_image_upload(
  file: File,
  setEditImageOverlay: React.Dispatch<ImageOverlayReducerTypes>,
  scrollToFormError: () => void
) {
  if (!file) {
    setEditImageOverlay({
      type: 'changeUploadedImage',
      value: {
        imageError: 'Please upload a valid image file',
      },
    });
    scrollToFormError();
    return;
  }

  if (!file.name.match(imageNameRegex)) {
    setEditImageOverlay({
      type: 'changeUploadedImage',
      value: {
        imageError: 'File type is not supported',
      },
    });
    scrollToFormError();
    return;
  }

  setEditImageOverlay({
    type: 'changeUploadedImage',
    value: {
      imageLoading: 'true',
    },
  });

  var image = new Image();

  image.onload = (e: any) => {
    const eventPath = e.composedPath()[0] as HTMLImageElement;
    if (!eventPath.width || !eventPath.height) {
      setEditImageOverlay({
        type: 'changeUploadedImage',
        value: {
          imageError: 'Please upload a valid image file',
        },
      });
      scrollToFormError();
      return;
    }
    setEditImageOverlay({
      type: 'changeUploadedImage',
      value: {
        imageLoading: 'false',
      },
    });
  };
  image.onerror = () => {
    setEditImageOverlay({
      type: 'changeUploadedImage',
      value: {
        imageError: 'Please upload a valid image file',
      },
    });
    scrollToFormError();
  };
  image.src = URL.createObjectURL(file);
  setEditImageOverlay({
    type: 'changeUploadedImage',
    value: {
      imageUrl: image.src,
      imageFile: file,
    },
  });
}

export interface changeUploadedImageTypes {
  imageUrl?: string;
  imageFile?: File;
  imageError?: string;
  imageLoading?: string;
}
