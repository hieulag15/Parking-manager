import { GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  // createNew: (payload) => {
  //   const url = `${DOMAIN}/parking/createParking`;
  //   return POST({
  //     url,
  //     payload
  //   });
  // },

  getStatus: (payload) => {
    const url = `${DOMAIN}/parking?zone=${payload.zone}`;
    return GET({
      url,
      payload
    });
  },

  importVehicle: (payload) => {
    const url = `${DOMAIN}/parking-turn?action=in`;
    return POST({
      url,
      payload: {
        ...payload,
        fee: 5000
      }
    });
  },

  exportVehicle: (payload) => {
    const url = `${DOMAIN}/parking-turn?action=out`;
    console.log(payload);
    return POST({
      url,
      payload
    });
  }
};
