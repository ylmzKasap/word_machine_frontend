import React from 'react';
import {
  OptionTypes,
  RequestMessageTypes,
  WordTypes,
} from '../../profile_components/types/profilePageTypes';
import { ImageDetailsTypes } from '../common/components/image_details';
import { QuestionPageTypes } from '../question_intro/question_intro';

export interface LocationTypes {
  words: WordTypes[];
  target_language: string;
  source_language: string;
  show_translation: boolean;
  directory: number;
  rootDirectory: number;
}

export type ParamTypes = {
  itemId: string;
  username: string;
};

export interface PageContent {
  component: React.FC<QuestionComponentPropTypes> | null;
  type: string;
  word: WordTypes;
  options: OptionTypes[];
  order: number;
  answered: boolean;
  answeredCorrectly: null | boolean;
  showText?: boolean;
  showThumbs?: boolean;
  clickedThumbs?: string;
}

export type PageTypes = PageContent[];

export interface QuestionComponentPropTypes {
  wordInfo: WordInfoTypes;
  word: WordTypes;
  options: OptionTypes[];
}

export interface QuestionContextTypes {
  goForward: () => void;
  questionPage: QuestionPageTypes;
  setQuestionPage: React.Dispatch<{
    type: string;
    value?: string | number | DeckResponseTypes | RequestMessageTypes | ImageDetailsTypes | boolean;
    index?: number;
  }>;
  reRender: number;
}

export interface TimeoutTypes {
  sound: number;
  click: number;
}

export interface TextAnimationContextTypes {
  setTextAnimation: React.Dispatch<React.SetStateAction<string>>;
}

export interface DeckInfoTypes {
  isLoaded: boolean;
  deck_name: string;
  category_name?: string;
  root_id: string;
  directory: string;
  username: string;
  logged_in_user: string | null;
  correct_sound: string;
  incorrect_sound: string;
};

export interface WordInfoTypes {
  words: WordTypes[];
  target_language: string;
  source_language: string;
  show_translation: boolean;
}

export interface DeckResponseTypes extends DeckInfoTypes, WordInfoTypes {}

export interface OptionPropTypes extends OptionTypes {
  wordInfo: WordInfoTypes;
  animate: () => void;
  number: number;
  key: string;
}
