import { 
  AskFromPicture,
  AskFromText } from '../../question_intro/question_content/components';
import { PageTypes, WordInfoTypes } from '../../types/QuestionPageTypes';
import { shuffle } from '../utils';
import { get_random_options } from './get_random_options';

export function generate_test_pages(wordInfo: WordInfoTypes): PageTypes {
  // Used by QuestionPage.

  let pages = [];
  const shuffledWords = shuffle(wordInfo.words);

  for (let i=0; i<shuffledWords.length; i++) {
    const fiftyChance = Math.random() > 0.5;
    pages.push({
      component: fiftyChance ? AskFromText : AskFromPicture,
      type: fiftyChance ? 'AskFromText' : 'AskFromPicture',
      word: shuffledWords[i],
      options: get_random_options(wordInfo, shuffledWords[i]),
      order: i,
      answered: false,
      answeredCorrectly: null
    });
  }

  return [...pages];
}
