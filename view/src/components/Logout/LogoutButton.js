import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './logoutButton.css';

function LogoutButton() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <button className="logout-icon-button" onClick={handleLogout} aria-label="Logout">
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
        </button>
    );
}

export default LogoutButton;
