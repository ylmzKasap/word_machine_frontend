import axios from 'axios';
import { useReducer } from 'react';
import SubmitForm from '../../../profile_components/common/form_components/submit_form';
import { ExitButton } from '../../settings/common/exit_button';
import { validEmailRegex } from '../../validators/constants';
import { validate_username } from '../../validators/validate_username';
import { forgottenPasswordReducer } from './forgotten_password_reducer';


export const ForgottenPassword: React.FC<{handleExit: () => void}> = ({ handleExit }) => {

  const [forgotPasswordForm, setForgotPasswordForm] = useReducer(
    forgottenPasswordReducer, forgottenPasswordDefaults);

  const handleEmailChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setForgotPasswordForm({type: 'email', value: input.value});
  };

  const handleUsernameChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const [nameError, showNameError] = validate_username(input.value);
    setForgotPasswordForm({type: 'username', value: input.value});
    if (nameError && showNameError) {
      setForgotPasswordForm({type: 'usernameError', value: nameError});
    } 
  };

  const handleEmailFocusOut = () => {
    if (forgotPasswordForm.email && !validEmailRegex.test(forgotPasswordForm.email)) {
      setForgotPasswordForm({type: 'emailError', value: 'Invalid email'});
    }
  };

  const handleResendEmail = () => {
    if (forgotPasswordForm.submittingResend) return;

    setForgotPasswordForm({type: 'submittingResend', value: 'true'});
    axios.post('resend_verification_url', {
      email: forgotPasswordForm.email
    })
      .then(() => {
        setForgotPasswordForm({type: 'resendEmailSuccess'});
      })
      .catch(err => {
        setForgotPasswordForm({type: 'formError', value: err.response.data.errDesc});
      });
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      handleExit();
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (forgotPasswordForm.submitting) return;
    if (forgotPasswordForm.usernameError || forgotPasswordForm.emailError) {
      return setForgotPasswordForm({type: 'formError', value: 'Please fix the issues above'});
    }

    setForgotPasswordForm({type: 'submitting', value: 'true'});
    axios.post('mail_password_reset', {
      username: forgotPasswordForm.username,
      email: forgotPasswordForm.email
    })
      .then(() => {
        setForgotPasswordForm({type: 'resetEmailSuccess'});
      })
      .catch(err => {
        const errorDescription = err.response.data.errDesc;
        if (err.response.status === 401) {
          setForgotPasswordForm({type: 'emailNotVerified'});
        } else {
          setForgotPasswordForm({type: 'formError', value: errorDescription});
        }
      });
  };

  return (
    <section className="input-overlay" onClick={handleOverlayExitByFocus}>
      <div id="form-body" className="medium-form-body">
        <div className="overlay-nav">
          <header className="overlay-description">Forgotten password</header>
          <ExitButton handleExit={handleExit}/>
        </div>  
        <form id="form-content" onSubmit={handleSubmit}>
          <section className="form-section">
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              id="username"
              className={forgotPasswordForm.usernameError ? 'error' : ''}
              name="username"
              type="text"
              value={forgotPasswordForm.username}
              onChange={handleUsernameChange}
              autoComplete="on"
              required />
            {forgotPasswordForm.usernameError 
              && <div className="form-error"> {forgotPasswordForm.usernameError} </div>}
          </section>
          <section className="form-section">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              id="email"
              className={forgotPasswordForm.emailError ? 'error' : ''}
              name="email"
              type="email"
              value={forgotPasswordForm.email}
              onChange={handleEmailChange}
              autoComplete="on"
              onBlur={handleEmailFocusOut}
              required />
            <div className="form-error">
              {forgotPasswordForm.emailError ? forgotPasswordForm.emailError : ''}
            </div>
          </section>
          <SubmitForm
            formClass="no-margin-bottom"
            buttonClass={forgotPasswordForm.resetEmailSent ? 'request-sent' : ''}
            description={forgotPasswordForm.resetEmailSent ? 'Sent' : 'Reset password'}
            submitting={forgotPasswordForm.submitting}
            formError={forgotPasswordForm.formError}
          />
          {(forgotPasswordForm.showResendButton || forgotPasswordForm.verificationEmailSent)
          && <div className="form-error-info">
            <button
              id="regular-button"
              className={'setting-info-button resend-email'
                + `${forgotPasswordForm.submittingResend ? ' no-submit' : ''}`
                + `${forgotPasswordForm.verificationEmailSent ? ' request-sent' : ''}`}
              type="button"
              onClick={handleResendEmail}>
              {forgotPasswordForm.verificationEmailSent 
                ? <span><i className="fa-solid fa-check" /> Sent</span> 
                : 'Resend email'}
            </button>
          </div>
          }
        </form>
      </div>
    </section>
  );
};

export interface ForgottenPasswordTypes {
  email: string;
  emailError: string;
  username: string;
  usernameError: string;
  formError: string;
  submitting: boolean;
  showResendButton: boolean;
  submittingResend: boolean;
  verificationEmailSent: boolean;
  resetEmailSent: boolean;
}

export const forgottenPasswordDefaults = {
  email: '',
  emailError: '',
  username: '',
  usernameError: '',
  formError: '',
  submitting: false,
  showResendButton: false,
  submittingResend: false,
  verificationEmailSent: false,
  resetEmailSent: false
};
