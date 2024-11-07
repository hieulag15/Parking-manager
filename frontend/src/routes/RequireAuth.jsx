import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AppContext from '~/context'; // Import hàm onAuthorize

const RequireAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();
  const { actions } = useContext(AppContext);

  useEffect(() => {
    const checkAuthorization = async () => {
      actions.onAuthorize({
        onError: () => {
          setIsAuthorized(false);
          actions.logout();
        }
      });
      setIsAuthorized(true);
    };

    checkAuthorization();
  }, [location.pathname]);

  // Cho phép truy cập vào /register mà không cần xác thực
  if (location.pathname === '/register') {
    return <Outlet />;
  }

  if (isAuthorized === null) {
    // Đang kiểm tra xác thực
    return <div>Loading...</div>;
  }

  if (isAuthorized) {
    // Token còn hợp lệ
    return <Outlet />;
  }

  // Token không hợp lệ hoặc đã hết hạn
  return <Navigate to="/login" />;
};

export default RequireAuth;