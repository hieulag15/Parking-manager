import { POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AccountApi = {
  login: (payload) => {
    const url = `${DOMAIN}/auth/login`;
    return POST({ url, payload });
  },

  checkToken: () => {
    const url = `${DOMAIN}/auth/check-token`;
    return POST({ url });
  }
};
export default AccountApi;
