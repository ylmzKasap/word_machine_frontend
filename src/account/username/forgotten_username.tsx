import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
import { useReducer, useRef } from 'react';
import { isProduction, serverUrl } from '../../constants';
import SubmitForm from '../../profile_components/common/form_components/submit_form';
import { ExitButton } from '../settings/common/exit_button';
import { captchaSiteKey, validEmailRegex } from '../validators/constants';
import { forgottenUsernameReducer } from './forgotten_username_reducer';


export const ForgottenUsername: React.FC<{handleExit: () => void}> = ({ handleExit }) => {

  const captcha = useRef<null | HCaptcha>(null);
  const [forgotUsernameForm, setForgotUsernameForm] = useReducer(
    forgottenUsernameReducer, forgottenUsernameDefaults);

  const handleEmailChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setForgotUsernameForm({type: 'email', value: input.value});
  };

  const handleEmailFocusOut = () => {
    if (forgotUsernameForm.email && !validEmailRegex.test(forgotUsernameForm.email)) {
      setForgotUsernameForm({type: 'emailError', value: 'Invalid email'});
    }
  };

  const handleResendEmail = () => {
    if (forgotUsernameForm.submittingResend) return;

    setForgotUsernameForm({type: 'submittingResend', value: 'true'});
    axios.post(`${isProduction ? serverUrl : ''}/resend_verification_url`, {
      email: forgotUsernameForm.email
    })
      .then(() => {
        setForgotUsernameForm({type: 'resendEmailSuccess'});
      })
      .catch(err => {
        setForgotUsernameForm({type: 'formError', value: err.response.data.errDesc});
      });
  };

  const handleVerifyCaptcha = (token: string) => {
    setForgotUsernameForm({type: 'captchaSolved', value: token});
  };

  const handleOverlayExitByFocus = (event: React.MouseEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.className === 'input-overlay') {
      handleExit();
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (forgotUsernameForm.submitting) return;
    if (!forgotUsernameForm.captchaSolved || !forgotUsernameForm.captchaToken) {
      return setForgotUsernameForm({type: 'formError', value: 'Please solve the capctha'});
    }
    if (forgotUsernameForm.emailError) {
      return setForgotUsernameForm({type: 'formError', value: 'Please fix the issue above'});
    }

    setForgotUsernameForm({type: 'submitting', value: 'true'});
    axios.post(`${isProduction ? serverUrl : ''}/forgotten_username`, {
      email: forgotUsernameForm.email,
      token: forgotUsernameForm.captchaToken
    })
      .then(() => {
        captcha.current?.resetCaptcha();
        setForgotUsernameForm({type: 'resetEmailSuccess'});
      })
      .catch(err => {
        const errorDescription = err.response.data.errDesc;
        if (err.response.status === 401) {
          setForgotUsernameForm({type: 'emailNotVerified'});
        } else {
          setForgotUsernameForm({type: 'formError', value: errorDescription});
        }
      });
  };

  return (
    <section className="input-overlay" onClick={handleOverlayExitByFocus}>
      <div id="form-body" className="medium-form-body">
        <div className="overlay-nav">
          <header className="overlay-description">Forgotten username</header>
          <ExitButton handleExit={handleExit}/>
        </div>  
        <form id="form-content" onSubmit={handleSubmit}>
          <section className="form-section">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              id="email"
              className={forgotUsernameForm.emailError ? 'error' : ''}
              name="email"
              type="email"
              value={forgotUsernameForm.email}
              onChange={handleEmailChange}
              autoComplete="on"
              onBlur={handleEmailFocusOut}
              required />
            <div className="form-error">
              {forgotUsernameForm.emailError ? forgotUsernameForm.emailError : ''}
            </div>
          </section>
          {!forgotUsernameForm.resetEmailSent
          && <section className="form-section">
            <div className="center-content">
              <HCaptcha 
                ref={captcha}
                sitekey={captchaSiteKey}
                onVerify={handleVerifyCaptcha}
              />
            </div>
          </section>
          }
          <SubmitForm
            formClass="no-margin-bottom"
            buttonClass={forgotUsernameForm.resetEmailSent ? 'request-sent' : ''}
            description={forgotUsernameForm.resetEmailSent ? 'Sent' : 'Send username'}
            submitting={forgotUsernameForm.submitting}
            formError={forgotUsernameForm.formError}
          />
          {(forgotUsernameForm.showResendButton || forgotUsernameForm.verificationEmailSent)
          && <div className="form-error-info">
            <button
              id="regular-button"
              className={'setting-info-button resend-email'
                + `${forgotUsernameForm.submittingResend ? ' no-submit' : ''}`
                + `${forgotUsernameForm.verificationEmailSent ? ' request-sent' : ''}`}
              type="button"
              onClick={handleResendEmail}>
              {forgotUsernameForm.verificationEmailSent 
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

export interface ForgottenUsernameTypes {
  email: string;
  emailError: string;
  formError: string;
  submitting: boolean;
  showResendButton: boolean;
  submittingResend: boolean;
  verificationEmailSent: boolean;
  resetEmailSent: boolean;
  captchaSolved: boolean;
  captchaToken: string;
}

export const forgottenUsernameDefaults = {
  email: '',
  emailError: '',
  formError: '',
  submitting: false,
  showResendButton: false,
  submittingResend: false,
  verificationEmailSent: false,
  resetEmailSent: false,
  captchaSolved: false,
  captchaToken: ''
};
