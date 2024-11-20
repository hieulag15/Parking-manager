import { Layout, Typography } from "antd";
import React from "react";

function Footer() {
  return (
    <Layout.Footer className="text-center py-1">
      <Typography.Title type="secondary" level={5}>
        Hệ thống quản lý bãi đỗ xe
      </Typography.Title>
    </Layout.Footer>
  );
}

export default Footer;
