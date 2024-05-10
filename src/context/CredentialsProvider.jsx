import React, { useState } from 'react';
import CredentialsContext from './CredentialsContext';

export const CredentialsProvider = ({ children }) => {
    const [token, setToken] = useState('');

    return (
        <CredentialsContext.Provider value={{ token, setToken }}>
            {children}
        </CredentialsContext.Provider>
    );
};
