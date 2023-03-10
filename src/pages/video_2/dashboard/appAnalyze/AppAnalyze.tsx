import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { DATACOLOR, LASTDAYS, ORDERSTATUS } from '@/constants/video2'
import { getAppLogTodayApi, getAppLogUserDailyApi } from '@/request'
import { getOrderListApi_2 } from '@/request/api/video_2/order'
import { OrderBaseData, orderStatusOP } from '@/type'
import { momentToTime } from '@/utils'
import { Card, Col, Row, Space, Statistic, Table, Tag} from 'antd'
import Select from 'rc-select'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'

import './index.scss'
import moment from 'moment'

type QueryParamType = {
  start_time: string
  end_time: string
}

export const AppAnalyze = () => {
  const location = useLocation();
  const state = location.state;

  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<OrderBaseData[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [todayActive, setTodayActive] = useState<number>(0)
  const [todayAdd, setTodayAdd] = useState<number>(0)
  const [todayReg, setTodayReg] = useState<number>(0)

  const [lineChartData, setLineChartData] = useState(null)
  const [totleData, setTotleData] = useState({
    register: 0,
    add: 0,
    active: 0
  })

  const [queryParam, setQueryParam] = useState<QueryParamType>(state?.queryParam || {
    start_time: '',
    end_time: '',
  })


  useEffect(() => {
    getDataList()
    getTodayData()
    getRecent15Data()
  }, [currentPage, pageSize, queryParam])

  const linOption = {
    grid: {
      left: '2%',
      right: '4%',
      bottom: '1%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: lineChartData ? lineChartData.legend : []
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: lineChartData ? lineChartData.xAxis : []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '??????',
      type: 'line',
      lineStyle: {
        color: DATACOLOR.REGISTER
      },
      itemStyle: {
        color: DATACOLOR.REGISTER
      },
      data: lineChartData?.Register
    }, {
      name: '??????',
      type: 'line',
      lineStyle: {
        color: DATACOLOR.ADD
      },
      itemStyle: {
        color: DATACOLOR.ADD
      },
      data: lineChartData?.Add
    }, {
      name: '??????',
      type: 'line',
      lineStyle: {
        color: DATACOLOR.ACTIVE
      },
      itemStyle: {
        color: DATACOLOR.ACTIVE
      },
      data: lineChartData?.Active
    }]
  }

  const formList = useMemo<SearchFormItem[]>(() => [
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
        title: '??????',
        dataIndex: 'day',
        key: 'day',
        align: 'center'
      },
      {
        title: '??????',
        dataIndex: 'reg',
        key: 'reg',
        align: 'center'
      },
      {
        title: '??????',
        dataIndex: 'add',
        key: 'add',
        align: 'center'
      },
      {
        title: '??????',
        dataIndex: 'active',
        key: 'active',
        align: 'center'
      },
      {
        title: '????????????',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center'
      },
      {
        title: '????????????',
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

  const getTodayData = async () => {
    setLoading(true)
    try {
      let res: any = await getAppLogTodayApi()
      console.log(res);
      setTodayActive(res?.data?.now_active)
      setTodayAdd(res?.data?.now_add)
      setTodayReg(res?.data?.now_reg)
    } catch (err) {

    }
  }

  const getDataList = async () => {
    setLoading(true)
    let params = {
      per_page: pageSize,
      page: currentPage,
      ...queryParam
    }
    try {
      let res: any = await getAppLogUserDailyApi(params)
      setCurrentPage(res.data.current_page)
      setTotal(res.data.total)
      setPageSize(res.data.per_page)
      setDataSource(res.data.data)
      // let data = {
      //   xAxis: [],
      //   legend: ['??????', '??????', '??????'],
      //   Register: [],
      //   Add: [],
      //   Active: []
      // }
      let total = {
        register: 0,
        add: 0,
        active: 0
      }
      res.data.data.forEach(item => {
        // data.xAxis.unshift(item.day)
        // data.Register.unshift(item.reg)
        // data.Add.unshift(item.add)
        // data.Active.unshift(item.active)
        total.register += item.reg
        total.add += item.add
        total.active += item.active
      });
      // setLineChartData(data)
      setTotleData(total)
    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false)
    }
  }

  const getRecent15Data = async () => {
    setLoading(true)
    let params = {
      per_page: 15,
      page: 1,
      start_time: moment().add(-LASTDAYS, 'days').format('YYYY-MM-DD') + ' 00:00:00',
      end_time: moment().format('YYYY-MM-DD') + ' 23:59:59'
    }
    try {
      let res: any = await getAppLogUserDailyApi(params)
      let data = {
        xAxis: [],
        legend: ['??????', '??????', '??????'],
        Register: [],
        Add: [],
        Active: []
      }
      res.data.data.forEach(item => {
        data.xAxis.unshift(item.day)
        data.Register.unshift(item.reg)
        data.Add.unshift(item.add)
        data.Active.unshift(item.active)
      });
      setLineChartData(data)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const onSearch = useCallback(
    (params) => {
      console.log('----- onSearch ----');
      console.log(params);

      const data = {
        start_time: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD')+' 00:00:00' : '' ,
        end_time: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD')+' 23:59:59' : ''
      }
      setCurrentPage(1)
      setQueryParam(data)
    },
    [],
  )

  return (
    <>
      <Row gutter={[12, 30]}>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={8}>
                <Statistic valueStyle={{color: DATACOLOR.REGISTER}} title='???????????????' value={todayReg} />
              </Col>
              <Col span={8}>
                <Statistic valueStyle={{color: DATACOLOR.ADD}} title='???????????????' value={todayAdd} />
              </Col>
              <Col span={8}>
                <Statistic valueStyle={{color: DATACOLOR.ACTIVE}} title='???????????????' value={todayActive} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <SearchForm
            formList={formList}
            onSearch={onSearch} />
        </Col>
        <Col span={24}>
          <Card>
            <Space>
              <Tag color={DATACOLOR.REGISTER}>???????????????{totleData.register}</Tag>
              <Tag color={DATACOLOR.ADD}>???????????????{totleData.add}</Tag>
              <Tag color={DATACOLOR.ACTIVE}>???????????????{totleData.active}</Tag> 
            </Space>

            <Space direction='vertical' size={[4, 30]} style={{ width: '100%' }}>
              <BaseTable
                data={paramsData}
                onChange={onChange}
                loading={loading}
              />
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title='??????15???'>
            <ReactECharts
              option={linOption}
              showLoading={loading}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}