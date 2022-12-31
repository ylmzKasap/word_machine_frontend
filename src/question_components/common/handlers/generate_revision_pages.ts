import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { WordInfoTypes } from '../../types/QuestionPageTypes';

export function generate_revision_pages(wordInfo: WordInfoTypes): WordTypes[][] {
  let lastIndex = 0;
  let noMoreWords = false;
  let repeatPages: WordTypes[][] = [];
  while (true) {
    let newPage: any[] = [];
    for (let i=0; i < 4; i++) {
      if (wordInfo.words[i + lastIndex]) {
        newPage.push(wordInfo.words[i + lastIndex]);
      } else {
        noMoreWords = true;
        break;
      }
    }
    if (newPage.length) {
      repeatPages.push(newPage);
    }
    if (noMoreWords) {
      return repeatPages;
    }
    lastIndex += 4;
  }
};
