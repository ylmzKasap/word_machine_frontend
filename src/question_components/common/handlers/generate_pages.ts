import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { 
  AskFromPicture,
  AskFromText,
  IntroduceWord } from '../../question_intro/question_content/components';
import { PageTypes, WordInfoTypes } from '../../types/QuestionPageTypes';
import { get_random_options } from './get_random_options';

export function generate_pages(wordInfo: WordInfoTypes): PageTypes {
  // Used by QuestionPage.

  let pages = [];
  let queue: {
    [word: string]: {
      obj: WordTypes;
      countDown: number;
    };
  } = {};

  let i = 0;
  let questionIndex = 0;
  while (true) {
    while (true) {
      // Disperse the questions.
      for (let key in queue) {
        // Tick all pending questions.
        queue = {
          ...queue,
          [key]: {
            ...queue[key],
            countDown: queue[key].countDown - 1,
          },
        };
      }
      // eslint-disable-next-line no-loop-func
      const timeUp = Object.keys(queue).find((x) => queue[x].countDown <= 0);
      if (timeUp) {
        // Push the question into the pages.
        const fiftyChance = Math.random() > 0.5;
        pages.push({
          component: fiftyChance ? AskFromText : AskFromPicture,
          type: fiftyChance ? 'AskFromText' : 'AskFromPicture',
          word: queue[timeUp].obj,
          options: get_random_options(wordInfo, queue[timeUp].obj),
          order: questionIndex,
          answered: false,
          answeredCorrectly: null
        });
        questionIndex++;
        delete queue[timeUp];
      } else {
        break;
      }
    }

    // Push all introduction pages.
    if (i < wordInfo.words.length) {
      pages.push({
        component: IntroduceWord,
        type: 'IntroduceWord',
        word: wordInfo.words[i],
        options: [],
        order: questionIndex,
        answered: false,
        answeredCorrectly: null
      });
      questionIndex++;

      // Create a question to be appended later.
      const word = wordInfo.words[i][wordInfo.target_language as keyof WordTypes] as string;
      const randomRange = Math.random();
      queue[`${word}_${i}`] = {
        obj: wordInfo.words[i],
        countDown: randomRange < 0.15 ? 3 : 2,
      };
    }

    if (i > wordInfo.words.length && Object.keys(queue).length === 0) {
      break;
    }
    i++;
  }
  return [...pages];
}
