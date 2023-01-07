import axios from 'axios';
import { createContext, useEffect, useReducer, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LoadingIcon from '../assets/animations/loading_icon';
import { isProduction, serverUrl } from '../constants';
import { NavBar } from './navbar';

export const NavbarContext = createContext<NavbarContextTypes | undefined>(undefined);

export function LayoutsWithNavbar() {
  const [currentUserInfo, setCurrentUserInfo] = useState(currentUserDefault);
  const [reRender, setReRender] = useReducer(x => x + 1, 0);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    axios.get(`${isProduction ? serverUrl : ''}/logged_in_user`)
      .then(res => {
        if (!res.data.errDesc) {
          setCurrentUserInfo(res.data);
        }
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
        currentUserInfo,
        setCurrentUserInfo,
        sessionChecked,
        setSessionChecked,
        setReRender,
        showDropdown,
        setShowDropdown
      }}
    >
      <div
        id="app-wrapper"
        className={location.pathname === '/' ? 'homepage' : undefined}
        onClick={handleClick}>
        <NavBar 
          userInfo={currentUserInfo}
          sessionChecked={sessionChecked} />
        {sessionChecked ? <Outlet /> : <LoadingIcon elementClass="image-request" />} 
      </div>
    </NavbarContext.Provider>
  );
}

export const currentUserDefault = {
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
  setCurrentUserInfo: React.Dispatch<React.SetStateAction<CurrentUserTypes>>;
  sessionChecked: boolean;
  setSessionChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setReRender: React.DispatchWithoutAction;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}
