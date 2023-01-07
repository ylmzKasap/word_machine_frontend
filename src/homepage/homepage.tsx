import { useReducer, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginDefaults, LoginForm } from '../account/login/login';
import { loginReducer } from '../account/login/login_reducer';
import { SignUpForm, signUpFormDefault } from '../account/sign_up/sign_up';
import { handleSignUpForm } from '../account/sign_up/sign_up_reducer';
import { isProduction } from '../constants';

export const Homepage: React.FC = () => {
  const [signUpForm, setSignUpForm] = useReducer(handleSignUpForm, signUpFormDefault);
  const [loginForm, setLoginForm] = useReducer(loginReducer, loginDefaults);
  const [overlayName, setOverlayName] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/login') {
      setOverlayName('login');
    } else if (location.pathname === '/signup') {
      setOverlayName('signup');
    }
  }, [location.pathname]);

  const handleOverlayChange = (overlayName: string, route: string) => {
    setOverlayName(overlayName);
    navigate(route);
  };

  return (
    <div id="homepage">
      <div className="homepage-section greeting">
        <header id="homepage-greeting">
          <h1 id="homepage-header">Create audiovisual<br/>vocabulary studies fast</h1>
          <button 
            id="homepage-sign-up-button"
            type="button"
            onClick={() => handleOverlayChange('signup', '/signup')}
          >Sign in</button>
        </header>
        <img
          id="homepage-cover"
          src={isProduction 
            ? 'https://public-reassurance-bucket.s3.eu-central-1.amazonaws.com/homepage.jpg'
            : '/local_assets/homepage.jpg'}
          alt="A laptop on a table displaying the application">
        </img>
      </div>
      {overlayName === 'signup' 
        && <SignUpForm 
          handleOverlayChange={handleOverlayChange}
          signUpForm={signUpForm}
          setSignUpForm={setSignUpForm}
        />}
      {overlayName === 'login' 
        && <LoginForm 
          handleOverlayChange={handleOverlayChange}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
        />}
    </div>
  );
};
