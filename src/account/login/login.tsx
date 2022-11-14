import axios from 'axios';
import { ChangeEvent, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl, isProduction } from '../../constants';
import SubmitForm from '../../profile_components/common/form_components/submit_form';
import { ForgottenPassword } from '../password/forgotten_password/forgotten_password';
import { ForgottenUsername } from '../username/forgotten_username';
import { loginReducer } from './login_reducer';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useReducer(loginReducer, loginDefaults);
  
  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/is_logged_in`)
      .then(res => {
        if (res.data.is_logged_in) {
          if (res.data.username) {
            navigate(`/user/${res.data.username}`);
          }
        }
        setLoginForm({type: 'sessionChecked', value: 'true'});
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
    }, { withCredentials: true }).then(res => {
      setLoginForm({type: 'submitting', value: 'false'});
      navigate(`/user/${res.data.username}`);
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
        <header id="form-header">Log in</header>
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
            <a href="/signup" className="switch-form-button"> Sign up</a>
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
