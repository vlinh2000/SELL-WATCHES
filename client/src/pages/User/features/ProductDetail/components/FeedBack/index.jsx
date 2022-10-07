import { CaretRightOutlined, DeleteOutlined, InfoCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Collapse, Comment, Divider, Form, Popconfirm, Rate, Tooltip } from 'antd';
import { phanhoiApi } from 'api/phanhoiApi';
import ButtonCustom from 'components/ButtonCustom';
import InputEmoijField from 'custom-fields/InputEmoijField';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import './FeedBack.scss';

FeedBack.propTypes = {
    feedBack: PropTypes.object,
    onDelete: PropTypes.func,
    feedBackAvailable: PropTypes.bool,
};

FeedBack.defaultProps = {
    feedBack: {},
    feedBackAvailable: false
};

let schema = yup.object().shape({
    NOI_DUNG: yup.string().required('Nội dung không được để trống'),
    // SAN_PHAM: yup.array().min(1, 'Sản phẩm không được để trống.')
});

const yupSync = {
    async validator({ field }, value) {
        await schema.validateSyncAt(field, { [field]: value });
    },
};


function FeedBack(props) {
    const { feedBack, onDelete, feedBackAvailable } = props;
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [reloadResponseList, setReloadResponseList] = React.useState(false);
    const [sendResponse, setSendResponse] = React.useState({ id: null, isSend: false, PHAN_HOI_TOI: '' });
    const [responsList, setResponsList] = React.useState([]);
    const [form] = Form.useForm();

    React.useEffect(() => {
        const fetchResponseOfFeedBack = async () => {
            try {
                const { result } = await phanhoiApi.getAll({ MA_DG: feedBack.MA_DG });
                setResponsList(result)
                console.log({ response: result })
            } catch (error) {
                console.log({ error })
            }
        }

        fetchResponseOfFeedBack();
    }, [feedBack.MA_DG, reloadResponseList])

    const handleSendResponse = async (values) => {
        try {
            setLoading(true);
            const { message } = await phanhoiApi.post({ MA_DG: feedBack.MA_DG, NOI_DUNG: values.NOI_DUNG, PHAN_HOI_TOI: sendResponse.PHAN_HOI_TOI });
            toast.success(message);
            form.resetFields();
            setReloadResponseList(prev => !prev);
            setSendResponse(prev => ({ ...prev, isSend: false }))
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
            console.log({ error })
        }
    }

    const initialValues = {
        NOI_DUNG: ''
    }

    const handleDeleteComment = async (MA_DG) => {
        if (!onDelete) return;
        onDelete(MA_DG);
    }

    return (
        <li className='feedback'>
            <Comment
                actions={[
                    <>
                        {
                            (feedBackAvailable || user?.NV_ID) ?
                                <span>
                                    <span onClick={() => setSendResponse(prev => ({ id: feedBack.MA_DG, isSend: true, PHAN_HOI_TOI: null }))} key="comment-basic-reply-to">Phản hồi</span>
                                </span> : <span><InfoCircleFilled /> Bạn chỉ có thể xem</span>
                        }
                    </>
                    ,
                    <>
                        {
                            (user?.NV_ID || user?.USER_ID === feedBack.USER_ID) ?
                                <Popconfirm title="Bạn có chắc muốn xóa bình luận này ?" onConfirm={() => handleDeleteComment(feedBack.MA_DG)}>
                                    <span style={{ color: 'red' }}>
                                        <DeleteOutlined />
                                        <span key="delete">&nbsp;Xóa</span>
                                    </span>
                                </Popconfirm> : <></>
                        }
                    </>
                ]}
                author={<h3>{feedBack.HO_TEN}</h3>}
                avatar={<Avatar src={feedBack.ANH_DAI_DIEN ? feedBack.ANH_DAI_DIEN : ''} alt="avatar">{feedBack.ANH_DAI_DIEN ? '' : feedBack.HO_TEN?.charAt(0)?.toUpperCase()}</Avatar>}
                content={
                    <>
                        <p>
                            {feedBack.NOI_DUNG}
                        </p>
                        <Rate disabled style={{ fontSize: 14 }} value={feedBack.SO_SAO} />
                    </>
                }
                datetime={
                    <Tooltip title={moment(feedBack.NGAY_TAO).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(feedBack.NGAY_TAO).fromNow()}</span>
                    </Tooltip>
                }>
                {
                    responsList.length > 0 &&
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        className="site-collapse-custom-collapse">
                        <Collapse.Panel header={`Xem tất cả (${responsList.length}) phản hồi`} key={feedBack.MA_DG} className="site-collapse-custom-panel">
                            {
                                responsList?.map((response, idx) =>
                                    <Comment
                                        key={response.MA_PH}
                                        actions={[
                                            <span >
                                                <span onClick={() => setSendResponse(prev => ({ id: feedBack.MA_DG, isSend: true, PHAN_HOI_TOI: response.HO_TEN || response.NV_HO_TEN }))} key="comment-basic-reply-to">{(sendResponse.isSendSub && sendResponse.idSub === response.MA_PH) ? 'Đóng phản hồi' : 'Phản hồi'}</span>
                                            </span>]}
                                        author={<h3>{response.HO_TEN || response.NV_HO_TEN}</h3>}
                                        avatar={<Avatar src={response.ANH_DAI_DIEN ? response.ANH_DAI_DIEN : response.NV_ANH_DAI_DIEN ? response.NV_ANH_DAI_DIEN : ''} alt="avatar1">{(response.ANH_DAI_DIEN || response.NV_ANH_DAI_DIEN) ? '' : response.HO_TEN?.charAt(0)?.toUpperCase() || response.NV_HO_TEN?.charAt(0)?.toUpperCase()}</Avatar>}
                                        content={
                                            <>
                                                <p>
                                                    {response.PHAN_HOI_TOI && <span className='replyTo'>@{response.PHAN_HOI_TOI}</span>} {response.NOI_DUNG}
                                                </p>
                                            </>
                                        }
                                        datetime={
                                            <Tooltip title={moment(response.NGAY_TAO).format('YYYY-MM-DD HH:mm:ss')}>
                                                <span>{moment(response.NGAY_TAO).fromNow()}</span>
                                            </Tooltip>
                                        } >
                                    </Comment>
                                )
                            }

                        </Collapse.Panel>
                    </Collapse>
                }
                {
                    sendResponse.id === feedBack.MA_DG && sendResponse.isSend &&
                    <>
                        <br />
                        <Form form={form} onFinish={handleSendResponse} initialValues={initialValues}>
                            <InputEmoijField rules={[yupSync]} name="NOI_DUNG" placeHolder="Nhập nội dung phản hồi ..." />
                            {/* <InputField name='NOI_DUNG' type='textarea' rows={3} /> */}
                            <ButtonCustom style={{ display: 'inline', marginRight: 10 }} isLoading={loading} type='submit' text='Gửi phản hồi' />
                            <Button danger onClick={() => setSendResponse(prev => ({ ...prev, isSend: false }))}>Đóng</Button>
                        </Form>
                        <Divider />
                    </>
                }
            </Comment>
        </li >
    );
}

export default FeedBack;