'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for app directory
import { useGlobalContext } from '@/context/AuthContext';
import { AppRouterConstant, AuthConstant } from '@/lib/contants';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { login, isLoggedIn, userDetails } = useGlobalContext();
    const router = useRouter();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem(AuthConstant.USER_DATA) || '{}');
      const token = localStorage.getItem(AuthConstant.TOKEN_KEY);
      if (user && token && !isLoggedIn) {
        login(token, user as any);
      }
    }, [login, isLoggedIn]);

    useEffect(() => {
      if (isLoggedIn && userDetails) {
        const role = userDetails.role;
        const redirectPath = `${(AppRouterConstant as any)[role]}/dashboard`;
        if (router && (router as any).pathname && !(router as any).pathname.includes(redirectPath)) {
          router.push(redirectPath);
        }
      } else if (!isLoggedIn) {
        router.push('/');
      }
    }, [isLoggedIn, userDetails, router]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;