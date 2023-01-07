import { WordTypes } from '../../../profile_components/types/profilePageTypes';

export function cache_revision_media(
  pageToCache: WordTypes[]
) {
  if (!pageToCache) return;
  for (let page of pageToCache) {
    let preCachedImage = new Image();
    preCachedImage.src = page.image_path;
    let preCachedAudio = new Audio();
    preCachedAudio.src = page.sound_path;
  }
}
