import { GET, POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  getById: (id) => {
    const url = `${DOMAIN}/vehicle/${id}`;
    return GET({
      url
    });
  }
};