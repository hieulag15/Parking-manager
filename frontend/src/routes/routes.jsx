import { CarOutlined, InteractionOutlined, LineChartOutlined, UserOutlined, HistoryOutlined } from "@ant-design/icons";
import Driver from "~/views/pages/Main/Driver";
import Home from "~/views/pages/Main/Home";
import Map from "~/views/pages/Main/Map";
import Event from "~/views/pages/Main/Event";
import History from "~/views/pages/Main/History";
import Import from "~/views/pages/Main/Import";
import Export from "~/views/pages/Main/Export";

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
  {
    key: 'getIn',
    label: 'Xe vào',
    path: "/get-in",
    element: <Import />,
    icon: <InteractionOutlined />,
  },
  {
    key: 'getOut',
    label: 'Xe ra',
    path: "/get-out",
    element: <Export />,
    icon: <InteractionOutlined />,
  },
];

const driverRoutes = [
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
  }
]

const privateRoutes = [];

export { publicRoutes, driverRoutes, privateRoutes };
