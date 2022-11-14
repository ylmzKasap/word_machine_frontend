import { useContext } from 'react';
import { UserSettingsContext, UserSettingsContextTypes } from '../user_settings';

export const PasswordSetting: React.FC = () => {
  const { setUserSettings } = useContext(UserSettingsContext) as UserSettingsContextTypes;

  return (
    <>
      <div className="setting-info-item">
        ***********
      </div>
      <button 
        className="setting-info-button"
        type="button"
        onClick={() => setUserSettings({type: 'viewNewPassword', value: 'true'})}>
        Change password
      </button>
    </>
  );
};
