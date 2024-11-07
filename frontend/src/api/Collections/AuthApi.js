import { POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const AuthApi = {
  authentication: (payload) => {
    const url = `${DOMAIN}/authentication`;
    return POST({ url, payload });
  },

  reAuthentication: () => {
    const url = `${DOMAIN}/re-authentication`;
    return POST({ url });
  }
};
export default AuthApi;
