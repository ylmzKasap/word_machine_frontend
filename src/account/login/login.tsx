import axios from 'axios';
import { ChangeEvent, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { serverUrl, isProduction } from '../../constants';
import { NavbarContext, NavbarContextTypes } from '../../navbar/layout_with_navbar';
import SubmitForm from '../../profile_components/common/form_components/submit_form';
import { ForgottenPassword } from '../password/forgotten_password/forgotten_password';
import { ForgottenUsername } from '../username/forgotten_username';

export const LoginForm: React.FC<LoginPropTypes> = (
  {handleOverlayChange, loginForm, setLoginForm}
) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setReRender, setSessionChecked } = useContext(NavbarContext) as NavbarContextTypes;
  
  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/is_logged_in`)
      .then(res => {
        if (res.data.is_logged_in) {
          setSessionChecked(false);
          if (res.data.username) {
            navigate(`/user/${res.data.username}`);
          }
        }
        setLoginForm({type: 'sessionChecked', value: 'true'});
        setReRender();
      });
  }, []);

  const handleUsernameChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setLoginForm({type: 'username', value: input.value});
  };

  const handlePasswordChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    setLoginForm({type: 'password', value: input.value});
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (loginForm.submitting) return;

    setLoginForm({type: 'submitting', value: 'true'});
    axios.post(`${isProduction ? serverUrl : ''}/login`, {
      username: loginForm.username,
      password: loginForm.password
    }).then(res => {
      setSessionChecked(false);
      setLoginForm({type: 'submitting', value: 'false'});
      if (location.state && location.state.next) {
        navigate(location.state.next);
      } else {
        navigate(`/user/${res.data.username}`);
      }
      setReRender();
    }).catch(err => {
      if (err.response.status === 401) {
        setLoginForm({type: 'formError', value: 'Incorrect username or password'});
      } else {
        setLoginForm({type: 'formError', value: 'Oops... Refresh and try again'});
      }
    });
  };

  return (
    <section id="form-prompt">
      {loginForm.sessionChecked && <div id="form-body" className="medium-form-body">
        <header id="form-header">
          Log in
          <button
            type="button"
            className="sign-in-exit"
            onClick={() => handleOverlayChange('', '/')}>
            <span className="fa-solid fa-xmark" />
          </button>
        </header>
        <form id="form-content" onSubmit={handleSubmit}>
          <section className="form-section">
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              id="username"
              name="username"
              type="text"
              value={loginForm.username}
              onChange={handleUsernameChange}
              autoComplete="on"
              required
              autoFocus
            />
          </section>
          <section className="form-section">
            <label className="form-label" htmlFor="current-password">Password</label>
            <input
              id="current-password"
              name="password"
              type="password"
              value={loginForm.password}
              autoComplete="on"
              onChange={handlePasswordChange}
              required
            />
          </section>
          <SubmitForm 
            description="Log in"
            formError={loginForm.formError}
            submitting={loginForm.submitting}
            formClass="no-margin-bottom"
          />
          <section id="forgotten-user-info">
            <h4>Forgot your <span 
              className="overlay-link"
              onClick={() => setLoginForm({type: 'showForgottenUsername', value: 'true'})}
            >
                username </span>
            or <span 
              className="overlay-link"
              onClick={() => setLoginForm({type: 'showForgottenPassword', value: 'true'})}
            >password</span>?</h4>
          </section>
          <hr />
          <section className="form-help">Don't have an account?
            <span 
              className="switch-form-button"
              onClick={() => handleOverlayChange('signup', '/signup')}
            > Sign up</span>
          </section>
        </form>
      </div>}
      {loginForm.showForgottenPassword 
        && <ForgottenPassword 
          handleExit={() => setLoginForm({type: 'showForgottenPassword', value: 'false'})} />}
      {loginForm.showForgottenUsername 
        && <ForgottenUsername 
          handleExit={() => setLoginForm({type: 'showForgottenUsername', value: 'false'})} />}
    </section>  
  );
};

export interface LoginTypes {
  username: string;
  password: string;
  formError: string;
  submitting: boolean;
  sessionChecked: boolean;
  showForgottenPassword: boolean;
  showForgottenUsername: boolean;
}

export const loginDefaults = {
  username: '',
  password: '',
  formError: '',
  submitting: false,
  sessionChecked: false,
  showForgottenPassword: false,
  showForgottenUsername: false
};

export interface LoginPropTypes {
  handleOverlayChange: (overlayName: string, route: string) => void;
  loginForm: LoginTypes;
  setLoginForm: React.Dispatch<{ 
    type: string;
    value: string;
    innerType?: string }>
};
