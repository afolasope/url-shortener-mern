import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from './GlobalSpinner';
import { getToken } from '../helper/authHelper';

export const PrivateRoutes = () => {
  const [isUserAuthtenticated, setIsUserAuthenticated] = useState(false);
  const [authState, setAuthState] = useState(false);

  const token = getToken();

  useEffect(() => {
    if (token) {
      setIsUserAuthenticated(true);
    } else {
      setIsUserAuthenticated(false);
    }
    setAuthState(true);
  }, [token]);

  if (!authState) {
    return <Spinner />;
  }

  return isUserAuthtenticated ? <Outlet /> : <Navigate to="/login" />;
};
