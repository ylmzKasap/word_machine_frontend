export const ProgressBar: React.FC<{ width: number }> = ({ width }) => {
  // Component of QuestionPage.

  return <div id="progress-bar" style={{ width: `${width}%` }}></div>;
};
