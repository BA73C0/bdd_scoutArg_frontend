import React from 'react';
import './header.css'; 
import Logo from '../logoButton/logoButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileMenu from '../profileMenu/profileMenu';

const Header = () => {
    const user = JSON.parse(localStorage.getItem('current_user_data'));

    return (
        <header className="header">
            <Logo />
            <div className="user-info">
                <FontAwesomeIcon icon={faUser}/>
                {user.name}
                <ProfileMenu />
            </div>
        </header>
    );
}

export default Header;
