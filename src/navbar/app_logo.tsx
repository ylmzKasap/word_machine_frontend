import { Link } from 'react-router-dom';

export const AppLogo: React.FC = () => {

  return (
    <Link to="/" id="app-logo">
      <h3 id="app-logo-text">Vocablitz</h3>
    </Link>
    
  );
};
