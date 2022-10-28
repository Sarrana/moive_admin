import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { getCommentListApi_2, getVideoDetailApi_2, setCommentStatusApi_2 } from '@/request/api/video_2/comment'
import { cmtStatusOp } from '@/type'
import { momentToTime } from '@/utils'
import { Card, Col, message, Row, Select, Switch } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

// type SearchParamType = {
//     keywords: string
//     web_id: string
//     guard_name: string
//     result: string
//     user_from: string
//     date: Moment[] | null
// }

type QueryParamType = {
    vid: string         // 视频ID 
    pid: string         //  评论上架id
    state: string       // 状态
    content: string      // 内容搜索
    start_time: string
    end_time: string
}


export const VideoCmtList: React.FC = () => {
    const location = useLocation();
    const state = location.state;

    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [queryParam, setQueryParam] = useState<QueryParamType>(state?.queryParam || {
        vid: '',         // 视频ID 
        pid: '',         //  评论上架id
        state: "",       // 状态
        content: "",      // 内容搜索
        start_time: "",
        end_time: ""
    });

    useEffect(() => {
        getDataList()
    }, [currentPage, pageSize, queryParam])


    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'video_id',
                placeholder: '视频ID搜索',
                type: 'input',
                width: 100
            },
            {
                name: 'comment_id',
                placeholder: '评论上架ID搜索',
                type: 'input',
                width: 100
            },
            {
                name: 'keywords',
                placeholder: '评论内容关键字搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'status',
                placeholder: '审核状态',
                type: 'select',
                selectOp: cmtStatusOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'date',
                type: 'rangePicker'
            }
        ],
        []
    );

    const paramsData = {
        list: dataSource,
        showPagination: true,
        page: { dataTotal: total, size: pageSize, page: currentPage },
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                // render: (text: any, record: any, index: number) => `${index + 1}`
            },
            {
                title: '视频ID',
                dataIndex: 'vid',
                key: 'vid',
                align: 'center'
            },
            {
                title: '评论上架ID',
                dataIndex: 'pid',
                key: 'pid',
                align: 'center'
            },
            {
                title: '评论内容',
                dataIndex: 'content',
                key: 'content',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: (text: any, item: any) => (<Switch onClick={() => { onCmtStatusChange(item.id, item.state) }} checked={`${item.state}` == '1'} />),
                align: 'center'
            },
            {
                title: '评论时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
        ]
    }

    const getDataList = () => {
        const params = {
            per_age: pageSize,
            page: currentPage,
            ...queryParam
        }
        setLoading(true);
        getCommentListApi_2(params).then((res: any) => {
            setDataSource(res.data.data)
            setCurrentPage(Number(res.data.current_page))
            setPageSize(Number(res.data.per_page))
            setTotal(Number(res.data.total))
            setLoading(false);

            // const videoDetail = getVideoDetail(res.data.data[0].vid)
            // console.log(videoDetail);

        }).catch(e => {
            setLoading(false);
        })
    }

    const getVideoDetail = async (id) => {
        let data = {
            id,
        }
        const res = await getVideoDetailApi_2(data)
        return res
    }

    const onSearch = useCallback(
        (params) => {
            console.log('---------- onSearch ---------');

            console.log(params);
            
            const data = {
                vid: params.video_id,         // 视频ID 
                pid: params.comment_id,         //  评论上架id
                state: params.status,       // 状态
                content: params.keywords,      // 内容搜索
                start_time: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                end_time: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : ''
            }
            setCurrentPage(1)
            setQueryParam(data)
        },
        [],
    )


    const onChange = (pageParams) => {
        setCurrentPage(pageParams.current)
        setPageSize(pageParams.pageSize)
    }

    const onCmtStatusChange = (id: number, status: string) => {
        console.log('--------- onCmtStatusChange ----------');
        const params = {
            id: id
        }
        setCommentStatusApi_2(params).then((res) => {
            message.success('操作成功')
            getDataList()
        }).catch(e => {  })
    }

    return (
        <Row gutter={[12, 30]}>
            <Col span={24}>
                <SearchForm
                    formList={formList}
                    onSearch={onSearch}
                // params={}
                />
            </Col>
            <Col span={24}>
                <Card>
                    <BaseTable 
                        data={paramsData} 
                        onChange={onChange} 
                        loading={loading} 
                    />
                </Card>
            </Col>
        </Row>
    )
}