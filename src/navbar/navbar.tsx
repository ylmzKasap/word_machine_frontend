import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginButton } from '../account/login/login_button';
import { AppLogo } from './app_logo';
import { CurrentUserTypes } from './layout_with_navbar';
import { UserDropdown } from './user_dropdown';

declare module 'react' {
  // Extend React's HTMLAttributes to accept custom attributes.
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    type?: string;
  }
}

export const NavBar: React.FC<
{userInfo: CurrentUserTypes;
sessionChecked: boolean;}> = ({ userInfo, sessionChecked }) => {
  const location = useLocation();

  return (
    <div className="profile-navbar">
      <AppLogo username={userInfo.username} />
      {userInfo.username &&
        <UserDropdown 
          username={userInfo.username}
          userPicture={userInfo.user_picture} />}
      {!userInfo.username && sessionChecked &&
      !['/login', '/signup', '/'].includes(location.pathname) && <LoginButton />}
    </div>
  );
};
