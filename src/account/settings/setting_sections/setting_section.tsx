export const SettingSection: React.FC<{
  iconClass?: string;
  description: string;
  settingHeader: string;
  content: JSX.Element;
}> = ({iconClass, description, settingHeader, content}) => {
  return (
    <section className="setting-section">
      <header className="setting-header">
        {iconClass && <i className={iconClass}></i>}
        <div className="setting-description">
          {description}
        </div>
      </header>
      <div className="setting-info-container">
        <div className="setting-info">
          <div className="setting-info-header">
            {settingHeader}
          </div>
          {content}
        </div>
      </div>
    </section>
  );
};
