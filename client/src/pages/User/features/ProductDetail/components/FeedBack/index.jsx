import React from 'react';
import PropTypes from 'prop-types';
import './FeedBack.scss';
import { CheckCircleOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Divider, Form, Rate, Tooltip } from 'antd';
import moment from 'moment';
import InputField from 'custom-fields/InputField';
import ButtonCustom from 'components/ButtonCustom';
import { phanhoiApi } from 'api/phanhoiApi';
import toast from 'react-hot-toast';

FeedBack.propTypes = {
    feedBack: PropTypes.object
};

FeedBack.defaultProps = {
    feedBack: {}
};



function FeedBack(props) {
    const { feedBack } = props;

    const [loading, setLoading] = React.useState(false);
    const [reloadResponseList, setReloadResponseList] = React.useState(false);
    const [sendResponse, setSendResponse] = React.useState({ id: null, isSend: false, PHAN_HOI_TOI: '' });
    const [responsList, setResponsList] = React.useState([]);
    const [form] = Form.useForm();

    React.useEffect(() => {
        const fetchResponseOfFeedBack = async () => {
            try {
                const { result, totalRecord } = await phanhoiApi.getAll({ MA_DG: feedBack.MA_DG });
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


    return (
        <li className='feedback'>
            <Comment
                actions={[
                    <span >
                        {/* <MessageOutlined /> */}
                        <span onClick={() => setSendResponse(prev => ({ id: feedBack.MA_DG, isSend: true, PHAN_HOI_TOI: null }))} key="comment-basic-reply-to">Phản hồi</span>
                    </span>
                ]}
                author={<h3>{feedBack.HO_TEN || feedBack.NV_HO_TEN}</h3>}
                avatar={<Avatar src={feedBack.ANH_DAI_DIEN || feedBack.NV_ANH_DAI_DIEN || ''} alt="avatar">{(feedBack.ANH_DAI_DIEN || feedBack.NV_ANH_DAI_DIEN) ? '' : feedBack.HO_TEN?.charAt(0)?.toUpperCase() || feedBack.NV_HO_TEN?.charAt(0)?.toUpperCase()}</Avatar>}
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
                    responsList?.map((response, idx) =>
                        <Comment
                            key={response.MA_PH}
                            actions={[
                                <span >
                                    <span onClick={() => setSendResponse(prev => ({ id: feedBack.MA_DG, isSend: true, PHAN_HOI_TOI: response.HO_TEN || response.NV_HO_TEN }))} key="comment-basic-reply-to">{(sendResponse.isSendSub && sendResponse.idSub === response.MA_PH) ? 'Đóng phản hồi' : 'Phản hồi'}</span>
                                </span>]}
                            author={<h3>{response.HO_TEN || response.NV_HO_TEN}</h3>}
                            avatar={<Avatar src={response.ANH_DAI_DIEN || ''} alt="avatar1">{(response.ANH_DAI_DIEN || response.NV_ANH_DAI_DIEN) ? '' : response.HO_TEN?.charAt(0)?.toUpperCase() || response.NV_HO_TEN?.charAt(0)?.toUpperCase()}</Avatar>}
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

                {
                    sendResponse.id === feedBack.MA_DG && sendResponse.isSend &&
                    <>
                        <Form form={form} onFinish={handleSendResponse}>
                            <InputField name='NOI_DUNG' type='textarea' rows={3} placeHolder="Nhập nội dung phản hồi ..." />
                            <ButtonCustom style={{ display: 'inline', marginRight: 10 }} isLoading={loading} type='submit' text='Gửi phản hồi' />
                            <Button danger onClick={() => setSendResponse(prev => ({ ...prev, isSend: false }))}>Đóng</Button>
                        </Form>
                        <Divider />
                    </>
                }
            </Comment>
        </li>
    );
}

export default FeedBack;