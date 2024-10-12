import { Layout } from "antd";
import React from "react";

function Content({ children, ...props }) {
  return <Layout.Content {...props}>{children}</Layout.Content>;
}

export default Content;
