import React, { createContext, useState, useContext } from 'react';

// Create a context for the user
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    console.log("🚀 ~ UserProvider ~ user:", user)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

