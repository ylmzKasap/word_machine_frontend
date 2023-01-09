export const directoryInfoDefault = {
  item_id: '',
  item_name: '',
  owner: '',
  user_picture: '',
  item_type: '',
  parent_id: '',
  root_id: ''
};

export const requestErrorDefault = {
  exists: false,
  description: '',
};

export const requestMessageDefault = {
  loading: false,
  link: '',
  linkDescription: '',
  description: '',
};

export const cloneStyleDefault = {
  width: '',
  height: '',
  left: '',
  top: '',
};

export const cloneTimeoutDefault = {
  exists: false,
  timeouts: 0,
};

export const draggedElementDefault = {
  id: '',
  name: '',
  type: '',
};

export const wordDefault = [
  {
    translation_id: '',
    deck_id: '',
    word_id: '',
    image_id: '',
    image_path: '',
    sound_path: '',
    sound_id: '',
    item_order: '',
    word_order: 0,
    correct_answer: 0,
    incorrect_answer: 0,
    last_review: null
  },
];

export const categoryInfoDefault = {
  id: '',
  name: '',
  purpose: '',
  targetLanguage: '',
  sourceLanguage: '',
};

export const serverItemDefault = {
  category_id: null,
  item_id: '',
  item_name: '',
  item_order: '',
  item_type: '',
  owner: '',
  parent_id: '',
};

export const cloneElementDefault = {
  exists: false,
  itemName: '',
  cloneStyle: cloneStyleDefault,
  draggedElement: draggedElementDefault
};

export const dragDefault = {
  cloneElement: cloneElementDefault,
  cloneStyle: cloneStyleDefault,
  cloneTimeout: cloneTimeoutDefault,
  draggedElement: draggedElementDefault,
  dragCount: 0,
  isDragging: false,
  dragStarting: false,
  categoryIsDragging: false
};
