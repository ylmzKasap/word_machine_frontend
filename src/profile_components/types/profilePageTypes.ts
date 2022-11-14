import React from 'react';
import { WordInfoTypes } from '../../question_components/types/QuestionPageTypes';
import { ContextMenuTypes, ContextReducerActionTypes } from '../common/reducers/contextMenuReducer';
import { dragActionTypes, dragTypes } from '../common/reducers/dragReducer';
import { ImageOverlayReducerTypes } from '../overlays/image_overlay/addImageReducer';
import { EditImagesTypes } from '../overlays/image_overlay/edit_image/edit_image_overlay';
import {
  CategoryOverlayTypes,
  DeckOverlayTypes,
  FolderOverlayTypes,
} from './overlayTypes';

interface userInfoTypes {
  user_picture: string;
  requester: string;
}

export type userResponse = [
  serverItemTypes[],
  DirInfoTypes,
  userInfoTypes];

export interface ClipboardTypes {
  action: string | undefined;
  id: string | undefined;
  type: string | undefined;
  directory: string | undefined;
}

export interface DraggedElementTypes {
  id: string;
  name: string;
  type: string;
}

export interface RequestErrorTypes {
  exists: boolean;
  description: string;
}

export interface CloneStyleTypes {
  width?: string;
  height?: string;
  left?: string ;
  top?: string;
  boxShadow?: string;
  transition?: string ;
}

export interface CloneElementTypes {
  exists: boolean;
  itemName: string;
  cloneStyle: CloneStyleTypes;
  draggedElement: DraggedElementTypes;
}

export interface CloneTimeoutTypes {
  exists: boolean;
  timeouts: number;
}

export interface DirInfoTypes {
  item_id: string;
  item_name: string;
  item_type: string;
  owner: string;
  parent_id: string | null | undefined;
  user_picture: string;
  root_id: string;
}

export interface WordTypes {
  translation_id: string;
  deck_id: string;
  image_path: string;
  image_id: string;
  english_us?: string;
  english_uk?: string;
  turkish?: string;
  german?: string;
  french?: string;
  spanish?: string;
  greek?: string;
  sound_path: string;
  sound_id: string;
  word_order: number;
  correct_answer: number;
  incorrect_answer: number;
  last_review: string | null;
}

export interface OptionTypes extends WordTypes {
  isCorrect: boolean;
  wordInfo: WordInfoTypes;
}

export interface serverItemTypes {
  category_id: string | null;
  completed?: boolean;
  deck_key?: string;
  category_key?: string;
  item_id: string;
  item_name: string;
  item_order: string;
  item_type: string;
  owner: string;
  parent_id: string;
  category_source_language?: string;
  category_target_language?: string;
  purpose?: string;
  show_translation?: boolean;
  color?: string;
  source_language?: string;
  target_language?: string;
  words?: WordTypes[];
}

export interface CategoryInfoTypes {
  id: string | undefined;
  name: string | undefined;
  targetLanguage: string | undefined;
  sourceLanguage: string | undefined;
  purpose: string | undefined;
}

export type SetOverlayType = React.Dispatch<{
  type: string;
  value: string;
  innerType?: string;
}>;

export type SetDeckOverlayType = React.Dispatch<{
  type: string;
  value: string;
  innerType?: string;
  categoryInfo?: CategoryInfoTypes;
}>;

export interface ProfileContextTypes {
  directoryPicture: string;
  directoryUsername: string | undefined;
  rootDirectory: string;
  directory: string;
  directoryInfo: DirInfoTypes;
  rawItems: serverItemTypes[];
  items: React.ReactElement[];
  setReRender: React.DispatchWithoutAction;
  clipboard: ClipboardTypes;
  setClipboard: React.Dispatch<React.SetStateAction<ClipboardTypes>>;
  directoryLoaded: Boolean;
  fetchError: boolean;
  requestError: { exists: boolean; description: string | undefined };
  setRequestError: React.Dispatch<React.SetStateAction<RequestErrorTypes>>;
  contextMenu: ContextMenuTypes,
  setContextMenu: React.Dispatch<ContextReducerActionTypes>,
  drag: dragTypes,
  setDrag: React.Dispatch<dragActionTypes>,
  resetDragWithTimeout: () => void,
  columnNumber: number;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleScroll: (event: React.UIEvent<HTMLElement>) => void;
  deckOverlay: DeckOverlayTypes;
  setDeckOverlay: SetDeckOverlayType;
  folderOverlay: FolderOverlayTypes;
  setFolderOverlay: SetOverlayType;
  categoryOverlay: CategoryOverlayTypes;
  setCategoryOverlay: SetOverlayType;
  editImageOverlay: EditImagesTypes;
  setEditImageOverlay: React.Dispatch<ImageOverlayReducerTypes>;
}
