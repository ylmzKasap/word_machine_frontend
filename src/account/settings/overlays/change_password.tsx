import axios from 'axios';
import { useContext, useReducer } from 'react';
import SubmitForm from '../../../profile_components/common/form_components/submit_form';
import { minPasswordLength } from '../../validators/constants';
import { ExitButton } from '../common/exit_button';
import { PasswordField } from '../common/password_field';
import { UserSettingsContext, UserSettingsContextTypes } from '../user_settings';
import { handleChangePasswordOverlay } from './change_password_reducer';

export const ChangePasswordOverlay: React.FC = () => {
  const { setUserSettings } = useContext(UserSettingsContext) as UserSettingsContextTypes;

  const [changePasswordOverlay, setChangePasswordOverlay] = useReducer(
    handleChangePasswordOverlay, changePasswordOverlayDefaults);

  const handleCurrentPasswordChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setChangePasswordOverlay({type: 'changeCurrentPassword', value: input.value});
  };

  const handleNewPasswordChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setChangePasswordOverlay({type: 'changeNewPassword', value: input.value});
  };

  const handleConfirmNewPasswordChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setChangePasswordOverlay({type: 'changeConfirmNewPassword', value: input.value});
  };

  const handleNewPasswordFocusOut = () => {
    const { newPassword } = changePasswordOverlay;

    if (changePasswordOverlay.newPassword && newPassword.length < 8) {
      setChangePasswordOverlay({
        type: 'newPasswordError',
        value: `Enter at lest ${minPasswordLength} characters`
      });
    }
  };

  const handleConfirmPasswordFocusOut = () => {
    const { newPassword, confirmNewPassword } = changePasswordOverlay;

    if (confirmNewPassword && confirmNewPassword.length < 8) {
      setChangePasswordOverlay({
        type: 'confirmPasswordError',
        value: `Enter at lest ${minPasswordLength} characters`
      });
    } else if (newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        setChangePasswordOverlay({
          type: 'confirmPasswordError',
          value: 'Passwords do not match'
        });
      }
    }
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      setUserSettings({type: 'viewNewPassword', value: 'false'});
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (changePasswordOverlay.submitting) return;

    if (changePasswordOverlay.newPassword !== changePasswordOverlay.confirmNewPassword) {
      handleConfirmPasswordFocusOut();
      return;
    } else if (
      changePasswordOverlay.newPasswordError
      || changePasswordOverlay.confirmNewPasswordError
    ) {
      setChangePasswordOverlay(
        {type: 'newPasswordFormError', value: 'Cannot submit due to errors'}
      );
      return;
    }

    setChangePasswordOverlay({type: 'submitNewPassword', value: 'true'});
    axios.post('/change_password', {
      password: changePasswordOverlay.password,
      new_password: changePasswordOverlay.newPassword
    }).then(() => {
      setUserSettings({type: 'viewNewPassword', value: 'false'});
    }).catch((err) => {
      setChangePasswordOverlay({type: 'newPasswordFormError', value: err.response.data.errDesc});
    });
  };
  
  return (
    <div className="input-overlay" onClick={handleOverlayExitByFocus}>
      <div id="form-body" className="dark-shadow medium-form-body">
        <header className="overlay-nav">
          <div className="overlay-description">
            Change password
          </div>
          <ExitButton handleExit={() => 
            setUserSettings({type: 'viewNewPassword', value: 'false'})} />
        </header>
        <form id="form-content" onSubmit={handleSubmit}>
          <PasswordField
            fieldId="current-password"
            className="space-bottom"
            description="Current password"
            value={changePasswordOverlay.password}
            handleChange={handleCurrentPasswordChange}
          />
          <PasswordField
            fieldId="new-password"
            description="New password"
            value={changePasswordOverlay.newPassword}
            handleChange={handleNewPasswordChange}
            handleFocusOut={handleNewPasswordFocusOut}
            error={changePasswordOverlay.newPasswordError}
          />
          <PasswordField
            fieldId="confirm-new-password"
            description="Confirm new password"
            value={changePasswordOverlay.confirmNewPassword}
            handleChange={handleConfirmNewPasswordChange}
            handleFocusOut={handleConfirmPasswordFocusOut}
            error={changePasswordOverlay.confirmNewPasswordError}
          />          
          <SubmitForm 
            description="Change password"
            formError={changePasswordOverlay.formError}
            submitting={changePasswordOverlay.submitting}
          />
        </form>
      </div>  
    </div>
  );
};

export interface ChangePasswordTypes {
  password: string;
  newPassword: string;
  newPasswordError: string;
  confirmNewPassword: string;
  confirmNewPasswordError: string;
  submitting: boolean;
  formError: string;
}

export const changePasswordOverlayDefaults = {
  password: '',
  newPassword: '',
  newPasswordError: '',
  confirmNewPassword: '',
  confirmNewPasswordError: '',
  submitting: false,
  formError: ''
};
