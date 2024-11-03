import { CarOutlined, InteractionOutlined, LineChartOutlined, UserOutlined, HistoryOutlined } from "@ant-design/icons";
import Driver from "~/views/pages/Main/Driver";
import Home from "~/views/pages/Main/Home";
import Map from "~/views/pages/Main/Map";
import Event from "~/views/pages/Main/Event";
import History from "~/views/pages/Main/History";

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
    key: 'history',
    label: 'Lịch sử',
    path: '/history',
    element: <History />,
    icon: <HistoryOutlined />
  },
  {
    key: 'driver',
    label: 'Quản lý chủ xe',
    path: "/driver",
    element: <Driver />,
    icon: <UserOutlined />
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
