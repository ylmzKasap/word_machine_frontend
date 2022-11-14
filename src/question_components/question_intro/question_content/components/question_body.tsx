export const QuestionBody: React.FC<QuestionBodyTypes> = ({
  animation,
  page,
}) => {
  // Children: (Indirect) IntroduceWord, AskFromPicture, AskFromText.
  return <div className={`main-page ${animation}`}>{page}</div>;
};

export interface QuestionBodyTypes {
  animation: string;
  page: JSX.Element;
}
