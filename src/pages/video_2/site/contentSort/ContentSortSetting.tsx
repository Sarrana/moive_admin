import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Button, Row, Col, Card, message, Modal, Form, Input, Space, Image } from 'antd'
import { delVideoSortVideoApi_2, getVideoAllCategoryApi_2, getVideoAllCTypeApi_2, getVideoSortListApi_2, postVideoSortVideoEditApi_2 } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import { getSearchParams } from '@/utils';
import { ContentSortSettingQuerier } from './ContentSortSettingQuerier';
import { videoSerialOp, _OptionType } from '@/type';
import { ContentSortSettingAddModal } from './ContentSortSettingAddModal';

type BaseDataType = {
    id: number
    /** 视频id */
    content_id: number
    /** 排序值（越大越靠前） */
    sort: number
    name: string
    pic: string
    type: string,
    /** 介绍 */
    present: string,
    /** 已上传集数 */
    episodes_count: number,
    total: number,
    /** 连载状态 */
    mode: string,
    area: string,
    year: string,
    score: number,
    play_amount: number,
    /** 状态：1-开启，2-关闭 */
    status: string,
    /** 发布时间 */
    created_at: string,
}

type EditModalPropType = {
    dataSource: BaseDataType
    visible: boolean
    handleCancel: () => void
    handleOk: () => void
}

const EditModal: React.FC<EditModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk } = P

    const [form] = Form.useForm();

    const onFinish = () => {
        form.validateFields().then((v: any) => {
            // console.log('values ', v, status);
            postVideoSortVideoEditApi_2(dataSource.id, { sort: v.sort }).then((res: any) => {
                message.success('修改成功');
                handleOk();
            });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        });
    }

    return (
        <Modal
            title="编辑排序视频"
            visible={visible}
            width={600}
            centered
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            onOk={onFinish}
            destroyOnClose>
            <Form
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                initialValues={dataSource || {}}>
                <Form.Item label="作品排序" name="sort" rules={[{ required: true, message: '请输入作品序号' }]}>
                    <Input type="number" allowClear />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const ContentSortSetting: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);

    const [classifyArr, setClassifyArr] = useState([]);
    const [typeArr, setTypeArr] = useState([]);
    const [cTypeArr, setCTypeArr] = useState([]);
    const [serialArr, setSerialArr] = useState(videoSerialOp);
    const [forQueryParam, setForQueryParam] = useState({});
    const [queryParam, setQueryParam] = useState({ name: '', date: null, classify: null, type: null, serial: null, state: null })
    const onValueChange = (type: string, key: string, v: any, o?: any) => {
        // console.log('onValueChange  ', key, v, o);
        if (type == "input") {
            setQueryParam({ ...queryParam, [key]: v.target.value });
        } else if (type == "dateRange") {
            // const d = v ? [momentToTime(v[0], 'YYYY-MM-DD'), momentToTime(v[1], 'YYYY-MM-DD')] : ['', ''];
            setQueryParam({ ...queryParam, [key]: v });
        } else if (type == "checkbox") {
            setQueryParam({ ...queryParam, [key]: v.target.checked });
        } else {
            if (key == "classify") {
                setQueryParam({ ...queryParam, [key]: v, type: null });
                if (v) {
                    setTypeArr(cTypeArr.filter((val) => val.id == v)[0]?.video_type || []);
                } else {
                    setTypeArr([]);
                }
            } else {
                setQueryParam({ ...queryParam, [key]: v });
            }
        }
    }
    const onQuery = () => {
        let params = {
            keywords: queryParam.name,
            time_1: queryParam.date ? queryParam.date[0].format('YYYY-MM-DD') : '',
            time_2: queryParam.date ? queryParam.date[1].format('YYYY-MM-DD') : '',
            cid: queryParam.classify,
            type: queryParam.type,
            videomode: queryParam.serial,
            state: queryParam.state
        }
        setPage(1);
        setForQueryParam({ ...params });
    }
    const onReset = () => {
        // setPage(1);
        setQueryParam({ name: '', date: null, classify: null, type: null, serial: null, state: null });
        setForQueryParam({});
        setTypeArr([]);
    }

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const onDelete = (id: number) => {
        delVideoSortVideoApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
    const onEdit = (item: BaseDataType) => {
        setBaseDetail(item);
        setVisibleEditModal(true);
    }
    const handleAdd = () => {
        setVisibleAddModal(true)
    }
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const paramsData = {
        list: baseData,
        columns: [
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
                align: 'center'
            },
            {
                title: '视频封面',
                dataIndex: 'pic',
                key: 'pic',
                render: (text: any, item: any) => (<Image src={item.pic} width={80} />),
                align: 'center'
            },
            {
                title: '视频名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '视频分类',
                dataIndex: 'c_text',
                key: 'c_text',
                align: 'center'
            },
            {
                title: '视频类型',
                dataIndex: 'type',
                key: 'type',
                align: 'center'
            },
            {
                title: '视频简介',
                dataIndex: 'present',
                key: 'present',
                render: (text: any, item: any) => (item.present.length > 30 ? `${item.present.slice(0, 30)}...` : item.present),
                align: 'center'
            },
            {
                title: '上传剧集',
                dataIndex: 'episodes_count',
                key: 'episodes_count',
                render: (text: any, item: any) => Number(item.episodes_count),
                align: 'center'
            },
            {
                title: '视频总数',
                dataIndex: 'total',
                key: 'total',
                render: (text: any, item: any) => Number(item.total),
                align: 'center'
            },
            {
                title: '视频模式',
                dataIndex: 'mode',
                key: 'mode',
                align: 'center'
            },
            {
                title: '地区',
                dataIndex: 'area',
                key: 'area',
                align: 'center'
            },
            {
                title: '年代',
                dataIndex: 'year',
                key: 'year',
                align: 'center'
            },
            {
                title: '综合评分',
                dataIndex: 'score',
                render: (text: any, item: any) => Number(item.score),
                key: 'score',
                align: 'center'
            },
            {
                title: '播放量',
                dataIndex: 'play_amount',
                render: (text: any, item: any) => Number(item.play_amount),
                key: 'play_amount',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                // render: (v: any, item: any) => (item.status + '' === '1' ? '开' : '关'),
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (v: any, item: any) => (
                    <Space direction="vertical" size={[4, 4]}>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onEdit(item) }}>编辑</Button>
                            <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
                        </Space>
                    </Space>
                ),
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }

    const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false)
    const modalAddConfirm = () => {
        modalAddCancel()
        initData()
    }
    const modalAddCancel = () => {
        setVisibleAddModal(false)
    }

    const [baseDetail, setBaseDetail] = useState<BaseDataType | null>(null)
    const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false)
    const modalEditConfirm = () => {
        modalEditCancel()
        initData()
    }
    const modalEditCancel = () => {
        setBaseDetail(null)
        setVisibleEditModal(false)
    }

    const initData = () => {
        setLoadingTable(true);
        getVideoSortListApi_2(obj.id, { page, per_page, ...forQueryParam }).then((res: any) => {
            setBaseData(res.data.data);
            setPage(Number(res.data.current_page));
            setPer_page(Number(res.data.per_page));
            setDataTotal(Number(res.data.total));
            setLoadingTable(false);
        }).catch(() => {
            setLoadingTable(false);
        });
    }
    const getOpList = () => {
        getVideoAllCategoryApi_2().then((res: any) => {
            setClassifyArr(res.data);
        });
        getVideoAllCTypeApi_2().then((res: any) => {
            setCTypeArr(res.data);
        });
    }

    useEffect(() => {
        getOpList()
    }, [])

    useEffect(() => {
        initData()
    }, [page, per_page, forQueryParam])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Card>
                        <ContentSortSettingQuerier
                            params={queryParam}
                            classifyArr={classifyArr}
                            typeArr={typeArr}
                            serialArr={serialArr}
                            onValueChange={onValueChange}
                            onQuery={onQuery}
                            onReset={onReset} />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                            <Button type="primary" danger onClick={() => { handleAdd() }}>新增</Button>
                            <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {visibleAddModal
                && (
                    <ContentSortSettingAddModal
                        recommend_id={obj.id}
                        visible={visibleAddModal}
                        classifyArr={classifyArr}
                        cTypeArr={cTypeArr}
                        serialArr={serialArr}
                        handleOk={modalAddConfirm}
                        handleCancel={modalAddCancel} />
                )}
            {visibleEditModal
                && (
                    <EditModal
                        visible={visibleEditModal}
                        dataSource={baseDetail}
                        handleOk={modalEditConfirm}
                        handleCancel={modalEditCancel} />
                )}
        </>
    )
}
