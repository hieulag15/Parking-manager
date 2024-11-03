import { Layout, Result } from 'antd';
import React from 'react';

function PageError({ btn, ...restProps }) {
  return (
    <Layout className="vh-100">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={btn.onClick}>
            {btn.text}
          </Button>
        }
        {...restProps}
      />
    </Layout>
  );
}

export default PageError;
