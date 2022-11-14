import { PageTypes } from '../../types/QuestionPageTypes';

export function cache_question_image(
  pages: PageTypes,
  pageNumber: number,
  pagesToCache: number
) {
  for (let i = 0; i < pagesToCache; i++) {
    if (pages[pageNumber + i]) {
      let preCachedImage = new Image();
      preCachedImage.src = pages[pageNumber + i].word.image_path as string;
      if (pages[pageNumber + i].options[0]) {
        for (let option of pages[pageNumber + i].options) {
          let preCachedImage = new Image();
          preCachedImage.src = option.image_path as string;
        }
      }
    }
  }
}
