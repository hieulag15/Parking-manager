import { Flex, Space, Typography } from "antd";
import React from "react";

function PageHeader({ title }) {
  return (
    <Flex justify="space-between" className="w-100">
      <Typography.Title level={4}>{title}</Typography.Title>
    </Flex>
  );
}

export default PageHeader;
