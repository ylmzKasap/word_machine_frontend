import { useNavigate } from 'react-router-dom';

export const LoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
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

