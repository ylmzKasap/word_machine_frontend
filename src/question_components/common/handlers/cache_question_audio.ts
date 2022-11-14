import { PageTypes } from '../../types/QuestionPageTypes';

export function cache_question_audio(
  pages: PageTypes,
  pageNumber: number,
  pagesToCache: number
) {
  for (let i = 0; i < pagesToCache; i++) {
    if (pages[pageNumber + pagesToCache]) {
      let preCachedAudio = new Audio();
      preCachedAudio.src = pages[pageNumber + pagesToCache].word
        .sound_path as string;
    }
  }
}
