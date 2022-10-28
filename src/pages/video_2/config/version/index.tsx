import BaseTable from '@/components/base/BaseTable'
import SearchForm from '@/components/searchForm'
import { getVersionListApi_2 } from '@/request'
import { Button, Card, Col, Row, Space } from 'antd'
import { use } from 'echarts'
import React, { useEffect, useMemo, useState } from 'react'
import AddModal from './components/AddModal'

/* 
"id": 1,
"name": "lucmsee",
"mobile_os": "android",
"version_sn": "1.0.0",
"description": "11111",
"package_url": "https://baidu.com",
"is_force_update": "F", // // T 强制更新  F 不强制更新
"created_at": "2022-10-13T08:20:53.000000Z",
"updated_at": "2022-10-13T08:20:55.000000Z" 

*/

enum FORCEUPDATE {
    YES = 'T',
    NO = 'F'
}

type BaseDataType = {
    id: number
    name: string
    mobile_os: string
    version_sn: string
    description: string
    package_url: string
    is_force_update: string
    created_at: string
    updated_at: string
}



export const VersionMgr: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [baseDetail, setBaseDetail] = useState<BaseDataType>()
    const [dataSource, setDataSource] = useState<any[]>([])

    useEffect(() => {
        getDataList()
    }, [currentPage, pageSize])

    const paramsData = {
        list: dataSource,
        showPagination: true,
        page: { dataTotal: total, size: pageSize, page: currentPage },
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                align: 'center'
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '手机系统',
                dataIndex: 'mobile_os',
                align: 'center'
            },
            {
                title: '版本号',
                dataIndex: 'version_sn',
                align: 'center'
            },
            {
                title: '描述',
                dataIndex: 'description',
                align: 'center'
            },
            {
                title: '安装包地址',
                dataIndex: 'package_url',
                align: 'center'
            },
            {
                title: '是否强制更新',
                dataIndex: 'is_force_update',
                align: 'center',
                render: (text) => (text === FORCEUPDATE.YES) ? '是' : '否'
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                align: 'center',
                render: (text, record, index) => `${text.replace('T', ' ').substring(0, 19)}`
            },
            {
                title: '更新时间',
                dataIndex: 'updated_at',
                align: 'center',
                render: (text, record, index) => `${text.replace('T', ' ').substring(0, 19)}`
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => { handleEdit(item) }}>
                            编辑
                        </Button>
                        {/* <Button
                            type="link"
                            onClick={() => { handleDel(item.id) }}>
                            删除
                        </Button> */}
                    </Space>
                )
            }
        ]
    }

    const getDataList = async () => {
        setLoading(true)
        const params = {
            per_age: pageSize,
            page: currentPage
        }
        try {
            let res: any = await getVersionListApi_2(params)
            setTotal(res?.data?.total)
            setCurrentPage(res?.data?.current_page)
            setPageSize(res?.data?.per_page)
            setDataSource(res?.data?.data)
        } catch (error) {

        } finally {
            setLoading(false)
        }

    }

    const handleDel = (id) => {

    }

    const handleEdit = (item) => {
        let data = JSON.parse(JSON.stringify(item))
        setBaseDetail(data)
        setIsModalVisible(true)
    }

    const onSearch = () => {

    }

    const onChange = (pageParams) => {
        setCurrentPage(pageParams.current)
        setPageSize(pageParams.pageSize)
    }

    const handleAdd = () => {
        let data = {
            id: null,
            name: '',
            mobile_os: '',
            version_sn: '',
            description: '',
            package_url: '',
            is_force_update: '',
            created_at: '',
            updated_at: '',
        }
        setBaseDetail(data)
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleOk = () => {
        console.log('------handleOk------');
        setCurrentPage(1)
        getDataList()
        setIsModalVisible(false)
    }

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Card>
                        <Space direction='vertical' size={[4, 30]} style={{ width: '100%' }}>
                            <Button type='primary' danger onClick={() => handleAdd()}  >新增</Button>
                            <BaseTable
                                data={paramsData}
                                onChange={onChange}
                                loading={loading}
                            />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {
                isModalVisible
                && <AddModal
                    visible={isModalVisible}
                    dataSource={baseDetail}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                />
            }
        </>
    )
}