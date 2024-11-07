import { DELETE, GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  get: (payload) => {
    const url = `${DOMAIN}/user`;
    return GET({
      url,
      payload
    });
  },

  getDrivers: (payload) => {
    const url = `${DOMAIN}/driver`;
    return GET({
      url,
      payload
    });
  },

  getVehicles: (payload) => {
    const url = `${DOMAIN}/vehicle`;
    return GET({
      url,
      payload
    });
  },

  add: (payload) => {
    const url = `${DOMAIN}/drivers`;
    return POST({
      url,
      payload
    });
  },

  addDriver: (payload) => {
    const url = `${DOMAIN}/driver`;
    return POST({
      url,
      payload
    });
  },

  addMany: (payload) => {
    const url = `${DOMAIN}/user/addMany`;
    return POST({
      url,
      payload
    });
  },

  edit: (_id, payload) => {
    const url = `${DOMAIN}/user?_id=${_id}`;
    return PUT({
      url,
      payload
    });
  },

  editDriver: (_id, payload) => {
    const url = `${DOMAIN}/driver?_id=${_id}`;
    return PUT({
      url,
      payload
    });
  },

  delete: (_id) => {
    const url = `${DOMAIN}/user?_id=${_id}`;
    return DELETE({
      url
    });
  },

  deleteMany: (ids) => {
    const url = `${DOMAIN}/user/deleteMany`;
    return POST({
      url,
      payload: {
        ids
      }
    });
  },

  deleteDriver: (_id) => {
    const url = `${DOMAIN}/driver?_id=${_id}`;
    return DELETE({
      url
    });
  },

  deleteManyDriver: (ids) => {
    const url = `${DOMAIN}/user/driver/deletes`;
    return POST({
      url,
      payload: {
        ids
      }
    });
  },

  changePassword: (payload) => {
    const url = `${DOMAIN}/user/changePassword`;
    return POST({
      url,
      payload,
    });
  }
};
