export const ResponseWithIcon: React.FC<
{description: string;
icon: React.ReactElement}> = ({
  description,
  icon
}) => {
  return (
    <div className="response-with-icon">
      {icon}
      <p className="verify-user-description">{description}</p>
    </div>
  );
};
