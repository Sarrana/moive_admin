import {
  Button,
  Row,
  Col,
  Switch,
  Table,
  Space,
  Image,
  Card,
  Typography,
  message,
  Select
} from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { VideoContentDramaModal } from './VideoContentDramaModal'
import { VideoNewContentDramaModal } from './VideoNewContentDramaModal'
import { event, formatDuration, momentToTime } from '@/utils'
import {
  DramaInfo,
  encryptionOp,
  videoCostTypeOp,
  videoDefinitionOp,
  VideoInfo,
  videoPublishOp
} from '@/type'
import {
  delDramaApi_2,
  getDramaListApi_2,
  getDramaStateApi_2,
  postDramaBatchApi_2
} from '@/request'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchForm, {
  SearchFormItem,
  SelectOpType
} from '@/components/searchForm'
import { ColumnsType } from 'antd/es/table';

const { Title } = Typography

interface User {
  key: number;
  name: string;
}

export const VideoContentDrama = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params: VideoInfo = location.state.data
  const lastPageSize = location.state.pageSize
  const lastCurrentPage = location.state.currentPage
  const lastQueryParam = location.state.queryParam
  const [queryParam, setQueryParam] = useState({
    time_1: '',
    time_2: '',
    release_status: null,
    is_free: null,
    status: null,
    encryption: null
  })
  const formList = useMemo<SearchFormItem[]>(
    () => [
      {
        name: 'date',
        type: 'rangePicker'
      },
      {
        name: 'publish',
        placeholder: '发布状态',
        type: 'select',
        selectOp: videoPublishOp,
        selectOpRender: (item: SelectOpType) => (
          <Select.Option value={item.id} key={String(item.value)}>
            {item.label}
          </Select.Option>
        ),
        width: 100
      },
      {
        name: 'costType',
        placeholder: '付费模式',
        type: 'select',
        selectOp: videoCostTypeOp,
        selectOpRender: (item: SelectOpType) => (
          <Select.Option value={item.id} key={String(item.value)}>
            {item.label}
          </Select.Option>
        ),
        width: 100
      },
      {
        name: 'encryption',
        placeholder: '加密状态',
        type: 'select',
        selectOp: encryptionOp,
        selectOpRender: (item: SelectOpType) => (
          <Select.Option value={item.id} key={String(item.value)}>
            {item.label}
          </Select.Option>
        ),
        width: 100
      },
      {
        name: 'open',
        type: 'checkbox',
        valuePropName: 'checked',
        checkbox: { text: '状态开', value: '状态开' }
      },
      {
        name: 'close',
        type: 'checkbox',
        valuePropName: 'checked',
        checkbox: { text: '状态关', value: '状态关' }
      }
    ],
    []
  )
  const onSearch = useCallback(params => {
    const data: any = {
      time_1: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
      time_2: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
      release_status: params.publish,
      is_free: params.costType,
      encryption: params.encryption
    }
    if (params.open && !params.close) data.status = 1
    if (!params.open && params.close) data.status = 2
    setCurrentPage(1)
    setQueryParam(data)
  }, [])

  const onBack = () => {
    navigate('/Video2/ContentMgr/ContentList', {
      state: {
        currentPage: lastCurrentPage,
        pageSize: lastPageSize,
        queryParam: lastQueryParam
      },
      replace: false
    })
  }

  const [modalShow, setModalShow] = useState<boolean>(false)
  const [newModalShow, setNewModalShow] = useState<boolean>(false)
  const [selectData, setSelectData] = useState({})
  const onOk = () => {
    setModalShow(false)
    setNewModalShow(false)
    getDataList()
  }
  const onCancel = () => {
    setModalShow(false)
    setNewModalShow(false)
  }

  const testData = [
    {
      id: 1,
      ep: 1,
      video: '',
      length: '120',
      definition: 'UHD',
      costType: '封神',
      costNum: '100',
      publish: '发布',
      time: '2021-01-01 15:88',
      playNum: 100000,
      ptime: '2021-01-01 15:88',
      end: true,
      uper: '年代',
      createTime: '2021-01-01 15:88',
      status: 1
    },
    {
      id: 2,
      ep: 2,
      video: '',
      length: '120',
      definition: 'UHD',
      costType: '封神',
      costNum: '100',
      publish: '发布',
      time: '2021-01-01 15:88',
      playNum: 100000,
      ptime: '2021-01-01 15:88',
      end: false,
      uper: '年代',
      createTime: '2021-01-01 15:88',
      status: 2
    }
  ]
  const [dataSource, setDataSource] = useState<DramaInfo[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)
  const onAdd = () => {
    setSelectData({})
    setModalShow(true)
  }
  const onNewAdd = () => {
    setSelectData({ isEdit: false })
    setNewModalShow(true)
  }
  const onBatch = () => {
    postDramaBatchApi_2({ ids: selectedRowKeys }).then((res: any) => {
      message.success('发布成功')
      setSelectedRowKeys([])
      getDataList()
    })
  }
  const onEdit = (item: any) => {
    setSelectData({ ...item })
    setModalShow(true)
  }
  const onNewEdit = (item: any) => {
    setSelectData({ ...item, isEdit: true })
    setNewModalShow(true)
  }
  const onDelete = (id: number) => {
    delDramaApi_2(id).then((res: any) => {
      message.success('删除成功')
      getDataList()
    })
  }
  const onEncryption = (id: number) => {
    // delDramaApi_2(id).then((res: any) => {
    //     message.success('删除成功');
    //     getDataList();
    // });
  }
  const onStatusChange = (id: number, status: number) => {
    getDramaStateApi_2({ id: id }).then((res: any) => {
      message.success('操作成功')
      getDataList()
    })
  }
  const onPageSizeChange = (current, size) => {
    setCurrentPage(current)
    setPageSize(size)
  }
  const onPageChange = page => {
    setCurrentPage(page)
  }
  const columns: ColumnsType<User> = [
    {
      title: '剧集',
      dataIndex: 'episode',
      key: 'episode',
      align: 'center'
    },
    {
      title: '剧集名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '视频',
      dataIndex: 'video',
      key: 'video',
      align: 'center'
    },
    {
      title: '视频时长',
      dataIndex: 'duration',
      key: 'duration',
      render: (text: any, item: any) => formatDuration(Number(item.duration)),
      // render: (text: any, item: any) => Number(item.duration) ? Number(item.duration) + '分钟' : '',
      align: 'center'
    },
    {
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
      // render: (text: any, item: any) => getDefinitionOpVal(item.resolution),
      align: 'center'
    },
    {
      title: '付费模式',
      dataIndex: 'is_free_text',
      key: 'is_free_text',
      align: 'center'
    },
    {
      title: '付费金额(积分)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center'
    },
    {
      title: '发布状态',
      dataIndex: 'release_status_text',
      key: 'release_status_text',
      align: 'center'
    },
    {
      title: '定时发布时间',
      dataIndex: 'timingtime',
      key: 'timingtime',
      align: 'center'
    },
    {
      title: '播放量',
      dataIndex: 'playamount',
      render: (text: any, item: any) => Number(item.playamount),
      key: 'playamount',
      align: 'center'
    },
    {
      title: '发布时间',
      dataIndex: 'release_at',
      key: 'release_at',
      align: 'center'
    },
    {
      title: '加密状态',
      dataIndex: 'encryption_text',
      key: 'encryption_text',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: any, item: any) => (
        <Switch
          onClick={() => {
            onStatusChange(item.id, item.status)
          }}
          checked={`${item.status}` === '1'}
        />
      ),
      align: 'center'
    },
    {
      title: '上传人员',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text: any, item: any) => (
        <Space size={[2, 2]}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              onEdit(item)
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              onNewEdit(item)
            }}
          >
            编辑(FTP)
          </Button>
          {/* {item.encryption + '' == '1' && <Button type="link" size="small" onClick={() => { onEncryption(item.id) }}>加密</Button>} */}
          <Button
            type="link"
            size="small"
            onClick={() => {
              onDelete(item.id)
            }}
          >
            删除
          </Button>
        </Space>
      ),
      align: 'center'
    }
  ]
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: pageSize,
    current: currentPage,
    total: total,
    showTotal: () => `共${total}条`,
    onShowSizeChange: (current, size) => onPageSizeChange(current, size),
    onChange: (page, pageSize) => onPageChange(page)
  }
  const getDataList = () => {
    setLoading(true)
    getDramaListApi_2({
      vid: params.id,
      page: currentPage,
      per_page: pageSize,
      ...queryParam
    })
      .then((res: any) => {
        setDataSource(res.data.list.data)
        setCurrentPage(Number(res.data.list.current_page))
        setPageSize(Number(res.data.list.per_page))
        setTotal(Number(res.data.list.total))
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    console.log('useEffect', currentPage, pageSize)
    getDataList()
  }, [currentPage, pageSize, queryParam])

  useEffect(() => {
    event.addListener('refreshDramaList', getDataList)
    return () => {
      event.removeListener('refreshDramaList', getDataList)
    }
  }, [])

  return (
    <>
      <Row gutter={[12, 30]}>
        <Col span={24}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>{`${params.name}    剧集管理`}</Title>
            <SearchForm formList={formList} onSearch={onSearch} />
          </Space>
        </Col>
        <Col span={24}>
          <Card>
            <Space
              direction="vertical"
              size={[4, 30]}
              style={{ width: '100%' }}
            >
              <Space size={[20, 4]}>
                <Button type="primary" danger onClick={onAdd}>
                  新增
                </Button>
                <Button type="primary" danger onClick={onNewAdd}>
                  新增(FTP)
                </Button>
                <Button
                  type="primary"
                  disabled={selectedRowKeys.length == 0}
                  onClick={onBatch}
                >
                  批量发布
                </Button>
                <Button type="primary" onClick={onBack}>
                  返回
                </Button>
              </Space>
              {/* @ts-ignore */}
              <Table
                bordered
                columns={columns}
                dataSource={dataSource}
                pagination={paginationProps}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedRowKeys,
                  onChange: (
                    selectedRowKeys: React.Key[],
                    selectedRows: any[]
                  ) => {
                    console.log('selectedRowKeys', selectedRowKeys)
                    setSelectedRowKeys(selectedRowKeys)
                  },
                  getCheckboxProps: (item: any) => ({
                    disabled: item.release_status == 1,
                    name: item.id
                  })
                }}
                loading={loading}
                rowKey={record => `${record.id}`}
              />
            </Space>
          </Card>
        </Col>
      </Row>
      {modalShow && (
        <VideoContentDramaModal
          show={modalShow}
          id={params.id}
          category={params.folder}
          params={selectData}
          definitionArr={videoDefinitionOp}
          onOk={onOk}
          onCancel={onCancel}
        />
      )}
      {newModalShow && (
        <VideoNewContentDramaModal
          show={newModalShow}
          id={params.id}
          category={params.folder}
          params={selectData}
          definitionArr={videoDefinitionOp}
          onOk={onOk}
          onCancel={onCancel}
        />
      )}
    </>
  )
}
