import { Pagination, Row } from 'antd';
import React, { useMemo } from 'react';

export default function CustomedTable({
  children,
  params,
  setParams,
  loading,
  totalCount,
  totalPage,
  data
}) {
  const { pageSize, pageIndex } = useMemo(() => {
    return params;
  }, [params, totalCount, totalPage]);

  return (
    <div className="table-wrapper">
      {children}
      
    </div>
  );
}
