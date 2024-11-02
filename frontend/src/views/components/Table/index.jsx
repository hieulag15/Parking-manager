import { Pagination, Row } from 'antd';
import React, { useMemo } from 'react';

export default function CustomedTable({
  children,
  params = {}, // Provide default value for params
  setParams,
  loading,
  totalCount,
  totalPage,
  data
}) {
  const { pageSize, pageIndex } = useMemo(() => {
    return {
      pageSize: params.pageSize || 10, // Default value for pageSize
      pageIndex: params.pageIndex || 1 // Default value for pageIndex
    };
  }, [params, totalCount, totalPage]);

  return (
    <div className="table-wrapper">
      {children}
      <Row justify="end" style={{ marginTop: 16 }}>
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={totalCount}
          onChange={(page, pageSize) => {
            setParams({ ...params, pageIndex: page, pageSize });
          }}
        />
      </Row>
    </div>
  );
}