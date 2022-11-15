import axios from 'axios';
import { createContext, useEffect, useReducer, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { isProduction, serverUrl } from '../constants';
import { NavBar } from './navbar';

export const NavbarContext = createContext<NavbarContextTypes | undefined>(undefined);

export function LayoutsWithNavbar() {
  const [currentUserInfo, setCurrentUserInfo] = useState(currentUserDefault);
  const [reRender, setReRender] = useReducer(x => x + 1, 0);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/logged_in_user`)
      .then(res => {
        setCurrentUserInfo(res.data);
        setSessionChecked(true);
      })
      .catch(() => {
        setCurrentUserInfo(currentUserDefault);
        setSessionChecked(true);
      });
  }, [reRender]);

  const handleClick = (event: React.MouseEvent) => {
    const element = event.target as HTMLInputElement;
    if (showDropdown && !element.closest('#user-dropdown')) {
      setShowDropdown(prev => !prev);
    }
  };

  return (
    <NavbarContext.Provider
      value={{
        currentUserInfo: currentUserInfo,
        sessionChecked: sessionChecked,
        setSessionChecked: setSessionChecked,
        setReRender: setReRender,
        showDropdown: showDropdown,
        setShowDropdown: setShowDropdown
      }}
    >
      <div id="app-wrapper" onClick={handleClick}>
        <NavBar 
          userInfo={currentUserInfo}
          sessionChecked={sessionChecked} />
        {sessionChecked && <Outlet />} 
      </div>
    </NavbarContext.Provider>
  );
}

const currentUserDefault = {
  username : '',
  email: '',
  user_picture: '',
  root_id: '',
  verified: ''
};

export interface CurrentUserTypes {
  username: string;
  email: string;
  user_picture: string;
  root_id: string;
  verified: string;
};

export interface NavbarContextTypes {
  currentUserInfo: CurrentUserTypes;
  sessionChecked: boolean;
  setSessionChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setReRender: React.DispatchWithoutAction;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}
