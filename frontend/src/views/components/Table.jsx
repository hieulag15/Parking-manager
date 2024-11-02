import { Pagination, Row, Table } from 'antd';
import React from 'react';
import Filter from './Filter';

function CustomedTable({
  totalCount,
  totalPage,
  pageSize,
  pageIndex,
  dataSource,
  columns,
  expandable,
  loading,
  onChange,
  filter = {},
  scroll = { y: 600, scrollToFirstRowOnChange: true },
  filterList = [],
  filterNames = {}
}) {
  return (
    <div className="table-wrapper">
      <Row gutter={[16, 16]} className="w-100">
        <Filter
          filter={filter}
          onChange={onChange}
          filterList={filterList}
          filterNames={filterNames}
        />
      </Row>
      <Table
        columns={columns}
        expandable={expandable}
        loading={loading}
        pagination={false}
        dataSource={dataSource || []}
        rowKey={(record) => record._id}
        scroll={scroll}
        className="mt-3"
      />
      <Row className="mt-4 w-100" justify={'end'}>
        {totalCount ? (
          <Pagination
            total={totalCount}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            pageSize={pageSize}
            current={pageIndex}
            disabled={loading}
            showSizeChanger={true}
            pageSizeOptions={[10, 20, 30]}
            onChange={(page, pageSize) => {
              onChange({
                ...filter,
                pageIndex: page,
                pageSize
              });
            }}
          />
        ) : null}
      </Row>
    </div>
  );
}

export default CustomedTable;
