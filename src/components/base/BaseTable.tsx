import React, { useCallback, useState } from 'react';
import { Table } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { TableProps } from 'antd/lib/table';

interface PageResponseData {
    dataTotal?: number;
    pageTotal?: number;
    page?: number;
    size?: number;
    showQuickJumper?: boolean | { goButton?: React.ReactNode; };
    showTotal?: (total, range) => React.ReactNode
}

interface BaseTableProps<T> extends TableProps<T> {
    data: {
        list: T[];
        columns: any;
        showPagination: boolean;
        page?: PageResponseData;
    };
    onChange: (page: PaginationProps) => void;
}

function BaseTable<T extends { id?: number }>(props: BaseTableProps<T>) {
    const {
        data: { list, page, columns, showPagination },
        ...resetProps
    } = props;
    const [pagination, setPagination] = useState<PaginationProps>({
        defaultCurrent: 1,
        defaultPageSize: 10,
        showSizeChanger: true
    });

    const onTableChange = useCallback((pageParams: PaginationProps) => {
        setPagination(pageParams);
        console.log(pageParams, 'pageParams')
        props.onChange(pageParams);
    }, []);

    return (
        <Table<T>
            bordered
            {...resetProps}
            onChange={onTableChange}
            columns={columns}
            dataSource={list}
            rowKey={(record) => `${record.id}`}
            pagination={showPagination ? {
                ...pagination,
                total: page.dataTotal,
                showQuickJumper: true,
                showTotal: () => `共${page.dataTotal}条`,
                current: page.page,
                pageSize: page.size
            } : false}
        />
    );
}

export default BaseTable;
