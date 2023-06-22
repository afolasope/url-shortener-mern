import Cookies from 'universal-cookie';

export const LogoutBtn = () => {
  const cookies = new Cookies();

  const handleClick = () => {
    cookies.remove('access_token', { path: '/' });
  };

  return (
    <button
      className="bg-blue-500 px-4 py-2 text-white rounded-2xl"
      onClick={handleClick}
    >
      <a href="/login">Logout</a>
    </button>
  );
};
