const LoadingIcon: React.FC<{ elementClass: string }> = ({ elementClass }) => {
  // Element class can be: 'submitting' (transparent), 'image-request <color>' (centered)
  return (
    <div className={elementClass}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingIcon;
