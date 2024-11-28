import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import './profileMenu.css'
// import { LogOut } from "../../utils"

function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        console.log('Menu state:', !isMenuOpen)
    };

    const logout = async () => {
        navigate('/');
        // await LogOut(setIsLoading, setError, navigate);
    };

    return (
        <div>
            <div>
                <button onClick={toggleMenu} className="menu-button">
                    <FontAwesomeIcon icon={faEllipsis} />
                </button>

                {isMenuOpen && (
                    <div className="menu-dropdown">
                        <button onClick={logout} className="menu-item">Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileMenu;