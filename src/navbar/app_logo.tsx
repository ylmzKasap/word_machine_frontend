import { Link } from 'react-router-dom';

export const AppLogo: React.FC<{username: string;}> = ({username}) => {

  return (
    <Link to={username ? `user/${username}` : '/'} id="app-logo">
      <h3 id="app-logo-text">Vocablitz</h3>
    </Link>
    
  );
};
