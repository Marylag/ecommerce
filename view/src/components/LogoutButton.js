import React from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";

function LogoutButton() {
    const navigate = useNavigate();

    return (
        <button onClick={() => handleLogout(navigate)}>
            Logout
        </button>
    );
}

export default LogoutButton;
