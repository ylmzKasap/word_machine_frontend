export const WordTranslation: React.FC<{ translation: string }> = (props) => {
  // Shared by AskFromPicture and AskFromText.
  return <div className="word-translation">{props.translation}</div>;
};
