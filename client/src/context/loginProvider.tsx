import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoginContextType {
   isLoggedIn: boolean;
   setIsLoggedIn: (value: boolean) => void;
}

const LoginContext = createContext<LoginContextType>({
   isLoggedIn: false,
   setIsLoggedIn: () => { },
});

interface LoginProviderProps {
   children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   return (
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
         {children}
      </LoginContext.Provider>
   );
};

export const useLogin = () => useContext(LoginContext);
