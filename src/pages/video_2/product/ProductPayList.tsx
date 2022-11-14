import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { STATUS } from '@/constants/video2'
import { getPayGatewayListApi_2, getPayTypeListApi_2 } from '@/request/api/video_2/payway'
import { delProductPayApi_2, getProductListApi_2, getProductPayListApi_2, updateProductPayApi_2 } from '@/request/api/video_2/product'
import { PayGatewayBasedata, PayTypeBasedata, ProductBasedata, ProductPayBasedata } from '@/type'
import { Button, Card, Col, Image, message, Row, Select, Space, Switch, Tag } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AddModal from './components/ProductPayAddModal'

export const ProductPayList = () => {
  const location = useLocation()
  const state = location.state

  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<ProductPayBasedata[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [initItemData, setInitItemData] = useState<ProductPayBasedata>()
  const [allPayType, setAllPayType] = useState([])
  const [allPayGateway, setAllPayGateway] = useState([])
  const [allProduct, setAllProduct] = useState([])
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true)
  const [queryParam, setQueryParam] = useState(state?.queryParam || {
    product_id: null,    // 产品id
    type_id: null,         // 支付类型列表id
    way_id: null,
  })

  useEffect(() => {
    getInitData()
  }, [])


  useEffect(() => {
    getDataList()
  }, [allPayGateway, allPayType, allProduct, currentPage, pageSize, queryParam])

  const formList = useMemo<SearchFormItem[]>(
    () => [
      {
        name: 'product_id',
        placeholder: '产品搜索',
        type: 'select',
        width: 200,
        selectOp: allProduct || [],
        selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
      },
      {
        name: 'type_id',
        placeholder: '支付类型搜索',
        type: 'select',
        width: 200,
        selectOp: allPayType || [],
        selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
      },
      {
        name: 'way_id',
        placeholder: '支付网关搜索',
        type: 'select',
        width: 200,
        selectOp: allPayGateway || [],
        selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
      }
    ], [allProduct, allPayType, allPayGateway])

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
        title: '产品',
        dataIndex: 'product_id',
        key: 'product_id',
        align: 'center',
        render: (_: any, item: any) => (
          <>
            {item.product
              ? item.product.title
              : <Tag color='red'>产品不存在或已下架</Tag>
            }
          </>
        )
      },
      {
        title: '支付类型',
        dataIndex: 'type_id',
        key: 'type_id',
        align: 'center',
        render: (_: any, item) => (
          <>
            {item.payType
              ? item.payType.name
              : <Tag color='red'>支付类型不存在或已下架</Tag>
            }
          </>
        )
      },
      {
        title: '支付网关',
        dataIndex: 'way_id',
        key: 'way_id',
        align: 'center',
        render: (_: any, item) => (
          <>
            {item.payway
              ? item.payway.name
              : <Tag color='red'>支付网关不存在或已下架</Tag>
            }
          </>
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (_: any, item: ProductPayBasedata) => (
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
      let res: any = await delProductPayApi_2(params)
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
      let res: any = await updateProductPayApi_2(params)
      if (res.code == 200) {
        message.success('操作成功')
        getDataList()
      }
    } catch (err) {

    }
  }

  const onChange = (pageParams) => {
    setCurrentPage(pageParams.current)
    setPageSize(pageParams.pageSize)
  }

  const handleAdd = () => {
    const data = {
      id: null,
      product_id: null,
      type_id: null,
      way_id: null,
    }
    setInitItemData(data)
    setIsModalVisible(true)
  }

  const onCancel = () => {
    setIsModalVisible(false)
  }

  const onOk = () => {
    getDataList()
    setIsModalVisible(false)
  }

  const onSearch = useCallback(
    (params) => {
      const data = {
        product_id: params.product_id,
        type_id: params.type_id,
        way_id: params.way_id
      }
      setCurrentPage(1)
      setQueryParam(data)
    },
    [],
  )

  const getDataList = async () => {
    if (isFirstTime) {
      setIsFirstTime(false)
    }
    setLoading(true)
    let params = {
      per_age: pageSize,
      page: currentPage,
      ...queryParam
    }
    try {

      // 展示支付方式
      if (allProduct.length && allPayType.length && allPayGateway.length) {
        let res: any = await getProductPayListApi_2(params)
        let arr = JSON.parse(JSON.stringify(res.data.data))
        setCurrentPage(res.data.current_page)
        setTotal(res.data.total)
        setPageSize(res.data.per_page)

        arr.forEach(item => {
          item.product = allProduct.find(p => p.id == item.product_id)
          item.payType = allPayType.find(pt => pt.id == item.type_id)
          item.payway = allPayGateway.find(pw => pw.id == item.way_id)
        });
        setDataSource(arr)
      }
      // 不需要展示支付方式 并注释colums 支付方式项
      // let res: any = await getProductPayListApi_2(params)
      // setDataSource(res.data.data)

    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const getInitData = async () => {
    const params = {
      per_age: 100,
      page: 1
    }
    try {
      let [resPayType, resPayGateway, resProduct] = await Promise.all<any[]>([
        getPayTypeListApi_2(params),
        getPayGatewayListApi_2(params),
        getProductListApi_2(params)
      ])

      let payTypeList = resPayType.data.data.filter(item => item.status == STATUS.ON)
      let paywayList = resPayGateway.data.data.filter(item => item.status == STATUS.ON)
      let productList = resProduct.data.data.filter(item => item.status == STATUS.ON)

      payTypeList.forEach(item => {
        item.value = item.id
        item.label = item.name
      });
      paywayList.forEach(item => {
        item.value = item.id
        item.label = item.name
      });
      productList.forEach(item => {
        item.value = item.id
        item.label = item.title
      });

      setAllPayType(payTypeList)
      setAllPayGateway(paywayList)
      setAllProduct(productList)

      getDataList()

    } catch (error) {
      message.error(error.message || '请稍后重试')
    }
  }



  return (
    <>
      <Row>
        <Col span={24}>
          {
            allProduct.length && allPayType.length && allPayGateway.length
            && <SearchForm
              formList={formList}
              onSearch={onSearch} />
          }

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
          payTypeList={allPayType}
          payGatewayList={allPayGateway}
          productList={allProduct}
        />
      }
    </>
  )
}