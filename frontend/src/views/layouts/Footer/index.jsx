import { Layout, Typography } from "antd";
import React from "react";

function Footer() {
  return (
    <Layout.Footer className="text-center py-1">
      <Typography.Title type="secondary" level={5}>
        Website được phát triển bởi Nhóm 3
      </Typography.Title>
    </Layout.Footer>
  );
}

export default Footer;
