import { PageTypes } from '../../types/QuestionPageTypes';

export function cache_question_image(
  pages: PageTypes,
  pageNumber: number,
  pagesToCache: number
) {
  for (let i = 0; i < pagesToCache; i++) {
    if (pages[pageNumber + i]) {
      let preCachedImage = new Image();
      const imagePath = pages[pageNumber + i].word.image_path;
      if (!imagePath) continue;

      preCachedImage.src = imagePath as string;
      if (pages[pageNumber + i].options[0]) {
        for (let option of pages[pageNumber + i].options) {
          let preCachedImage = new Image();
          if (!option.image_path) continue;
          preCachedImage.src = option.image_path as string;
        }
      }
    }
  }
}
