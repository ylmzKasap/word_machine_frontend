import { WordTypes } from '../../../profile_components/types/profilePageTypes';
import { PageContent, WordInfoTypes } from '../../types/QuestionPageTypes';

export const process_page_object = (
  obj: PageContent,
  wordInfo: WordInfoTypes
) => {
  const keyType = obj.type === 'IntroduceWord' ? '-intro-' : '-question-';

  return (
    <>
      {obj.component && (
        <obj.component
          wordInfo={wordInfo}
          word={obj.word}
          options={obj.options}
          key={obj.word[wordInfo.target_language as keyof WordTypes] + keyType + String(obj.order)}
        />
      )}
    </>
  );
};
