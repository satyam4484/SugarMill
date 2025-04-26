'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthConstant } from '@/lib/contants';

interface AppContextType {
  accessToken: string | null;
  userDetails: Record<string, any> | null;
  isLoggedIn: boolean;
  login: (token: string, userDetails: Record<string, any>) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, any> | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (token: string, userDetails: Record<string, any>) => {
    setAccessToken(token);
    setUserDetails(userDetails);
    console.log("user--details",userDetails);
    setIsLoggedIn(true);
    if(!localStorage.getItem(AuthConstant.TOKEN_KEY)) {
      localStorage.setItem(AuthConstant.TOKEN_KEY,token);
    }
    if(!localStorage.getItem(AuthConstant.USER_DATA)) {
      localStorage.setItem(AuthConstant.USER_DATA,JSON.stringify(userDetails));
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUserDetails(null);
    setIsLoggedIn(false);
    localStorage.removeItem(AuthConstant.TOKEN_KEY)
    localStorage.removeItem(AuthConstant.USER_DATA)
  };

  return (
    <AppContext.Provider value={{ accessToken, userDetails, isLoggedIn, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};