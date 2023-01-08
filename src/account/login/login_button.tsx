import { useLocation, useNavigate } from 'react-router-dom';

export const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate('/login', {state: {next: location.pathname}});
  };

  return (
    <button
      id="login-button"
      type="button"
      onClick={handleClick}>
        Log in
    </button>
  );
};

