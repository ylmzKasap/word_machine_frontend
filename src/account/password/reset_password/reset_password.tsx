import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isProduction, serverUrl } from '../../../constants';
import SubmitForm from '../../../profile_components/common/form_components/submit_form';
import { PasswordField } from '../../settings/common/password_field';
import { CheckVerification } from '../../verification/check_verification';
import { resetPasswordReducer } from './reset_password_reducer';


export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { reset_string } = useParams();

  const [resetReducer, setResetReducer] = useReducer(resetPasswordReducer, resetPasswordDefaults);

  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/reset_exists/${reset_string}`)
      .then(res => {
        setResetReducer({type: 'resetExists', value: 'true'});
      })
      .catch(err => {
        setResetReducer({type: 'resetExists', error: err.response.data.errDesc});
      });
  }, []);

  const handlePasswordChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setResetReducer({type: 'newPassword', value: input.value});
  };

  const handlePasswordFocusOut = () => {
    if (resetReducer.newPassword && resetReducer.newPassword.length < 8) {
      setResetReducer({type: 'newPasswordError', value: 'Enter at least 8 characters'});
    }
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setResetReducer({type: 'confirmPassword', value: input.value});
  };

  const handleConfirmPasswordFocusOut = () => {
    if (resetReducer.confirmPassword && resetReducer.confirmPassword.length < 8) {
      setResetReducer({type: 'confirmPasswordError', value: 'Enter at least 8 characters'});
    } else if (resetReducer.newPassword !== resetReducer.confirmPassword) {
      setResetReducer({type: 'confirmPasswordError', value: 'Passwords do not match'});
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (resetReducer.submitting) return;

    const { newPassword, confirmPassword } = resetReducer;
    if (newPassword !== confirmPassword) return;
    if (newPassword.length + confirmPassword.length < 16) return;

    setResetReducer({type: 'submitting', value: 'true'});
    axios.post(`${isProduction ? serverUrl : ''}/reset_password`, {
      reset_string: reset_string,
      new_password: newPassword
    }).then(() => {
      navigate('/login');
    }).catch(err => {
      setResetReducer({type: 'formError', value: err.response.data.errDesc});
    });
  };

  return (
    <>
      {
        (resetReducer.resetStringExists === false)
          && <CheckVerification
            header="Reset password"
            status={false}
            invalidDescription="Invalid or expired url"
          />
      }
      {
        (resetReducer.resetStringExists)
          && <div id="form-prompt">
            <div id="form-body" className="medium-form-body navbar-margin">
              <header id="form-header">Reset password</header>
              <form id="form-content" onSubmit={handleSubmit}>
                <PasswordField 
                  fieldId="new-password"
                  description="New password"
                  value={resetReducer.newPassword}
                  error={resetReducer.newPasswordError}
                  handleChange={handlePasswordChange}
                  handleFocusOut={handlePasswordFocusOut}
                />

                <PasswordField 
                  fieldId="confirm-password"
                  description="Confirm password"
                  value={resetReducer.confirmPassword}
                  error={resetReducer.confirmPasswordError}
                  handleChange={handleConfirmPasswordChange}
                  handleFocusOut={handleConfirmPasswordFocusOut}
                />
        
                <SubmitForm
                  formClass="no-margin-bottom"
                  buttonClass={resetReducer.resetComplete ? 'request-sent' : ''}
                  description={resetReducer.resetComplete ? 'Done' : 'Reset'}
                  submitting={resetReducer.submitting}
                  formError={resetReducer.formError}
                />
              </form>
            </div>
          </div>
      }
    </>
  );
};

export interface ResetPasswordTypes {
  resetStringExists: null | boolean;
  formError: string;
  submitting: boolean;
  newPassword: string;
  newPasswordError: string,
  confirmPassword: string;
  confirmPasswordError: string,
  resetComplete: boolean;
}

export const resetPasswordDefaults = {
  resetStringExists: null,
  formError: '',
  submitting: false,
  newPassword: '',
  newPasswordError: '',
  confirmPassword: '',
  confirmPasswordError: '',
  resetComplete: false
};
