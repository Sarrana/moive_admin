import BaseTable from '@/components/base/BaseTable'
import { SearchFormItem } from '@/components/searchForm'
import { STATUS } from '@/constants/video2'
import { getPayGatewayListApi_2, getPayTypeListApi_2 } from '@/request/api/video_2/payway'
import { delProductApi_2, getProductListApi_2, getProductPayListApi_2, updateProductApi_2 } from '@/request/api/video_2/product'
import { ProductBasedata, productTypeOP, productVipLevelOP } from '@/type'
import { Button, Card, Col, Image, message, Row, Space, Switch, Tree } from 'antd'
import { DataNode } from 'antd/lib/tree'
import { useEffect, useMemo, useState } from 'react'
import AddModal from './components/ProductAddModal'

export const ProductList = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<ProductBasedata[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [initItemData, setInitItemData] = useState<ProductBasedata>()
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [allPayttypeList, setAllPayttypeList] = useState([])

  useEffect(() => {
    getDataList()

  }, [currentPage, pageSize])

  useEffect(() => {
    // getProductPayList()
  }, [dataSource])

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
        title: '图片',
        dataIndex: 'img',
        key: 'img',
        align: 'center',
        render: (_, item) => (<Image src={item.img} width={60} />)
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        align: 'center'
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        align: 'center'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text, item) => ( productTypeOP.find(e => e.value == text).label )
      },
      {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '购买价格',
        dataIndex: 'buy_price',
        key: 'buy_price',
        align: 'center'
      },
      {
        title: 'VIP等级',
        dataIndex: 'vip_level',
        key: 'vip_level',
        align: 'center',
        render: (text) => (productVipLevelOP.find(e => e.value == text).label)
      },
      {
        title: 'VIP天数',
        dataIndex: 'vip_day',
        key: 'vip_day',
        align: 'center'
      },
      {
        title: '金币',
        dataIndex: 'coins',
        key: 'coins',
        align: 'center'
      },
      /* {
        title: '支付方式',
        dataIndex: 'coins',
        key: 'coins',
        align: 'center',
        width: 134,
        render: (_, item) => (
          <>
            <Tree
              defaultExpandAll
              treeData={item.treeData}
            />
          </>
        )
      }, */
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
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
        align: 'center'
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (_: any, item: ProductBasedata) => (
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
      let res: any = await delProductApi_2(params)
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
    setCheckedKeys(data.checkedKeys)
    setIsModalVisible(true)
  }

  const onStatusChange = async (item) => {
    console.log(item);
    let params = {
      id: item.id,
      type: item.type,
      title: item.title,
      img: item.img,
      price: item.price,
      buy_price: item.buy_price,
      vip_level: item.vip_level,
      vip_day: item.vip_day,
      coins: item.coins,
      status: item.status == STATUS.ON ? STATUS.OFF : STATUS.ON,
      sort: item.sort,
      description: item.description,
    }
    console.log(params);
    try {
      let res: any = await updateProductApi_2(params)
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
      type: null,
      title: "",
      img: "",
      price: null,
      buy_price: null,
      vip_level: null,
      vip_day: null,
      coins: null,
      status: null,
      sort: null,
      description: "",
      updated_at: "",
      created_at: "",
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

  const getDataList = async () => {
    setLoading(true)
    let params = {
      per_age: pageSize,
      page: currentPage
    }
    try {
      let res: any = await getProductListApi_2(params)
      setCurrentPage(res.data.current_page)
      setTotal(res.data.total)
      setPageSize(res.data.per_page)
      let dataList = JSON.parse(JSON.stringify(res.data.data))

      /* let [resPayType, resPayGateway] = await Promise.all<any[]>([
        getPayTypeListApi_2(params),
        getPayGatewayListApi_2(params),
      ])

      let payTypeList = resPayType.data.data
      let payGatewayList = resPayGateway.data.data

      let tree: DataNode[] = []
      for (const pt of payTypeList.filter(e => e.status == STATUS.ON)) {
        let obj = tree.find(e => e.key == pt.id)
        if (obj) {

        } else {
          let childrenArr = []
          for (const pw of payGatewayList.filter(e => e.status == STATUS.ON)) {
            let childObj = childrenArr.find(e => e.id == pw.id)
            if (childObj) {

            } else {
              childrenArr.push({
                title: pw.name,
                key: `${pt.id}-${pw.id}`,
              })
            }
          }
          tree.push({
            title: pt.name,
            key: pt.id,
            children: childrenArr,
          })
        }
      }
      setTreeData(tree)
      console.log('tree', tree);

      let resProductPay: any = await getProductPayListApi_2(params)
      setAllPayttypeList(resProductPay.data.data)

      dataList.forEach(item => {
        let arr = resProductPay.data.data.filter(pp => pp.product_id == item.id)
        let treeData = []
        let checkedKeys = []
        arr.forEach(pp => {
          let obj = treeData.find(d => d.key == pp.type_id)
          if (obj) {
            let childObj = obj.children.find(pw => pw.key == pp.way_id)
            if (childObj) {

            } else {
              obj.children.push({
                icon: <Image src={payGatewayList.find(e => e.id == pp.way_id).img_url} />,
                title: payGatewayList.find(e => e.id == pp.way_id).name.replace(/(支付)(?!.*支付)/, ''),
                key: pp.way_id
              })
              checkedKeys.push(`${pp.type_id}-${pp.way_id}`)

            }
          } else {
            treeData.push({
              title: payTypeList.find(e => e.id == pp.type_id).name,
              key: pp.type_id,
              children: [
                {
                  icon: <Image src={payGatewayList.find(e => e.id == pp.way_id).img_url} />,
                  title: payGatewayList.find(e => e.id == pp.way_id).name.replace(/(支付)(?!.*支付)/, ''),
                  key: pp.way_id,
                }
              ]
            })
            checkedKeys.push(`${pp.type_id}-${pp.way_id}`)
          }
        });
        item.treeData = treeData
        item.checkedKeys = checkedKeys
      })
      console.log('------- dataList -----');
      console.log(dataList); */

      
      setDataSource(dataList)
    } catch (error) {

    } finally {
      setLoading(false)
    }
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
          initCheckedKeys={checkedKeys}
          treeData={treeData}
          onCancel={onCancel}
          onOk={onOk}
        />
      }
    </>
  )
}