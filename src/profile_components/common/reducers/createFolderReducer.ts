import {
  folderOverlayDefaults
} from '../../types/overlayDefaults';
import { FolderOverlayTypes } from '../../types/overlayTypes';

export const handleFolderOverlay = (
  state: FolderOverlayTypes,
  action: { 
    type: string;
    value: string | EditFolderActionTypes;
    innerType?: string }
): FolderOverlayTypes => {
  switch (action.type) {
    case 'folderName':
      return {
        ...state,
        folderName: action.value as string,
      };

    case 'folderType':
      return {
        ...state,
        folderType: action.value as string,
      };

    case 'errors':
      const error = action.value as string;
      switch (action.innerType) {
        case 'name':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: '',
              nameError: error ? error : '',
            },
          };
        case 'form':
          return {
            ...state,
            errors: {
              ...state.errors,
              formError: error
                ? error
                : '',
            },
          };
        default:
          console.log(`Unknown error type: ${action.innerType}`);
          return state;
      }

    case 'view':
      const returnObj =  (action.value === 'reset' || state.editing) 
        ? folderOverlayDefaults : state;

      return {
        ...returnObj,
        display: action.value === 'show',
      };

    case 'edit':
      const editingData = action.value as EditFolderActionTypes;
      return {
        ...state,
        display: true,
        editing: true,
        folderName: editingData.itemName,
        folderId: editingData.itemId
      };

    case 'clear':
      return folderOverlayDefaults;

    default:
      console.log(`Unknown action type: ${action.type}`);
      return state;
  }
};

export interface EditFolderActionTypes {
  itemName: string;
  itemId: string;
}
