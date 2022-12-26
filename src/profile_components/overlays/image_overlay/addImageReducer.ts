import { specialCharacterRegex } from '../../common/regex';
import { get_row_default } from '../../types/overlayDefaults';
import { addImageDefaults } from './add_image/add_image';
import {
  editImageCategoryDefaults,
  editImagesDefaults,
  EditImagesTypes,
  RowTypes,
  SoundRowTypes,
  WordSoundTypes,
} from './edit_image/edit_image_overlay';
import { ImageRowTypes } from './edit_image/edit_image_overlay';
import { changeUploadedImageTypes } from './functions/validate_image';
import { changeUploadedSoundTypes } from './functions/validate_sound';

export const handleEditImageOverlay = (
  state: EditImagesTypes,
  action: ImageOverlayReducerTypes
): EditImagesTypes => {
  switch (action.type) {
    case 'view-edit-image':
      const resetOverlay = action.value === 'reset'
       || (state.deckInfo.editing && action.value === 'hide'); 

      const overlayReturnObj = resetOverlay ? editImagesDefaults : state;
      // Show or hide image editing overlay.
      return {
        ...overlayReturnObj,
        display: action.value === 'show',
      };

    case 'view-add-image':
      // Show or hide image uploading overlay.
      const returnObj =
        action.value === 'reset' ? addImageDefaults : state.imageOverlay;
      const languages = action.extraValue as LanguageTypes;
      return {
        ...state,
        imageOverlay: {
          ...returnObj,
          display: action.value === 'show',
          target: {
            value: action.extraValue
              ? languages.target
              : action.value === 'reset'
                ? ''
                : state.imageOverlay.target.value,
            error:
              action.value === 'reset'
                ? ''
                : action.extraValue
                  ? specialCharacterRegex.test(languages.target)
                    ? state.imageOverlay.target.error
                    : ''
                  : '',
          },
          source: {
            value: action.extraValue
              ? languages.source
              : action.value === 'reset'
                ? ''
                : state.imageOverlay.source.value,
            error:
              action.value === 'reset'
                ? ''
                : action.extraValue
                  ? specialCharacterRegex.test(languages.source)
                    ? state.imageOverlay.source.error
                    : ''
                  : '',
          },
          displayedIndex:
            action.value !== 'show' || action.index === undefined
              ? null
              : action.index,
        },
      };

    case 'view-add-sound': {
      const soundReset = action.value === 'reset';
      return {
        ...state,
        soundOverlay: {
          display: action.value === 'show',
          soundText: action.extraValue ? (action.extraValue as string) : '',
          soundFile: soundReset ? null : state.soundOverlay.soundFile,
          soundUrl: soundReset ? '' : state.soundOverlay.soundUrl,
          formError: soundReset ? '' : state.soundOverlay.formError,
          soundToReload:
            action.index !== undefined
              ? `${action.index}`
              : soundReset
                ? ''
                : state.soundOverlay.soundToReload,
        },
      };
    }

    case 'changePicture':
      // Change the main picture when some other picture is clicked.
      if (action.index === undefined) return state;
      let newImageInfo = [...state.imageInfo];
      let updatedArray = state.imageInfo[action.index].imageRow;

      updatedArray = updatedArray.map((row) => ({
        ...row,
        selected: row.translation_id === action.value
      }));

      newImageInfo[action.index].imageRow = updatedArray;

      return {
        ...state,
        imageInfo: newImageInfo,
      };

    case 'changeValue':
      // Replace a specific key value with a new one in a particular index.
      let changedArray = state.imageInfo.reduce(
        (previousValue, currentValue, i) => {
          if (i !== action.index) return [...previousValue, currentValue];
          const rowObj = currentValue.imageRow.map((item) => {
            if (item.selected === true) {
              return {
                ...item,
                [action.key!]: action.value,
              };
            }
            return item;
          });
          return [
            ...previousValue,
            {
              imageRow: rowObj,
              soundRow: {
                allSounds: [],
                selectedIndex: 0,
              },
            },
          ] as RowTypes[];
        },
        [] as RowTypes[]
      );
      return {
        ...state,
        imageInfo: changedArray,
      };

    case 'changeImages':
      // Replace an array of image objects with a new one.
      if (!state.display) return state;
      
      let imageArray = state.imageInfo;
      const newImages = action.value as ImageRowTypes[];

      if (!imageArray[action.index as number]) {
        return state;
      }

      const wordId = imageArray[action.index as number].imageRow[0].word_id 
      || action.extraValue as string;

      const imagesWithWordId = newImages.map(image => ({
        ...image,
        word_id: wordId
      }));

      imageArray[action.index as number].imageRow = imagesWithWordId;
      imageArray[action.index as number].soundRow = {
        allSounds: [],
        selectedIndex: 0,
      };

      return {
        ...state,
        imageInfo: imageArray,
      };

    case 'setImages':
      const languageInfo = action.extraValue as OverlayLanguageTypes;
      const foundImages = action.value as RowTypes[];
      let allRows : RowTypes[] = [];

      if (languageInfo.deckInfo.editing) {
        // Show skipping rows for word_order
        // May be a problem when the user adds translations while some rows are still empty.
        let lastWordOrder = 0;
        const { targetLanguage, sourceLanguage } = languageInfo.deckInfo;
        for (let image of foundImages) {
          while (lastWordOrder < Number(image.imageRow[0].word_order)) {
            allRows.push({
              imageRow: [get_row_default(targetLanguage, sourceLanguage)], 
              soundRow: {
                allSounds: [],
                selectedIndex: 0
              }});
            lastWordOrder++;
          }
          allRows.push(image);
          lastWordOrder++;
        }
      }
      
      return {
        ...state,
        display: true,
        deckInfo: languageInfo.deckInfo,
        categoryInfo: languageInfo.categoryInfo || editImageCategoryDefaults,
        imageInfo: languageInfo.deckInfo.editing ? allRows : foundImages
      };

    case 'changeEdited':
      // Change the currently editable input element.
      return {
        ...state,
        editedId: action.value as string,
      };

    case 'addRow':
      const value = action.value as RowTypes;
      return {
        ...state,
        imageInfo: [...state.imageInfo, value],
      };

    case 'deleteRow':
      const index = action.value as number;
      let arrayToReturn: RowTypes[] = [];
      const deletedImgArray = [
        ...state.imageInfo.slice(0, index),
        ...state.imageInfo.slice(index + 1)
      ];

      if (state.deckInfo.editing) {
        let language = state.deckInfo.purpose === 'study'
          ? state.deckInfo.targetLanguage
          : state.deckInfo.sourceLanguage;
        arrayToReturn = deletedImgArray.filter(i => i.imageRow[0][language!]);
      }

      return {
        ...state,
        imageInfo: state.deckInfo.editing ? arrayToReturn : deletedImgArray,
      };

    case 'changeUploadedImage':
      const imgObject = action.value as changeUploadedImageTypes;
      if (imgObject.imageError) {
        return {
          ...state,
          imageOverlay: {
            ...state.imageOverlay,
            imageUrl: '',
            imageName: '',
            imageFile: null,
            extension: '',
            formError: imgObject.imageError,
            imageLoading: false,
          },
        };
      }
      if (imgObject.imageLoading) {
        return {
          ...state,
          imageOverlay: {
            ...state.imageOverlay,
            imageLoading: imgObject.imageLoading === 'true',
          },
        };
      }
      URL.revokeObjectURL(state.imageOverlay.imageUrl);
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          imageUrl: imgObject.imageUrl as string,
          imageName: imgObject.imageFile!.name.split('.')[0] as string,
          extension: imgObject.imageFile!.name.split('.')[1] as string,
          imageFile: imgObject.imageFile as File,
          formError: '',
        },
      };

    case 'changeImageUploadOption':
      // Currently not implemented.
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          uploadType: action.value as string,
        },
      };

    case 'changeTarget':
      const targetObj = action.value as ValueWithError;
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          target: {
            value: targetObj.value,
            error: targetObj.error,
          },
        },
      };

    case 'changeSource':
      const sourceObj = action.value as ValueWithError;
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          source: {
            value: sourceObj.value,
            error: sourceObj.error,
          },
        },
      };

    case 'changeArtist':
      const artistObj = action.value as ValueWithError;
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          artist: {
            value: artistObj.value,
            error: artistObj.error,
          },
        },
      };

    case 'changeArtistReference':
      let referenceObj = action.value as ValueWithError;
      const allReferencess = state.imageOverlay.references;
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          references: [
            ...allReferencess.slice(0, action.index),
            referenceObj,
            ...allReferencess.slice(action.index! + 1),
          ],
          artistReferenceError: referenceObj.error,
        },
      };

    case 'editArtistReference':
      let allReferences = state.imageOverlay.references;
      let newError = '';
      if (action.value === 'delete') {
        allReferences = [
          ...allReferences.slice(0, action.index),
          ...allReferences.slice(action.index! + 1),
        ];
      } else if (action.value === 'add') {
        allReferences = [...allReferences, { value: '', error: '' }];
      }
      const nextError = allReferences.find((x) => x.error)?.error;
      if (nextError) {
        newError = nextError;
      }
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          references: allReferences,
          artistReferenceError: newError,
        },
      };

    case 'changeReferenceError':
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          artistReferenceError: action.value as string,
        },
      };

    case 'changeImageFormError':
      return {
        ...state,
        imageOverlay: {
          ...state.imageOverlay,
          formError: action.value as string,
        },
      };

    case 'changeUploadedSound': {
      const actionValue = action.value as changeUploadedSoundTypes;
      if (actionValue.error) {
        return {
          ...state,
          soundOverlay: {
            ...state.soundOverlay,
            soundFile: null,
            soundUrl: '',
            formError: actionValue.error,
          },
        };
      }
      return {
        ...state,
        soundOverlay: {
          ...state.soundOverlay,
          soundFile: actionValue.soundFile!,
          soundUrl: actionValue.soundUrl!,
          formError: '',
        },
      };
    }

    case 'updateSounds':
      let arrayToUpdate = [...state.imageInfo];
      const allSounds = action.value as WordSoundTypes[];

      arrayToUpdate[action.index!].soundRow = {
        allSounds: allSounds,
        selectedIndex: action.extraValue as number,
      } as SoundRowTypes;

      return {
        ...state,
        imageInfo: arrayToUpdate,
      };

    case 'incrementSoundIndex':
      let incrementSound = [...state.imageInfo];

      incrementSound[action.index as number].soundRow.selectedIndex = action.value as number;

      return {
        ...state,
        imageInfo: incrementSound,
      };

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

interface ValueWithError {
  value: string;
  error: string;
}

interface LanguageTypes {
  target: string;
  source: string;
}

interface OverlayLanguageTypes {
  deckInfo: {
    id: string;
    name: string;
    targetLanguage: string;
    sourceLanguage?: string | null;
    purpose: string;
    includeTranslation: boolean;
    editing?: boolean;
  },
  categoryInfo?: {
    id: string;
    targetLanguage: string;
    sourceLanguage: string;
    purpose: string;
  }
}

export interface ImageOverlayReducerTypes {
  type: string;
  value:
    | string
    | number
    | boolean
    | ImageRowTypes[]
    | changeUploadedSoundTypes
    | RowTypes
    | ImageRowTypes
    | File
    | changeUploadedImageTypes
    | ValueWithError;
  extraValue?: LanguageTypes | OverlayLanguageTypes | string | number;
  key?: string;
  index?: number;
}
