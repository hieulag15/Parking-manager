import { CarOutlined, InteractionOutlined, LineChartOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Driver from "~/views/pages/Main/Driver";
import Employee from "~/views/pages/Main/Employee";
import Home from "~/views/pages/Main/Home";
import Map from "~/views/pages/Main/Map";
import Event from "~/views/pages/Main/Event";

// Public routes
const publicRoutes = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: "/dashboard",
    element: <Home />,
    icon: <LineChartOutlined />
  },
  {
    key: 'map',
    label: 'Bản đồ',
    path: "/map",
    element: <Map />,
    icon: <CarOutlined />
  },
  {
    key: 'driver',
    label: 'Quản lý chủ xe',
    path: "/driver",
    element: <Driver />,
    icon: <UserOutlined />
  },
  {
    key: 'employee',
    label: 'Quản lý nhân viên',
    path: "/employee",
    element: <Employee />,
    icon: <UsergroupAddOutlined />,
  },
  {
    key: 'event',
    label: 'Nhập xuất xe',
    path: "/event",
    element: <Event />,
    icon: <InteractionOutlined />,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
