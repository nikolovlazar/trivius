import { parseCookies } from 'vinxi/http';

export const getServerCookies = async (name: string) => {
  const cookies = parseCookies();
  return cookies[name];
};
