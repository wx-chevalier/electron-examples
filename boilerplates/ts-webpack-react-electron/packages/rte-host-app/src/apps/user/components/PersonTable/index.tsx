/** 用户列表 */
import { Table } from 'antd';
import { ColumnType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import React from 'react';
import * as S from 'ufc-schema';

export type PersonTableColumns = Array<ColumnType<S.Person>>;

const defaultColumns: PersonTableColumns = [
  {
    key: 'username',
    dataIndex: 'username',
    title: '用户名',
  },
  {
    key: 'userRoleText',
    dataIndex: 'userRoleText',
    title: '用户角色',
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: '创建时间',
    render: (c: string) => dayjs(c).format('YYYY-MM-DD'),
  },
];

interface PersonTableProps extends Partial<TableProps<S.Person>> {
  action?: PersonTableColumns;
}

const PersonTable: React.FC<PersonTableProps> = ({
  action,
  columns,
  ...rest
}) => {
  let finalColumns: PersonTableColumns;
  if (!!columns && !action) {
    finalColumns = columns;
  } else {
    finalColumns = [...defaultColumns, ...(action || [])];
  }

  return <Table {...rest} columns={finalColumns} />;
};

export default PersonTable;
