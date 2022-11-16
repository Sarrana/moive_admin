import BaseTable from '@/components/base/BaseTable'
import { SearchFormItem } from '@/components/searchForm'
import { STATUS } from '@/constants/video2'
import { delAppAnnouncementApi_2, getAppAnnouncementListApi_2, updateAppAnnouncementApi_2 } from '@/request/api/video_2/config'
import { AppAnnouncementBaseData } from '@/type'
import { momentToTime } from '@/utils'
import { Button, Card, Col, message, Row, Space, Switch } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import AddModal from './components/AddModal'

export const AppAnnouncement = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<AppAnnouncementBaseData[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [initItemData, setInitItemData] = useState<AppAnnouncementBaseData>()

  useEffect(() => {
    getDataList()

  }, [currentPage, pageSize])

  const formList = useMemo<SearchFormItem[]>(() => [
    {
      name: ''
    }
  ], [])

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
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, item) => (<Switch onClick={() => onStatusChange(item)} checked={item.status == STATUS.ON} />)
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (text) => momentToTime(text, 'YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center',
        render: (text) => momentToTime(text, 'YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (_: any, item: AppAnnouncementBaseData) => (
          <Space>
            <Button type="link" onClick={() => { handleEdit(item) }}>
              编辑
            </Button>
            <Button type="link" onClick={() => { handleDel(item.id) }}>
              删除
            </Button>
          </Space>
        )
      }
    ]
  }

  const handleDel = async (id: number) => {
    const params = {
      id
    }
    try {
      let res: any = await delAppAnnouncementApi_2(params)
      if (res.code == 200) {
        message.success('操作成功')
        getDataList()
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  const handleEdit = (item) => {
    const data = JSON.parse(JSON.stringify(item))
    console.log(data);
    setInitItemData(data)
    setIsModalVisible(true)
  }

  const onStatusChange = async (item) => {
    console.log(item);
    let params = {
      id: item.id,
      name: item.name,
      status: item.status == STATUS.ON ? STATUS.OFF : STATUS.ON,
      order: item.order,
      ch_name: item.ch_name,
    }
    try {
      let res: any = await updateAppAnnouncementApi_2(params)
      if (res.code == 200) {
        message.success('操作成功')
        getDataList()
      }
    } catch (err) {

    }
  }

  const onChange = (pageParams) => {
    console.log('---- onChange ---');
    setCurrentPage(pageParams.current)
    setPageSize(pageParams.pageSize)
  }

  const handleAdd = () => {
    const data = {
    id: null,
    content: "",
    status: null,
    created_at: "",
    updated_at: "",
    }
    setInitItemData(data)
    setIsModalVisible(true)
  }

  const onCancel = () => {
    console.log('------onCancel----');
    setIsModalVisible(false)
  }

  const onOk = () => {
    console.log('---onOk----');
    getDataList()
    setIsModalVisible(false)
  }

  const getDataList = async () => {
    setLoading(true)
    let params = {
      per_age: pageSize,
      page: currentPage
    }
    console.log(params);
    
    try {
      let res: any = await getAppAnnouncementListApi_2(params)
      setCurrentPage(res.data.current_page)
      setTotal(res.data.total)
      setPageSize(res.data.per_page)
      setDataSource(res.data.data)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const onSearch = () => {

  }

  return (
    <>
      <Row>
        <Col span={24}>
          {/* <SearchForm
            formList={formList}
            onSearch={onSearch} /> */}
        </Col>
        <Col span={24}>
          <Card>
            <Space direction='vertical' size={[4, 30]} style={{ width: '100%' }}>
              <Button type='primary' danger onClick={() => handleAdd()}>新增</Button>
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
        isModalVisible &&
        <AddModal
          visible={isModalVisible}
          initDataSource={initItemData}
          onCancel={onCancel}
          onOk={onOk}
        />
      }
    </>
  )
}