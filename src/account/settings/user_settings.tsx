import { useEffect, useContext, useReducer, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NavbarContext, 
  NavbarContextTypes } from '../../navbar/layout_with_navbar';
import { RequestInfo } from '../../profile_components/profile_page/other_components';
import { ChangeEmailOverlay } from './overlays/change_email';
import { ChangePasswordOverlay } from './overlays/change_password';
import { EmailSettings } from './setting_sections/email_settings';
import { PasswordSetting } from './setting_sections/password_settings';
import { SettingSection } from './setting_sections/setting_section';
import { handleUserSettings } from './user_settings_reducer';


export const UserSettingsContext = createContext<UserSettingsContextTypes | undefined>(undefined);

export const UserSettings: React.FC = () => {
  const navigate = useNavigate();

  const { sessionChecked, currentUserInfo } = useContext(NavbarContext) as NavbarContextTypes;
  const [userSettings, setUserSettings] = useReducer(handleUserSettings, userSettingsDefault);

  useEffect(() => {
    if (sessionChecked && !currentUserInfo.username) {
      navigate('/login');
    }
  }, [sessionChecked, currentUserInfo]);

  return (
    <UserSettingsContext.Provider value={{
      userSettings: userSettings,
      setUserSettings: setUserSettings
    }} >
      <div id="user-settings">
        <div id="setting-container">
          <header id="setting-container-header">
            Settings
          </header>
          <SettingSection
            iconClass="fa-solid fa-envelope"
            description="Email Adress"
            settingHeader="Registered email"
            content={<EmailSettings 
              currentUserInfo={currentUserInfo} />}
          />
          <SettingSection
            iconClass="fa-solid fa-lock"
            description="Password"
            settingHeader="Account password"
            content={<PasswordSetting />}
          />
          {userSettings.showChangeEmailOverlay && <ChangeEmailOverlay />}
          {userSettings.showChangePasswordOverlay && <ChangePasswordOverlay />}
          {userSettings.requestError 
            && <RequestInfo
              className="request-error" 
              description={userSettings.requestError}
              exitHandler={() => setUserSettings({type: 'requestError', value: ''})} />}
        </div>
      </div>
    </UserSettingsContext.Provider>
  );
};

const userSettingsDefault = {
  showChangeEmailOverlay: false,
  showChangePasswordOverlay: false,
  requestError: ''
};

export interface UserSettingsTypes {
  showChangeEmailOverlay: boolean;
  showChangePasswordOverlay: boolean;
  requestError: string;
}

export interface UserSettingsContextTypes {
  userSettings: UserSettingsTypes;
  setUserSettings: React.Dispatch<{
    type: string;
    value?: string;
    innerType?: string | undefined;
}>
}
