import { CarOutlined, LineChartOutlined, UserOutlined } from "@ant-design/icons";

export const MENU_ITEMS = [
  {
    key: "home",
    label: "Dashboard",
    icon: <LineChartOutlined />,
  },
  {
    key: "map",
    label: "Bản đồ",
    icon: <CarOutlined />,
  },
  {
    key: "driver",
    label: "Quản lý chủ xe",
    icon: <UserOutlined />,
  },
];
