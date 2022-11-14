import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NavbarContext, NavbarContextTypes } from './layout_with_navbar';
import { isProduction, serverUrl } from '../constants';

export const UserDropdown: React.FC<UserDropdownPropTypes> = (props) => {
  const navigate = useNavigate();
  const inputElement = useRef<null | HTMLDivElement>(null);

  const { 
    setReRender,
    sessionChecked,
    setSessionChecked,
    showDropdown,
    setShowDropdown } = useContext(NavbarContext) as NavbarContextTypes;
  const [userDropdown] = useState({
    options: [
      {name:'Home',
        route: `/user/${props.username}`,
        icon: 'fas fa-home no-cursor'},
      {name:'Settings',
        route: '/settings',
        icon: 'fa-solid fa-gear'},
      {name: 'Log out',
        icon: 'fa-solid fa-right-from-bracket'}]
  });

  const handleDropdownClick = () => {
    setShowDropdown(prev => !prev);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    // Prevent middle click from scrolling
    if (event.button === 1) {
      event.preventDefault();
    }
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLElement>) => {
    let leftClick = false;
    if (event.button === 0) {
      event.preventDefault();
      leftClick = true;
    }  
    
    const selected = event.currentTarget as HTMLElement;
    const hideDropdown = () => setShowDropdown(prev => !prev);
    
    if (selected.title === 'Log out') {
      // Prevent log out with middle click
      if (event.button === 1) return;
      setSessionChecked(false);
      axios.post(`${isProduction ? serverUrl : ''}/logout`, {
        username: props.username
      }).then(() => {
        setReRender();
        navigate('/login');
      }).catch(() => {
        navigate('/login');
      });
    } else if (selected.title === 'Home') {
      navigate(`/user/${props.username}`);
    } else if (selected.title === 'Settings') {
      navigate('/settings');
    }
    if (leftClick) hideDropdown();
  };

  return (
    <div id="user-dropdown">
      {sessionChecked 
      && <div className="image-container" ref={inputElement} onClick={handleDropdownClick}>
        {props.userPicture && 
          <img className="user-image" 
            src={props.userPicture}
            alt={`${props.username}`} />}
      </div>}
      {showDropdown && <div id="user-dropdown-container" style={{
        top: inputElement.current?.offsetTop! + inputElement.current?.clientHeight! - 1,
        right: 0
      }}>
        {userDropdown.options.map((item, index) => 
          <a className="user-dropdown-item"
            href={item.route}
            key={index}
            title={item.name}
            onClick={handleOptionClick}
            onMouseDown={handleMouseDown}
          >
            <i id="dropdown-icon" className={item.icon} />
            <span className="dropdown-description"> {item.name} </span>
          </a>)}
      </div>}
    </div>
  );
};

interface UserDropdownPropTypes {
  username: string;
  userPicture: string;
};
