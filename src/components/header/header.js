import React from 'react';
import './header.css'; 
import Logo from '../logoButton/logoButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileMenu from '../profileMenu/profileMenu';

const Header = () => {
    return (
        <header className="header">
            <Logo />
            <div className="user-info">
                <FontAwesomeIcon icon={faUser}/>
                {"Marta"}
                <ProfileMenu />
            </div>
        </header>
    );
}

export default Header;
