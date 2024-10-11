import Home from "~/views/pages/Main/Home";
import { BarChartOutlined } from '@ant-design/icons';


// Public routes
const publicRoutes = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: "/dashboard",
      element: <Home />,
      icon: <BarChartOutlined />
    },
  ];

  export { publicRoutes };
  