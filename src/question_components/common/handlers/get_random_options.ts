import { OptionTypes, WordTypes } from '../../../profile_components/types/profilePageTypes';
import { WordInfoTypes } from '../../types/QuestionPageTypes';
import { shuffle } from '../utils';

export function get_random_options(
  wordInfo: WordInfoTypes,
  word: WordTypes
) {
  // Creates random options with ImageOptionBox and TextOptionBox.
  // Called by ImageOptions and TextOptions.

  const cloneWords = [...wordInfo.words];
  const allWords = shuffle(cloneWords) as WordTypes[];
  const correctOption = word;
  let options = [];

  // Maximum four options.
  let optionCount = allWords.length > 4 ? 4 : allWords.length;

  // Push the correct answer.
  options.push(correctOption);

  let index = 0;
  let correctPushed = false;
  while (options.length !== optionCount) {
    if (index > optionCount + 1) {
      break;
    }
    if (!correctPushed) {
      if (allWords[index].translation_id === correctOption.translation_id) {
        correctPushed = true;
        index++;
        continue;
      }
    }
    options.push(allWords[index]);
    index++;
  }

  options = shuffle(options);
  options = options.map((opt) => ({
    ...opt,
    isCorrect: opt.translation_id === correctOption.translation_id,
  })) as OptionTypes[];

  return [...options];
}
