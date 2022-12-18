import { PageTypes } from '../../types/QuestionPageTypes';

export function cache_question_audio(
  pages: PageTypes,
  pageNumber: number,
  pagesToCache: number
) {
  for (let i = 0; i < pagesToCache; i++) {
    if (pages[pageNumber + pagesToCache]) {
      let preCachedAudio = new Audio();
      const audioUrl = pages[pageNumber + pagesToCache].word.sound_path as string;
      if (!audioUrl) continue;
      preCachedAudio.src = audioUrl as string;
    }
  }
}
