import { Row, Col, Space, Image, Card, Typography, Button, Form, Input, Select, message, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { opValToId, VideoDetail, videoEpOp } from '@/type';
import { postVideoAddApi_2, postVideoEditApi_2, videoWebSearchApi_2, videoRelationApi_2 } from '@/request';
import loading from '@/components/loading/Loading';
import { AddStarModal, EditStarModal, UploadPosterModal, WebSearchModal } from './VideoContentAddModal';
import DebounceSelect from '@/components/debounceSelect';
import './VideoContentAdd.scss'

const { Title } = Typography;
const { Search } = Input;

export const VideoContentAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params: VideoDetail = location.state.data;
    const classifyArr = location.state.classifyArr;
    const cTypeArr = location.state.cTypeArr;
    const areaArr = location.state.areaArr;
    const yearArr = location.state.yearArr;
    const pageSize = location.state.pageSize;
    const currentPage = location.state.currentPage;
    const queryParam = location.state.queryParam;
    const tagArr = params && params.tags ? params.tags.split(',') : [];
    const aliasArr = params && params.alias ? params.alias : [];
    const isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑内容" : "新增内容";
    const tempSelectCid = params && params.cid ? Number(params.cid) : null;
    const tempTypeArr = cTypeArr.filter((v) => v.id == tempSelectCid)[0]?.video_type || [];
    const [form] = Form.useForm();
    // const [dataSource, setDataSource] = useState(params);
    const [selectCid, setSelectCid] = useState(tempSelectCid);
    const [typeArr, setTypeArr] = useState(tempTypeArr);
    const [isHorImgUrl, setHorImgUrl] = useState<string>(params?.level_pic || '');
    const [isVerImgUrl, setVerImgUrl] = useState<string>(params?.pic || '');

    const onBack = () => {
        navigate('/Video2/ContentMgr/ContentList', { state: { currentPage, pageSize, queryParam }, replace: false });
    }

    const [showModal, setShowModal] = useState(false)
    const onShowModal = () => {
        setShowModal(true)
    }
    const onHideModal = () => {
        setShowModal(false)
    }

    const onConfirm = (horImgUrl, verImgUrl) => {
        setHorImgUrl(horImgUrl);
        setVerImgUrl(verImgUrl);
        setShowModal(false)
    }

    const imgBox = (alt, url) => {
        if (url) {
            return <Image src={url} alt={alt} />
        }
        return <div style={{ width: '100%', textAlign: 'center' }}>{alt}</div>
    }

    const [tagsNode, setTagsNode] = useState<React.ReactElement[]>([]);
    const [aliasNode, setAliasNode] = useState<React.ReactElement[]>([]);
    const [tags, setTags] = useState<string[]>(tagArr);
    const [alias, setAlias] = useState<string[]>(aliasArr);
    const [inputTag, setInputTag] = useState<string>("");
    const [inputAlias, setInputAlias] = useState<string>("");
    const onCloseTag = (removedTag) => {
        const newtags = tags.filter((v) => v !== removedTag);
        setTags(newtags);
    }
    const onCloseAlias = (removedTag) => {
        const newtags = alias.filter((v) => v !== removedTag);
        setAlias(newtags);
    }
    const renderTag = () => {
        if (!tags.length) return null;
        return tags.map((v, i) => {
            const isLongTag = v.length > 20;
            const tagElem = (
                <Tag key={`${i}_${v}`} closable onClose={() => onCloseTag(v)} style={{ marginBottom: '8px' }}>
                    {isLongTag ? `${v.slice(0, 20)}...` : v}
                </Tag>
            );
            return isLongTag ? <Tooltip title={v} key={`${i}_${v}`}>{tagElem}</Tooltip> : tagElem;
        });
    }
    const renderAlias = () => {
        if (!alias.length) return null;
        return alias.map((v, i) => {
            const isLongTag = v.length > 20;
            const tagElem = (
                <Tag key={`${i}_${v}`} closable onClose={() => onCloseAlias(v)} style={{ marginBottom: '8px' }}>
                    {isLongTag ? `${v.slice(0, 20)}...` : v}
                </Tag>
            );
            return isLongTag ? <Tooltip title={v} key={`${i}_${v}`}>{tagElem}</Tooltip> : tagElem;
        });
    }
    const onInputTag = (e) => {
        setInputTag(e.target.value);
    }
    const onInputAlias = (e) => {
        setInputAlias(e.target.value);
    }

    const onAddTag = () => {
        const temp = inputTag.trim();
        if (temp && tags.every((v) => v != temp)) {
            const newtags = tags.concat([temp]);
            setTags(newtags);
            setInputTag('');
            form.validateFields(['keyName']);
        }
    }
    const onAddAlias = () => {
        const temp = inputAlias.trim();
        if (temp && alias.every((v) => v != temp)) {
            const newtags = alias.concat([temp]);
            setAlias(newtags);
            setInputAlias('');
            // form.validateFields(['alias']);
        }
    }
    const keyNameRule = {
        required: true,
        message: '请输入视频关键字',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                tags && tags.length ? resolve(null) : reject();
            });
        }
    }

    const scoreRule = {
        required: true,
        message: '分数为1到10的整数或一位小数',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                if (!value) {
                    reject();
                } else {
                    const arr = (`${value}`).split('.');
                    const v = Number(value);
                    if (arr.length > 1) {
                        if (arr[1].length != 1) {
                            reject();
                        } else {
                            (!v || Number.isNaN(v) || v < 1 || v > 10 || !Number(arr[1])) ? reject() : resolve(null);
                        }
                    } else {
                        (!v || Number.isNaN(v) || v < 1 || v > 10) ? reject() : resolve(null);
                    }
                }
            });
        }
    }

    const onClassifyChange = (v) => {
        form.setFieldsValue({ cid: v });
        form.setFieldsValue({ type: [] });
        setSelectCid(v);
    }

    const [showAddModal, setShowAddModal] = useState(false)
    const [addModalProp, setAddModalProp] = useState(null)
    const [actorValue, setActorValue] = useState<{ key: number | string, label: string, value: number | string }[]>([]);
    const [actorSelect, setActorSelect] = useState<any[]>([]);
    const [directorValue, setDirectorValue] = useState<{ key: number | string, label: string, value: number | string }[]>([]);
    const [directorSelect, setDirectorSelect] = useState<any[]>([]);
    const [showEditStarModal, setShowEditStarModal] = useState(false)
    const [editStarModalProp, setEditStarModalProp] = useState(null)
    const onHideAddModal = () => {
        setShowAddModal(false)
    }
    const onHideEditModal = () => {
        setShowEditStarModal(false)
    }
    const onSelectAndJoin = (v, type) => {
        onHideEditModal()
        if (type == 'actor') {
            onAddActor(v)
        } else {
            onAddDirector(v)
        }
    }
    const editStarProp = {
        params: null,
        type: null,
        onHide: onHideEditModal,
        onOk: onSelectAndJoin
    }
    const onEitdActorModal = (v, type) => {
        onHideAddModal()
        setEditStarModalProp({ ...editStarProp, params: v, type: type })
        setShowEditStarModal(true)
    }

    const onAddActor = (v) => {
        onHideAddModal()
        if (!actorValue.find((val) => `${val.value}` == `${v.value}`)) {
            setActorValue([...actorValue, v])
        }
        if (!actorSelect.find((val) => `${val}` == `${v.value}`)) {
            setActorSelect([...actorSelect, v.value])
        }
    }
    const onActorChange = (v, i) => {
        setActorSelect(v)
        setActorValue(i)
    }
    const addActorProp = {
        title: '添加主演',
        type: 'actor',
        onHide: onHideAddModal,
        onOk: onAddActor,
        onEdit: onEitdActorModal
    }
    const onAddActorModal = () => {
        setAddModalProp(addActorProp)
        setShowAddModal(true)
    }

    const onAddDirector = (v) => {
        onHideAddModal()
        if (!directorValue.find((val) => `${val.value}` == `${v.value}`)) {
            setDirectorValue([...directorValue, v])
        }
        if (!directorSelect.find((val) => `${val}` == `${v.value}`)) {
            setDirectorSelect([...directorSelect, v.value])
        }
    }
    const onDirectorChange = (v, i) => {
        setDirectorSelect(v)
        setDirectorValue(i)
    }
    const addDirectorProp = {
        title: '添加导演',
        type: 'director',
        onHide: onHideAddModal,
        onOk: onAddDirector,
        onEdit: onEitdActorModal
    }
    const onAddDirectorModal = () => {
        setAddModalProp(addDirectorProp)
        setShowAddModal(true)
    }

    const initStar = () => {
        setActorValue(params.starring?.map((v, i) => ({ key: v.id || `key_${i}`, label: v.name, value: v.id || `key_${i}` })) || [])
        setActorSelect(params.starring?.map((v, i) => v.id || `key_${i}`) || [])
        setDirectorValue(params.director?.map((v, i) => ({ key: v.id || `key_${i}`, label: v.name, value: v.id || `key_${i}` })) || [])
        setDirectorSelect(params.director?.map((v, i) => v.id || `key_${i}`) || [])
    }

    const [relationValue, setRelationValue] = useState(null);
    // const [relationValue, setRelationValue] = useState({ value: 15, label: '恐吓', key: 15 });
    const fetchRelationList = async (name: string): Promise<any[]> => {
        return new Promise((resolve) => {
            videoRelationApi_2({ seriesname: name }).then((res: any) => {
                let arr = []
                res.data.forEach((element) => {
                    arr.push({ key: element.id, label: element.seriesname, value: element.id })
                });
                resolve(arr);
            }).catch(() => {
                resolve([]);
            })
        })
    }

    const [webSearchData, setWebSearchData] = useState(null);
    const onSearch = (v) => {
        if (!v) return
        // let dataa = { status: "success", code: 200, message: "", data: [{ link: "https:\/\/movie.douban.com\/subject\/3742360\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p1512562287.webp", title: "\u8ba9\u5b50\u5f39\u98de\u200e (2010)[\u53ef\u64ad\u653e]", rating_nums: 8.9, attr: "\u4e2d\u56fd\u5927\u9646\/\u4e2d\u56fd\u9999\u6e2f\/\u5267\u60c5\/\u559c\u5267\/\u52a8\u4f5c\/\u897f\u90e8\/\u8ba9\u5b50\u5f39\u98de\u4e00\u4f1a\u513f\/\u706b\u70e7\u4e91\/132\u5206\u949f", actors: "\u59dc\u6587\/\u845b\u4f18\/\u5468\u6da6\u53d1\/\u5218\u5609\u73b2\/\u9648\u5764\/\u5f20\u9ed8\/\u59dc\u6b66\/\u5468\u97f5" }, { link: "https:\/\/movie.douban.com\/subject\/10468418\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2214510927.webp", title: "\u8d8a\u8fc7\u5c71\u4e18 Tepenin Ardi\u200e (2012)", rating_nums: 0, attr: "\u571f\u8033\u5176\/\u5e0c\u814a\/\u5267\u60c5\/\u8c01\u8ba9\u5b50\u5f39\u98de(\u53f0)\/\u5c71\u5dc5\/94\u5206\u949f", actors: "\u57c3\u654f\u00b7\u963f\u5c14\u67cf\/\u5854\u6885\u5c14\u00b7\u83b1\u6587\u7279\/Reha \u00d6zcan\/\u83ab\u8499\u7279\u00b7\u5965\u5179\u53e4\u5c14" }, { link: "https:\/\/movie.douban.com\/subject\/26808231\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2357158211.webp", title: "\u4e00\u9897\u5b50\u5f39\u200e (2015)", rating_nums: 0, attr: "\u4e2d\u56fd\u5927\u9646\/\u77ed\u7247\/\u4e0d\u8ba9\u5b50\u5f39\u98de", actors: "\u675c\u5174\/\u6a0a\u5efa\u5ddd" }, { link: "https:\/\/movie.douban.com\/subject\/26593738\/", cover_image_url: "https:\/\/img9.doubanio.com\/f\/movie\/00505c87d1e80c42b36ee5e89339d2c8bb37f7a8\/pics\/movie\/tv_default_medium.png", title: "\u5de6\u8fb9\u662f\u9ec4\u6cb3\u53f3\u8fb9\u662f\u5d16\u200e (1985)[\u5267\u96c6]", rating_nums: 0, attr: "\u4e2d\u56fd\u5927\u9646\/\u5267\u60c5", actors: "\u738b\u65b9\u9488\/\u827e\u4e1c" }, { link: "https:\/\/movie.douban.com\/subject\/20451400\/", cover_image_url: "https:\/\/img9.doubanio.com\/f\/movie\/5081e011b4b06f1a8c3735122b38e781bd852ab6\/pics\/movie\/movie_default_medium.png", title: "\u5973\u6559\u5e2b\u3000\u8997\u304b\u308c\u305f\u66b4\u884c\u73fe\u5834\u200e (1980)", rating_nums: 0, attr: "\u65e5\u672c\/60\u5206\u949f", actors: "\u4e95\u7b52\u548c\u5e78\/\u6e2f\u307e\u3086\u307f\/\u6ca2\u6728\u30df\u30df\/\u9752\u91ce\u68a8\u9ebb\/\u4e0b\u5143\u53f2\u90ce\/\u4eca\u6cc9\u6d0b" }, { link: "https:\/\/movie.douban.com\/subject\/1295452\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p946721980.webp", title: "\u5b50\u5f39\u6a2a\u98de\u767e\u8001\u6c47 Bullets Over Broadway\u200e (1994)[\u53ef\u64ad\u653e]", rating_nums: 8.4, attr: "\u7f8e\u56fd\/\u559c\u5267\/\u72af\u7f6a\/\u5b50\u5f39\u7a7f\u8fc7\u767e\u8001\u6c47\/\u767e\u8001\u6c47\u4e0a\u7a7a\u7684\u5b50\u5f39\/98\u5206\u949f", actors: "\u4f0d\u8fea\u00b7\u827e\u4f26\/\u7ea6\u7ff0\u00b7\u5e93\u8428\u514b\/\u9edb\u5b89\u00b7\u97e6\u65af\u7279\/\u8a79\u59ae\u5f17\u00b7\u63d0\u8389\/\u67e5\u5179\u00b7\u5e15\u5c14\u660e\u7279\u745e\/\u739b\u4e3d-\u9732\u6613\u4e1d\u00b7\u5e15\u514b\/\u6770\u514b\u00b7\u74e6\u5c14\u767b\/\u4e54\u00b7\u7ef4\u7279\u96f7\u5229\/\u7f57\u4f2f\u00b7\u83b1\u7eb3" }, { link: "https:\/\/movie.douban.com\/subject\/26962641\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2417926976.webp", title: "\u5b50\u5f39\u6a2a\u98de Stray Bullets\u200e (2016)", rating_nums: 5, attr: "\u7f8e\u56fd\/\u5267\u60c5\/\u72af\u7f6a\/\u60ca\u609a\/83\u5206\u949f", actors: "Jack Fessenden\/\u8a79\u59c6\u65af\u00b7\u52d2\u683c\u7f57\/John Speredakos\/\u62c9\u745e\u00b7\u51e1\u65af\u767b" }, { link: "https:\/\/movie.douban.com\/subject\/4826414\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p757889755.webp", title: "\u963f\u739b\u8fea\u7f57 Armadillo\u200e (2010)", rating_nums: 7.4, attr: "\u4e39\u9ea6\/\u7eaa\u5f55\u7247\/\u6218\u4e89\/\u5b50\u5f39\u6a2a\u98de\u7ef4\u548c\u8def(\u6e2f)\/\u963f\u66fc\u8fea\u6d1b\/100\u5206\u949f", actors: "\u626c\u52aa\u65af\u00b7\u6885\u5179\/\u4e39\u9ea6\u58eb\u5175" }, { link: "https:\/\/movie.douban.com\/subject\/5069843\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2495211278.webp", title: "\u8d85\u4eba\uff1a\u5b50\u5f39\u98de\u8f66 The Bulleteers\u200e (1942)", rating_nums: 0, attr: "\u7f8e\u56fd\/\u52a8\u753b\/\u77ed\u7247\/\u52a8\u4f5c\/\u5947\u5e7b\/\u79d1\u5e7b\/\u8d85\u4eba1941\u72485\/8\u5206\u949f", actors: "Dave Fleischer" }, { link: "https:\/\/movie.douban.com\/subject\/34815488\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2567928760.webp", title: "\u5b50\u5f39\u671d\u6211\u98de\u6765 Enai Noki Paayum Thota\u200e (2019)", rating_nums: 0, attr: "\u5370\u5ea6\/\u5267\u60c5\/\u52a8\u4f5c\/\u60ca\u609a\/TheBulletSpeedingTowardsMe", actors: "Goutham Vasudev Menon\/Dhanush\/Megha Akash" }, { link: "https:\/\/movie.douban.com\/subject\/3194406\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2873557126.webp", title: "\u8ba9\u9e3d\u5b50\u98de\u7fd4\u7684\u5973\u4eba A Mulher Que P\u00f5e a Pomba no Ar\u200e (1978)", rating_nums: 0, attr: "\u5df4\u897f\/\u5947\u5e7b\/TheWomanWhoMakesDovesFly", actors: "Ros\u00e2ngela Maldonado\/Jos\u00e9 Mojica Marins" }, { link: "https:\/\/movie.douban.com\/subject\/26801820\/", cover_image_url: "https:\/\/img9.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2355612428.webp", title: "\u9a91\u4e0a\u5b50\u5f39\u98de\u200e (2016)", rating_nums: 0, attr: "\u97e9\u56fd\/\u4e2d\u56fd\u5927\u9646\/\u5267\u60c5\/\u513f\u7ae5\/\u559c\u5267\/\u5bb6\u5ead\/\u9a91\u4e0a\u5b50\u5f39\u98de\/108\u5206\u949f", actors: "\u91d1\u7532\u6bc5\uff08\u97e9\uff09" }] }
        // setWebSearchData(dataa.data)
        // return
        loading.show("搜索中...")
        videoWebSearchApi_2({ video_name: v }).then((res: any) => {
            setWebSearchData(res.data)
            loading.hide();
        }).catch(() => {
            loading.hide();
        })
    }
    const hideWebSearchModal = () => {
        setWebSearchData(null)
    }
    const selectWebSearch = (v) => {
        setWebSearchData(null)
        let tempTypeArr1 = cTypeArr.filter((v1) => `${v1.id}` == `${v.cid}`)[0]?.video_type || [];
        form.setFieldsValue({ cid: v.cid || null })
        setSelectCid(v.cid || null)
        for (const key in v) {
            const element = v[key]
            switch (key) {
                case 'pic':
                    setVerImgUrl(element || '');
                    break;
                case 'level_pic':
                    setHorImgUrl(element || '');
                    break;
                case 'alias':
                    setAlias(element || []);
                    break;
                case 'area':
                    if (element && element.length > 0) {
                        const areaStrArr = element.split('/')
                        const area_id = opValToId(areaArr, areaStrArr[0].trim())
                        form.setFieldsValue({ area: area_id })
                    }
                    break;
                case 'director':
                    if (element && element.length > 0) {
                        const arr = []
                        const selectArr = []
                        element.forEach((el) => {
                            arr.push({ key: el.id, label: el.name, value: el.id })
                            selectArr.push(el.id)
                        });
                        setDirectorValue(arr)
                        setDirectorSelect(selectArr)
                    }
                    break;
                case 'starring':
                    if (element && element.length > 0) {
                        const arr2 = []
                        const selectArr2 = []
                        element.forEach((el) => {
                            arr2.push({ key: el.id, label: el.name, value: el.id })
                            selectArr2.push(el.id)
                        });
                        setActorValue(arr2)
                        setActorSelect(selectArr2)
                    }
                    break;
                case 'cid':
                    // form.setFieldsValue({ [key]: element })
                    // setSelectCid(element)
                    break;
                case 'type':
                    if (element && element.length > 0) {
                        const typeArr1 = element.split(',').map((v) => opValToId(tempTypeArr1, v)).filter((v) => !!v)
                        form.setFieldsValue({ [key]: typeArr1 || null })
                    }
                    break;
                case 'year':
                    const year_id = opValToId(yearArr, element)
                    form.setFieldsValue({ year: year_id || null })
                    break;
                default:
                    form.setFieldsValue({ [key]: element || null })
            }
        }
    }

    const onCancel = () => {
        setHorImgUrl(params?.level_pic || '');
        setVerImgUrl(params?.pic || '');
        setTags(tagArr);
        setAlias(aliasArr);
        setSelectCid(tempSelectCid);
        setTypeArr(tempTypeArr);
        setRelationValue(params?.series_id ? { value: params.series_id, label: params.series_name, key: params.series_id } : null)
        initStar()
        form.resetFields();
    }

    const onFinish = (v: any) => {
        loading.show("请求中...");
        const data = {
            name: v.name,
            pic: isVerImgUrl,
            level_pic: isHorImgUrl,
            cid: v.cid,
            tags: tags.join(','),
            type: v.type.join(','),
            alias: alias,
            area: v.area,
            year: v.year,
            introduction: v.introduction || '',
            present: v.present || '',
            basic_score: v.basic_score,
            total: v.total,
            section: v.section,
            videomode: v.serial,
            series_id: v.relation ? v.relation.value : '',
            stars: actorValue.map((v) => ({ id: Number.isNaN(Number(v.value)) ? null : Number(v.value), name: v.label })),
            directors: directorValue.map((v) => ({ id: Number.isNaN(Number(v.value)) ? null : Number(v.value), name: v.label }))
        }
        if (isEdit) {
            postVideoEditApi_2(params.id, data).then((res: any) => {
                message.success('修改成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        } else {
            postVideoAddApi_2(data).then((res: any) => {
                message.success('添加成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        }
    }

    useEffect(() => {
        const tagNode = renderTag();
        const aliasNode = renderAlias();
        setTagsNode(tagNode);
        setAliasNode(aliasNode);
    }, [tags, alias]);

    useEffect(() => {
        if (selectCid) {
            setTypeArr(cTypeArr.filter((v) => v.id == selectCid)[0]?.video_type || []);
        }
    }, [selectCid]);

    useEffect(() => {
        initStar()
    }, []);

    return (
        <>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form} preserve={false}>
                <Space style={{ width: '100%' }} direction="vertical">
                    <Row>
                        <Col span={24}>
                            <Card bodyStyle={{ padding: 18 }}>
                                <Row justify="space-between">
                                    <Col>
                                        <Title level={5} style={{ margin: 0, padding: '4px 0' }}>{title}</Title>
                                    </Col>
                                    <Col>
                                        <Space>
                                            <Form.Item style={{ margin: 0 }}>
                                                <Button type="primary" danger htmlType="submit">保存</Button>
                                            </Form.Item>
                                            <Form.Item style={{ margin: 0 }}>
                                                <Button htmlType="button" onClick={onCancel}>重置</Button>
                                            </Form.Item>
                                            <Form.Item style={{ margin: 0 }}>
                                                <Button type="primary" onClick={onBack}>返回</Button>
                                            </Form.Item>
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[12, 30]}>
                        <Col span={6}>
                            <Card style={{ height: '100%' }}>
                                <Space direction="vertical" align="center" size={[12, 50]} style={{ width: '100%' }}>
                                    <Button type="primary" onClick={onShowModal}>上传</Button>
                                    <div className="cover-wrp ver">
                                        {imgBox('竖屏封面', isVerImgUrl)}
                                    </div>
                                    <div className="cover-wrp hor">
                                        {imgBox('横屏封面', isHorImgUrl)}
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={18}>
                            <Card>
                                <Form.Item label="视频名称" name="name" rules={[{ required: true, message: '请输入视频名称!' }]} initialValue={params.name}>
                                    {/* <Input /> */}
                                    <Search onSearch={onSearch} allowClear />
                                </Form.Item>
                                <Form.Item label="视频简介" name="introduction" rules={[{ required: true, message: '请输入视频简介!' }]} initialValue={params.introduction}>
                                    <Input allowClear />
                                </Form.Item>
                                <Form.Item label="视频介绍" name="present" initialValue={params.present}>
                                    <Input allowClear />
                                </Form.Item>
                                <Form.Item label="视频主演" name="leadAt">
                                    <Row justify="space-between">
                                        <Col flex="auto">
                                            <Select allowClear mode="multiple" value={actorSelect} options={actorValue} onChange={onActorChange} />
                                        </Col>
                                        <Col>
                                            <Button type="link" onClick={onAddActorModal}>添加</Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item label="视频导演" name="director">
                                    <Row justify="space-between">
                                        <Col flex="auto">
                                            <Select allowClear mode="multiple" value={directorSelect} options={directorValue} onChange={onDirectorChange} />
                                        </Col>
                                        <Col>
                                            <Button type="link" onClick={onAddDirectorModal}>添加</Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item label="关联系列" name="relation" initialValue={params?.series_id ? { value: params.series_id, label: params.series_name, key: params.series_id } : null}>
                                    <DebounceSelect
                                        showSearch
                                        allowClear
                                        autoClearSearchValue
                                        value={relationValue}
                                        fetchOptions={fetchRelationList}
                                        onChange={(newValue) => { setRelationValue(newValue) }}
                                        style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="视频分类" name="cid" rules={[{ required: true, message: '请选择视频分类!' }]} initialValue={Number(params.cid) || null}>
                                    <Select style={{ width: 100 }} placeholder="视频分类" onChange={onClassifyChange}>
                                        {
                                            classifyArr.map((status) => (
                                                <Select.Option value={status.id} key={status.value}>
                                                    {status.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="视频类型"
                                    name="type"
                                    initialValue={params && params.type ? params.type.split(',').map((v) => opValToId(tempTypeArr, v)).filter((v) => !!v) : []}>
                                    <Select placeholder="视频类型" mode="multiple">
                                        {
                                            typeArr.map((status) => (
                                                <Select.Option value={status.id} key={status.value}>
                                                    {status.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="地区" name="area" initialValue={Number(params.area_id) || null}>
                                    <Select style={{ width: 100 }} placeholder="地区">
                                        {
                                            areaArr.map((status) => (
                                                <Select.Option value={status.id} key={status.value}>
                                                    {status.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="年份" name="year" initialValue={Number(params.year_id) || null}>
                                    <Select style={{ width: 100 }} placeholder="年份">
                                        {
                                            yearArr.map((status) => (
                                                <Select.Option value={status.id} key={status.value}>
                                                    {status.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item label="总数">
                                    <Form.Item
                                        name="total"
                                        initialValue={params.total || null}
                                        rules={[{ required: false, message: '请输入视频总数!' }]}
                                        style={{ display: 'inline-block', width: 100, margin: 0 }}>
                                        <Input type="number" min={1} />
                                    </Form.Item>
                                    <Form.Item
                                        name="section"
                                        initialValue={Number(params.section) || null}
                                        rules={[{ required: false, message: '请选择总数类型!' }]}
                                        style={{ display: 'inline-block', width: 80, margin: '0 10px' }}>
                                        <Select placeholder="">
                                            {
                                                videoEpOp.map((status) => (
                                                    <Select.Option value={status.id} key={status.value}>
                                                        {status.value}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Form.Item>
                                <Form.Item label="基础评分" name="basic_score" initialValue={Number(`${params.basic_score}`) || null} rules={[scoreRule]}>
                                    <Input style={{ width: 120 }} placeholder="1到10分" />
                                </Form.Item>
                                <Form.Item label="搜索关键字" name="keyName" rules={[keyNameRule]} initialValue="">
                                    <Space>
                                        <Input style={{ width: 250 }} value={inputTag} onChange={onInputTag} allowClear />
                                        <Button type="link" onClick={onAddTag}>添加</Button>
                                    </Space>
                                </Form.Item>
                                <Row>
                                    <Col offset={4}>{tagsNode}</Col>
                                </Row>
                                <Form.Item label="视频别名" name="alias" initialValue="">
                                    <Space>
                                        <Input style={{ width: 250 }} value={inputAlias} onChange={onInputAlias} allowClear />
                                        <Button type="link" onClick={onAddAlias}>添加</Button>
                                    </Space>
                                </Form.Item>
                                <Row>
                                    <Col offset={4}>{aliasNode}</Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Space>
            </Form>
            {
                showModal
                && (
                    <UploadPosterModal
                        horImgUrl={isHorImgUrl}
                        verImgUrl={isVerImgUrl}
                        onHide={onHideModal}
                        onOk={onConfirm} />
                )
            }
            {
                showAddModal
                && <AddStarModal {...addModalProp} />
            }
            {
                showEditStarModal
                && <EditStarModal {...editStarModalProp} />
            }
            {
                webSearchData
                && <WebSearchModal dataSource={webSearchData} onHide={hideWebSearchModal} onOk={selectWebSearch} />
            }
        </>
    )
}
