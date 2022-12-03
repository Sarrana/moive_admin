import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { ORDERSTATUS } from '@/constants/video2'
import { getOrderListApi_2 } from '@/request/api/video_2/order'
import { OrderBaseData, orderStatusOP } from '@/type'
import { momentToTime } from '@/utils'
import { Card, Col, Row, Space } from 'antd'
import Select from 'rc-select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

type QueryParamType = {
  user_id: number
  product_id: number
  order_id: number
  status: ORDERSTATUS
  start_time: string
  end_time: string
}

export const OrderList = () => {
  const location = useLocation();
  const state = location.state;

  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<OrderBaseData[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [queryParam, setQueryParam] = useState<QueryParamType>(state?.queryParam || {
    user_id: null,
    product_id: null,
    order_id: null,
    status: null,
    start_time: '',
    end_time: '',
  })


  useEffect(() => {
    getDataList()

  }, [currentPage, pageSize, queryParam])

  const formList = useMemo<SearchFormItem[]>(() => [
    {
      name: 'user_id',
      placeholder: '用户ID搜索',
      type: 'input',
      width: 100
    },
    {
      name: 'product_id',
      placeholder: '产品ID搜索',
      type: 'input',
      width: 100
    },
    {
      name: 'order_id',
      placeholder: '订单ID搜索',
      type: 'input',
      width: 100
    },
    {
      name: 'status',
      placeholder: '状态',
      type: 'select',
      width: 100,
      selectOp: orderStatusOP,
      selectOpRender: (item: SelectOpType) => <Select.Option value={item.value} key={item.id}>{item.label}</Select.Option>
    },
    {
      name: 'date',
      type: 'rangePicker'
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
        title: '用户ID',
        dataIndex: 'user_id',
        key: 'user_id',
        align: 'center'
      },
      {
        title: '产品ID',
        dataIndex: 'product_id',
        key: 'product_id',
        align: 'center'
      },
      {
        title: '平台订单号',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center'
      },
      {
        title: '第三方订单号',
        dataIndex: 'app_order',
        key: 'app_order',
        align: 'center'
      },
      {
        title: '描述',
        dataIndex: 'descp',
        key: 'descp',
        align: 'center'
      },
      /* {
        title: '订单类型',
        dataIndex: 'order_type',
        key: 'order_type',
        align: 'center',
        render: (text) => (productTypeOP.find(item => item.value == text).label)
      }, */
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center'
      },
      {
        title: '支付金额',
        dataIndex: 'pay_amount',
        key: 'pay_amount',
        align: 'center'
      },
      {
        title: '支付类型',
        dataIndex: 'pay_type',
        key: 'pay_type',
        align: 'center'
      },
      {
        title: '支付类型SKD',
        dataIndex: 'pay_type_sdk',
        key: 'pay_type_sdk',
        align: 'center'
      },
      {
        title: '渠道',
        dataIndex: 'channel',
        key: 'channel',
        align: 'center'
      },
      {
        title: '支付方式',
        dataIndex: 'payway',
        key: 'payway',
        align: 'center'
      },
      {
        title: '支付url',
        dataIndex: 'pay_url',
        key: 'pay_url',
        align: 'center'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text) => (orderStatusOP.find(item => item.value == text).label)
      },
      {
        title: '信息',
        dataIndex: 'msg',
        key: 'msg',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center'
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center'
      },
    ]
  }

  const onChange = (pageParams) => {
    console.log('---- onChange ---');
    setCurrentPage(pageParams.current)
    setPageSize(pageParams.pageSize)
  }

  const getDataList = async () => {
    setLoading(true)
    let params = {
      per_age: pageSize,
      page: currentPage,
      ...queryParam
    }
    try {
      let res: any = await getOrderListApi_2(params)
      setCurrentPage(res.data.current_page)
      setTotal(res.data.total)
      setPageSize(res.data.per_page)
      setDataSource(res.data.data)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const onSearch = useCallback(
    (params) => {
      console.log('----- onSearch ----');
      console.log(params);

      const data = {
        user_id: params.user_id,
        product_id: params.product_id,
        order_id: params.order_id,
        status: params.status,
        start_time: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
        end_time: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : ''
      }
      setCurrentPage(1)
      setQueryParam(data)
    },
    [],
  )

  return (
    <>
      <Row  gutter={[12, 30]}>
        <Col span={24}>
          <SearchForm
            formList={formList}
            onSearch={onSearch} />
        </Col>
        <Col span={24}>
          <Card>
            <Space direction='vertical' size={[4, 30]} style={{ width: '100%' }}>
              <BaseTable
                data={paramsData}
                onChange={onChange}
                loading={loading}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  )
}