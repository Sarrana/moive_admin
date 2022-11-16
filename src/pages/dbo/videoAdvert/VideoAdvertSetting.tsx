import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space, Image, InputNumber, Tooltip } from 'antd'
import { getVideoAdListApi, editVideoAdApi, delVideoAdApi, getVideoOpApi, addVideoAdApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import { ImgUploader } from '@/components/upload';
import { getSearchParams } from '@/utils';
import DebounceSelect from '@/components/debounceSelect';
import { ADTERMINAL } from '@/constants/video2';

type AddModalPropType = {
    obj: any,
    dataSource: any
    visible: boolean
    handleCancel: () => void
    handleOk: (params: any) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk, obj } = P
    // console.log(111, dataSource)
    const [form] = Form.useForm();
    const [status, setStatus] = useState(dataSource.status);

    const onFinish = () => {
        form.validateFields().then((values: any) => {
            console.log('values ', values);
            if (values.upper_mb.some((v) => v.status == "uploading") || values.upper_pc.some((v) => v.status == "uploading")) {
                message.warn('请等待图片上传完成');
                return;
            }
            let upper_mb = ''
            if (values.upper_mb && values.upper_mb.length) {
                upper_mb = values.upper_mb[0].url
            }
            let upper_pc = ''
            if (values.upper_pc && values.upper_pc.length) {
                upper_pc = values.upper_pc[0].url
            }
            handleOk({
                id: dataSource.id,
                mobile_image_url: upper_mb,
                image_url: upper_pc,
                link_url: values.link_url,
                sort: values.sort,
                title: values.video[0]?.label || '',
                video_id: values.video[0]?.value || null,
                status: status
            });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo, status);
        });
    }

    const changeStatus = (e: boolean) => {
        const p = e ? '1' : '2';
        form.setFieldsValue({ status: p });
        setStatus(p);
    }

    const [videoValue, setVideoValue] = useState([]);
    const fetchVideoList = async (username: string): Promise<any[]> => {
        return new Promise((resolve) => {
            getVideoOpApi({ keywords: username }).then((res: any) => {
                let arr = []
                res.data.forEach((element) => {
                    arr.push({ key: element.id, label: element.name, value: element.id })
                });
                resolve(arr);
            }).catch(() => {
                resolve([]);
            })
        })
    }
    useEffect(() => {
        console.log();
        
      console.log(obj);
      
    }, [])
    

    return (
        <Modal
            title={dataSource.id ? '编辑' : '创建'}
            visible={visible}
            width={800}
            centered
            onCancel={handleCancel}
            okText="保存"
            cancelText="取消"
            onOk={onFinish}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                preserve={false}>
                {/* <Form.Item label="广告图" name="image_url" initialValue={dataSource?.image_url} rules={[{ required: true, message: '请选择广告图' }]}>
                    <ImgUploader
                        file_type="pic"
                        category="bannerpic"
                        accept="image/jpeg,image/png,image/gif"
                        maxCount={1} />
                </Form.Item> */}
                <Form.Item label="广告图">
                    <Space direction="horizontal" size="large">
                        <Form.Item label="手机端" name="upper_mb" initialValue={dataSource?.mobile_image_url} rules={[{ required: true, message: '请上传图片' }]}>
                            <ImgUploader
                                label="上传"
                                file_type="pic"
                                category="bannerpic"
                                accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                                maxCount={1} />
                        </Form.Item>
                        {
                            obj.terminal == ADTERMINAL.WEB
                            && <Form.Item label="PC端" name="upper_pc" initialValue={dataSource?.image_url} rules={[{ required: true, message: '请上传图片' }]}>
                                <ImgUploader
                                    label="上传"
                                    file_type="pic"
                                    category="bannerpic"
                                    accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                                    maxCount={1} />
                            </Form.Item>
                        }

                    </Space>
                </Form.Item>
                {/* <Form.Item label="链接位置" name="link_url" initialValue={dataSource?.link_url} rules={[{ required: true, message: '请输入链接位置' }]}> */}
                <Form.Item label="链接位置" name="link_url" initialValue={dataSource?.link_url}>
                    <Input
                        placeholder="请输入链接位置"
                        allowClear />
                </Form.Item>
                {/* <Form.Item label="视频名称" name="video" initialValue={dataSource.id ? [{ key: dataSource.video_id, label: dataSource.video_name, value: dataSource.video_id }] : []} rules={[{ required: true, message: '请输入视频名称' }]}> */}
                <Form.Item label="视频名称" name="video" initialValue={dataSource.id ? [{ key: dataSource.video_id, label: dataSource.video_name, value: dataSource.video_id }] : []} >
                    <DebounceSelect
                        mode="multiple"
                        value={videoValue}
                        fetchOptions={fetchVideoList}
                        onChange={(newValue) => { setVideoValue(newValue) }}
                        style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="排序" name="sort" initialValue={dataSource?.sort} rules={[{ required: true, message: '请输入排序' }]}>
                    <InputNumber min={1} placeholder="请输入排序" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="使用状态" name="status">
                    <Switch onClick={(e) => { changeStatus(e) }} checked={`${status}` == '1'} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export const VideoAdvertSetting: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);

    console.log(obj);
    const onBack = () => {
        navigate('/Dbo/VideoAdvert', { state: location.state, replace: false });
    }

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState([])
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    let paramsData = {
        list: baseData,
        columns: [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                render: (text: any, record: any, index: number) => `${index + 1}`
            },
           /*  {
                title: 'PC图片',
                dataIndex: 'image_url',
                key: 'image_url',
                align: 'center',
                render: (_: any, item) => (<Image style={{ width: 80 }} src={item.image_url} />)
            }, */
            {
                title: '移动图片',
                dataIndex: 'mobile_image_url',
                key: 'mobile_image_url',
                align: 'center',
                render: (_: any, item) => (<Image style={{ width: 80 }} src={item.mobile_image_url} />)
            },
            {
                title: '位置链接',
                dataIndex: 'link_url',
                key: 'link_url',
                align: 'center',
                render: (v: any, item) => {
                    if (!v) return ''
                    const isLongTag = v.length > 30;
                    return isLongTag ? <Tooltip title={v} key={v}>{isLongTag ? `${v.slice(0, 30)}...` : v}</Tooltip> : v;
                }
            },
            {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
                align: 'center'
            },
            {
                title: '控制',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (_: any, item) => (<Switch onClick={() => { changeStatus(item) }} checked={`${item.status}` === '1'} />)
            },
            {
                title: '操作员',
                dataIndex: 'created_by',
                key: 'created_by',
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
                render: (v: any, item: any) => (
                    <Space>
                        <Button type="link" size="small" onClick={() => { handleItem(item) }}>编辑</Button>
                        <Button type="link" size="small" onClick={() => { handleDel(item.id) }}>删除</Button>
                    </Space>
                ),
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }
    if (obj.terminal == ADTERMINAL.WEB) {
        let column = {
            title: 'PC图片',
            dataIndex: 'image_url',
            key: 'image_url',
            align: 'center',
            render: (_: any, item) => (<Image style={{ width: 80 }} src={item.image_url} />)
        }
        paramsData.columns.splice(1,0, column)
    }

    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const changeStatus = (item) => {
        editVideoAdApi(obj.posId, { ...item, status: (`${item.status}`) === '1' ? '2' : '1' }).then((res: any) => {
            message.success('操作成功')
            initData()
        }).catch((e) => {

        })
    }
    const handleDel = (id: number) => {
        delVideoAdApi(obj.posId, id).then((res: any) => {
            message.success('删除成功')
            initData()
        }).catch((e) => {

        })
    }

    const [baseDetail, setBaseDetail] = useState(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const handleAdd = () => {
        let data = { id: null, status: '1' }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item) => {
        setBaseDetail(item)
        setVisibleModal(true)
    }

    const modalConfirm = (params) => {
        const operationApi = params.id ? editVideoAdApi : addVideoAdApi

        operationApi(obj.posId, params).then((res: any) => {
            message.success(res.message)
            modalCancel()
            initData()
        }).catch((e) => { })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }

    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page
        }
        getVideoAdListApi(obj.posId, params).then((res: any) => {
            setBaseData(res.data.data)
            setDataTotal(res.data.total)
            setLoadingTable(false)
        }).catch(() => {
            setLoadingTable(false)
        })
    }

    useEffect(() => {
        initData()
    }, [page, per_page])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                            <Space size={[20, 4]}>
                                <Button type="primary" danger onClick={() => { handleAdd() }}>新增</Button>
                                <Button type="primary" onClick={onBack}>返回</Button>
                            </Space>
                            <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {baseDetail
                && (
                    <AddModal
                        obj={obj}
                        dataSource={baseDetail}
                        visible={visibleModal}
                        handleOk={modalConfirm}
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
