import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setRole(userData.role); // Update role dynamically
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setRole(null); // Reset role to null
    };

    return <UserContext.Provider value={{ role, handleLogin, handleLogout }}>{children}</UserContext.Provider>;
};
