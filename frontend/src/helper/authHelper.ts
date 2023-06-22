import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const getToken = () => {
  const accessToken = cookie.get('access_token');
  if (!accessToken) {
    return false;
  }
  return true;
};
