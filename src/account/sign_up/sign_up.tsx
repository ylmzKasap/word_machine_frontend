import axios from 'axios';
import { ChangeEvent, useReducer, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isProduction, serverUrl } from '../../constants';
import SubmitForm from '../../profile_components/common/form_components/submit_form';
import { TogglePasswordVisibility } from '../password/reset_password/toggle_password_visibility';
import { validate_email } from '../validators/validate_email';
import { checkEmailExists, checkUsernameExists } from './control_functions';
import { handleSignUpForm } from './sign_up_reducer';

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const formErrorRef = useRef<null | HTMLDivElement>(null);

  const [signUpForm, setSignUpForm] = useReducer(handleSignUpForm, signUpFormDefault);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/is_logged_in`)
      .then(res => {
        if (res.data.is_logged_in) {
          if (res.data.username) {
            navigate(`/user/${res.data.username}`);
          }
        }
        setSignUpForm({type: 'setSessionCheck', value: 'true'});
      });
  }, [navigate]);

  useEffect(() => {
    // Make an HTTP request to check existing username only after 600ms.
    const usernameTimer = window.setTimeout(
      async () => {
        const usernameInfo = await checkUsernameExists(signUpForm);
        if (usernameInfo === false) return;
        setSignUpForm({
          type: 'setUsernameExists',
          value: usernameInfo.data.username_exists.toString()});
      }, 600);
    return () => {
      clearTimeout(usernameTimer);
    };
  }, [signUpForm.username.value]);

  useEffect(() => {
    // Show password problems only after 1s.
    const passwordTimer = window.setTimeout(
      async () => {
        setSignUpForm({type: 'focusOutPassword', value: ''});
      }, 1000);
    return () => {
      clearTimeout(passwordTimer);
    };
  }, [signUpForm.password.value]);

  const handleUsernameChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setSignUpForm({type: 'setUsername', value: input.value});
  };

  const handleEmailChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setSignUpForm({type: 'setEmail', value: input.value});
  };

  const handlePasswordChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setSignUpForm({type: 'setPassword', value: input.value});
  };

  const handleFocusOut = async (event: React.FocusEvent) => {
    const element = event.target as HTMLInputElement;

    if (element.name === 'username') {
      setSignUpForm({type: 'focusOutUsername', value: ''});
    }
    
    else if (element.name === 'email') {
      const [emailError] = validate_email(signUpForm.email.value);
      if (!emailError) {
        const emailInfo = await checkEmailExists(signUpForm);
        if (emailInfo !== false) {
          const emailExists = emailInfo.data.email_exists.toString();
          setSignUpForm({type: 'setEmailExists', value: emailExists});
        };
      } else {
        setSignUpForm({type: 'focusOutEmail', value: emailError});
      }
    }

    else if (element.name === 'password') {
      setSignUpForm({type: 'focusOutPassword', value: ''});
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (signUpForm.submitting) return;

    let error = false;
    if (signUpForm.username.error || !signUpForm.username.value) {
      setSignUpForm({type: 'setFormError', value: 'Invalid username'});
      error = true;
    } else if (signUpForm.email.error || !signUpForm.email.value) {
      setSignUpForm({type: 'setFormError', value: 'Invalid email'});
      error = true;
    } else if (signUpForm.password.error || !signUpForm.password.value) {
      setSignUpForm({type: 'setFormError', value: 'Invalid password'});
      error = true;
    }

    if (error) {
      setTimeout(() => {
        formErrorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'start',
        });
      }, 100);
      return;
    }

    setSignUpForm({type: 'setSubmitting', value: 'true'});
    axios.post(`${isProduction ? serverUrl : ''}/signup`, {
      username: signUpForm.username.value.trim(),
      email: signUpForm.email.value.trim(),
      password: signUpForm.password.value
    }).then(
      res => {
        setSignUpForm({type: 'setSubmitting', value: 'false'});
        navigate(`/user/${res.data.username}`);
      }
    ).catch(
      err => {
        setSignUpForm({
          type: 'setFormError',
          value: err.response.data.errDesc
        });
        setTimeout(() => {
          formErrorRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
          });
        }, 100);
      }
    );
  };

  return (
    <section id="form-prompt">
      {signUpForm.sessionIsChecked && <div id="form-body">
        <header id="form-header">Sign up</header>
        <form id="form-content" onSubmit={handleSubmit}>
          
          {/* Username */}
          <section className="form-section">
            <label className="form-label" htmlFor="username">
              Username
              {(signUpForm.username.existsInDatabase === false)
                ? <i className="fa-solid fa-circle-check" />
                : signUpForm.username.showError
                  ? <i className="fa-solid fa-circle-xmark" />
                  : ''}
            </label>
            <input 
              id="username"
              className={signUpForm.username.showError 
                ? 'error'
                : signUpForm.username.existsInDatabase === false
                  ? 'valid'
                  : undefined}
              name="username"
              type="text"
              value={signUpForm.username.value}
              onChange={handleUsernameChange}
              autoComplete="username"
              onBlur={handleFocusOut}
              required />
            {signUpForm.username.showError 
              && <div className="form-error">
                {signUpForm.username.error}
              </div>
            }
          </section>

          {/* Email */}
          <section className="form-section">
            <label className="form-label" htmlFor="email">
              Email
              {signUpForm.email.existsInDatabase === false
                ? <i className="fa-solid fa-circle-check" />
                : signUpForm.email.showError
                  ? <i className="fa-solid fa-circle-xmark" />
                  : ''}
            </label>
            <input 
              id="email"
              className={signUpForm.email.showError 
                ? 'error'
                : signUpForm.email.existsInDatabase === false
                  ? 'valid'
                  : undefined}
              name="email"
              type="email"
              value={signUpForm.email.value}
              onChange={handleEmailChange}
              autoComplete="off"
              onBlur={handleFocusOut}
              required />
            {signUpForm.email.showError && <div className="form-error">
              {signUpForm.email.error}
            </div>
            }
          </section>

          {/* Password */}
          <section className="form-section">
            <label className="form-label" htmlFor="user-password">
              Password
              {signUpForm.password.showError 
                ? <i className="fa-solid fa-circle-xmark" />
                : (signUpForm.password.error || !signUpForm.password.value)
                  ? ''
                  : <i className="fa-solid fa-circle-check" />}
            </label>
            <input
              id="new-password"
              className={signUpForm.password.showError 
                ? 'error'
                : (signUpForm.password.error || !signUpForm.password.value)
                  ? undefined
                  : 'valid'}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={signUpForm.password.value}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              onBlur={handleFocusOut}
              required />
            <TogglePasswordVisibility handleVisibility={setShowPassword} />
            {signUpForm.password.showError && <div className="form-error">
              {signUpForm.password.error}
            </div>}
          </section>
          <SubmitForm 
            description="Create Account"
            formError={signUpForm.formError}
            submitting={signUpForm.submitting}
            errorRef={formErrorRef}
            buttonClass="green"
          />
          {/* Switch login */}
          <hr className="margin-top" />
          <section className="form-help">
            Already have an account? <a className="switch-form-button" href="/login">Log in</a>
          </section>
        </form>
      </div>}
    </section>  
  );
};

const signUpFormDefault = {
  username: {
    value: '',
    existsInDatabase: null,
    error: '',
    showError: false
  },
  email: {
    value: '',
    existsInDatabase: null,
    error: '',
    showError: false
  },
  password: {
    value: '',
    error: '',
    showError: false,
    showPassword: false
  },
  sessionIsChecked: false,
  formError: '',
  submitting: false
};

type ValueWithError = {
  value: string;
  existsInDatabase: boolean | null;
  error: string;
  showError: boolean;
}

export interface SignUpFormTypes {
  username: ValueWithError;
  email: ValueWithError;
  password: {
    value: string;
    error: string;
    showError: boolean;
    showPassword: boolean;
  };
  sessionIsChecked: boolean;
  formError: string,
  submitting: boolean
}
