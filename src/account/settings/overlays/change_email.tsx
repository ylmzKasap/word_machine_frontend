import axios from 'axios';
import { useContext, useState, useReducer } from 'react';
import { isProduction, serverUrl } from '../../../constants';
import { NavbarContext, NavbarContextTypes } from '../../../navbar/layout_with_navbar';
import SubmitForm from '../../../profile_components/common/form_components/submit_form';
import { TogglePasswordVisibility } from '../../password/reset_password/toggle_password_visibility';
import { ExitButton } from '../common/exit_button';
import { UserSettingsContext, UserSettingsContextTypes } from '../user_settings';
import { handleChangeEmailOverlay } from './change_email_reducer';

export const ChangeEmailOverlay: React.FC = () => {
  const { setReRender } = useContext(NavbarContext) as NavbarContextTypes;
  const { setUserSettings } = useContext(UserSettingsContext) as UserSettingsContextTypes;

  const [changeEmailOverlay, setChangeEmailOverlay] = useReducer(
    handleChangeEmailOverlay, changeEmailOverlayDefaults);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setChangeEmailOverlay({type: 'changePasswordForEmail', value: input.value});
  };

  const handleEmailChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setChangeEmailOverlay({type: 'changeNewEmail', value: input.value});
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      setUserSettings({type: 'viewEmail', value: 'false'});
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (changeEmailOverlay.submitting) return;

    setChangeEmailOverlay({type: 'submitNewEmail', value: 'true'});
    axios.post(`${isProduction ? serverUrl : ''}/change_email`, {
      password: changeEmailOverlay.password,
      new_email: changeEmailOverlay.newEmail
    }).then(() => {
      setReRender();
      setUserSettings({type: 'viewEmail', value: 'false'});
    }).catch((err) => {
      setChangeEmailOverlay({type: 'newEmailFormError', value: err.response.data.errDesc});
    });
  };
  
  return (
    <div className="input-overlay" onClick={handleOverlayExitByFocus}>
      <div id="form-body" className="short-form-body dark-shadow">
        <form id="form-content" onSubmit={handleSubmit}>
          <header className="overlay-nav">
            <div className="overlay-description">
              Change email
            </div>
            <ExitButton handleExit={() => setUserSettings({type: 'viewEmail', value: 'false'})} />
          </header>
          <section className="form-section">
            <label className="form-label" htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={changeEmailOverlay.password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
            />
            <TogglePasswordVisibility handleVisibility={setShowPassword} />
          </section>
          <section className="form-section">
            <label className="form-label" htmlFor="new-email">
              New Email
            </label>
            <input 
              id="new-email"
              name="new-email"
              type="email"
              value={changeEmailOverlay.newEmail}
              onChange={handleEmailChange}
              required />
          </section>
          <SubmitForm 
            description="Change email"
            formError={changeEmailOverlay.formError}
            submitting={changeEmailOverlay.submitting}
          />
        </form>
      </div>  
    </div>
  );
};

export interface ChangeEmailTypes {
  newEmail: string;
  password: string;
  submitting: boolean;
  formError: string;
}

export const changeEmailOverlayDefaults = {
  newEmail: '',
  password: '',
  submitting: false,
  formError: ''
};
