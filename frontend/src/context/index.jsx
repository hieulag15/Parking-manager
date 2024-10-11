import React from 'react';
import useStore from './useStore';

const App = ({ children }) => {
  const state = useStore();
  const actions = {
    logout: state.logout,
    onLogin: state.onLogin,
    checkAuthenSevice: state.checkAuthenSevice,
    onMess: state.onMess,
    onNoti: state.onNoti,
    onSetChangePassword: state.onSetChangePassword,
    onEventParking: state.onEventParking,
    onAuthorize: state.onAuthorize,
    editProfile: state.editProfile
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export default App;