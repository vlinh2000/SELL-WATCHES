import { StarFilled } from '@ant-design/icons';
import { Alert, Col, Form, Pagination, Rate, Row, Tabs } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import SortBy from 'components/SortBy';
import InputField from 'custom-fields/InputField';
import { Link, useLocation, useParams } from 'react-router-dom';
import FeedBackList from '../FeedBackList';
import './GroupInfoAndFeedBack.scss';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { switch_screenLogin } from 'pages/User/userSlice';
import { danhgiaApi } from 'api/danhgiaApi';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import InputEmoijField from 'custom-fields/InputEmoijField';


GroupInfoAndFeedBack.propTypes = {
    product: PropTypes.object,
    feedBackAvailable: PropTypes.bool,
};

GroupInfoAndFeedBack.defaultProps = {
    product: {},
    feedBackAvailable: false,
};

function GroupInfoAndFeedBack(props) {
    const { idProduct } = useParams();
    const { product, feedBackAvailable } = props;
    const dispatch = useDispatch();
    const { user, isAuth } = useSelector(state => state.auth);
    const { state } = useLocation();

    const onChange = (key) => {
        console.log(key);
    };

    const [form] = Form.useForm();
    const initialValues = {
        SO_SAO: null, NOI_DUNG: ''
    }

    const [feedBackList, setFeedBackList] = React.useState();
    const [mediumScoreOfFeedBack, setMediumScoreOfFeedBack] = React.useState(0);
    const [groupByFeedBackByNumStar, setGroupByFeedBackByNumStar] = React.useState([]);
    const [reloadFeedBackList, setReloadFeedBackList] = React.useState(false);
    const [pagination, setPagination] = React.useState({ _limit: 8, _page: 1, _totalPage: 3, _totalRecord: 0 });
    const [loading, setLoading] = React.useState({});
    const [sortBy, setSortBy] = React.useState('NGAY_TAO DESC');
    const defaultActiveKey = useMemo(() => state?.feedbackFromOrder ? "3" : "1", [state?.feedbackFromOrder])

    React.useEffect(() => {
        const fetchFeedBackList = async () => {
            try {
                setLoading(prev => ({ ...prev, feedBackList: true }));
                const { result, totalRecord } = await danhgiaApi.getAll({ _page: pagination._page, _limit: pagination._limit, MA_SP: idProduct, sortBy });
                setFeedBackList(result)
                setPagination(prev => ({ ...prev, _totalPage: Math.ceil(totalRecord / pagination._limit), _totalRecord: totalRecord }))
                setLoading(prev => ({ ...prev, feedBackList: false }));
            } catch (error) {
                setLoading(prev => ({ ...prev, feedBackList: false }));
                console.log({ error })
            }
        }

        fetchFeedBackList();
    }, [idProduct, reloadFeedBackList, pagination._page, pagination._limit, sortBy])

    React.useEffect(() => {
        const fetchGroupFeedBackByNumStar = async () => {
            try {
                const { result } = await danhgiaApi.getAll({ MA_SP: idProduct, action: 'groupByFeedBackByNumStar' });
                const totalRows = result.reduce((a, b) => a + b.TONG_SO, 0);
                setMediumScoreOfFeedBack(parseFloat(result.reduce((a, b) => a + b.TONG_DIEM, 0) / totalRows).toFixed(1));
                const groupByNumStarList = new Array(5).fill(0);
                result.forEach(fb => {
                    groupByNumStarList[fb.SO_SAO - 1] = fb.TONG_SO;
                });
                console.log({ groupByNumStarList })
                setGroupByFeedBackByNumStar(groupByNumStarList?.map(num => parseFloat((num / totalRows) * 100).toFixed(0) + '%').reverse());
            } catch (error) {
                console.log({ error })
            }
        }

        fetchGroupFeedBackByNumStar();
    }, [idProduct, reloadFeedBackList, pagination._totalRecord])

    const handleFeedBack = async (values) => {
        try {
            setLoading(prev => ({ ...prev, sendFeedBack: true }));
            const { message } = await danhgiaApi.post({ SO_SAO: values.SO_SAO, NOI_DUNG: values.NOI_DUNG, MA_SP: product.MA_SP });
            toast.success(message)
            form.resetFields();
            setReloadFeedBackList(prev => !prev);
            setLoading(prev => ({ ...prev, sendFeedBack: false }));
        } catch (error) {
            setLoading(prev => ({ ...prev, sendFeedBack: false }));
            toast.error(error.response.data.message);
        }
    }

    const onReFreshFeedBackList = () => {
        setReloadFeedBackList(prev => !prev);
    }

    return (
        <div className='group-info-and-feedback'>
            <Tabs defaultActiveKey={defaultActiveKey} onChange={onChange}>
                <Tabs.TabPane tab="Thông tin bổ sung & Chính sách bảo hành" key="1">
                    <Row justify='space-between'>
                        <Col xs={24} sm={24} md={24} lg={11}>
                            <ul className="group-info">
                                {
                                    product.MA_LOAI_SP !== 'LSP_phukien' &&
                                    <>
                                        <li className="group-info-item">
                                            <span className='info-name'>bộ máy & năng lượng</span>
                                            <span className='info-value'>{product.PIN}</span>
                                        </li>

                                        <li className="group-info-item">
                                            <span className='info-name'>CHẤT LIỆU MẶT KÍNH</span>
                                            <span className='info-value'>{product.CHAT_LIEU_MAT_KINH}</span>
                                        </li>

                                        <li className="group-info-item">
                                            <span className='info-name'>HÌNH DẠNG MẶT SỐ</span>
                                            <span className='info-value'>{product.HINH_DANG_MAT_SO}</span>
                                        </li>
                                        <li className="group-info-item">
                                            <span className='info-name'>KÍCH THƯỚC MẶT SỐ</span>
                                            <span className='info-value'>{product.KICH_THUOC_MAT_SO}</span>
                                        </li>
                                        <li className="group-info-item">
                                            <span className='info-name'>MÀU MẶT SỐ</span>
                                            <span className='info-value'>{product.MAU_MAT_SO}</span>
                                        </li>
                                        <li className="group-info-item">
                                            <span className='info-name'>MỨC CHỐNG NƯỚC</span>
                                            <span className='info-value'>{product.MUC_CHONG_NUOC}</span>
                                        </li>
                                    </>
                                }
                                <li className="group-info-item">
                                    <span className='info-name'>LOẠI SẢN PHẨM</span>
                                    <span className='info-value'>{product.TEN_LOAI_SP}</span>
                                </li>
                                {
                                    product.CHAT_LIEU_DAY &&
                                    <li className="group-info-item">
                                        <span className='info-name'>CHẤT LIỆU DÂY</span>
                                        <span className='info-value'>{product.CHAT_LIEU_DAY}</span>
                                    </li>

                                }
                                <li className="group-info-item">
                                    <span className='info-name'>THƯƠNG HIỆU</span>
                                    <span className='info-value'>{product.TEN_THUONG_HIEU}</span>
                                </li>
                                <li className="group-info-item">
                                    <span className='info-name'>XUẤT XỨ</span>
                                    <span className='info-value'>{product.QUOC_GIA}</span>
                                </li>

                            </ul>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12}>
                            <p className='category-name'>Chính sách bảo hành của riêng mỗi hãng:</p>
                            <ul className='list-info'>

                                <li>
                                    CASIO: Bảo hành chính hãng máy 1 năm, pin 1,5 năm</li>
                                <li>
                                    CITIZEN: Bảo hành chính hãng toàn cầu máy 1 năm, pin 1 năm
                                </li>

                                <li>
                                    SEIKO: Bảo hành chính hãng toàn cầu máy 1 năm, pin 1 năm
                                </li>
                                <li>
                                    ORIENT: Bảo hành chính hãng toàn cầu máy 1 năm, pin 1 năm
                                </li>
                                <li>
                                    OP: Bảo hành chính hãng máy 2 năm, pin 1 năm
                                </li>
                                <li>
                                    RHYTHM: Bảo hành chính hãng máy 1 năm, pin 1 năm
                                </li>
                                <li>
                                    OGIVAL: Bảo hành chính hãng máy 2 năm, pin 1 năm
                                </li>
                                <li>
                                    ELLE: Bảo hành chính hãng máy 2 năm, pin 2 năm
                                </li>
                                <li>
                                    TISSOT: Bảo hành chính hãng máy 2 năm, pin 1 năm
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab={`Đánh giá (${pagination._totalRecord || 0})`} key="2">
                    {
                        feedBackList?.length < 1 ?
                            <Alert
                                message="Chưa có đánh giá về sản phẩm này."
                                type="info"
                                showIcon
                            />
                            :
                            <div className="feedback-wrapper">
                                <div className="total-feedback-wrapper">
                                    <div className='total-feedback'><span className='total-score'>~{parseFloat(Math.ceil(mediumScoreOfFeedBack)).toFixed(1)}</span> <Rate disabled value={Math.ceil(mediumScoreOfFeedBack)} /></div>
                                    {
                                        groupByFeedBackByNumStar?.map((num, idx) =>
                                            <div key={idx} className='feedback-item-vote'><span className='num-star'>{5 - idx}</span> <StarFilled /> <span className='range-vote'><span className="percent" style={{ width: num }}></span></span> <span className='percent-vote'>{num}</span></div>
                                        )
                                    }
                                </div>
                                <div className='feedback-list-wrapper'>
                                    <Form
                                        onValuesChange={(values) => setSortBy(values.sortBy)}
                                        initialValues={{ sortBy: 'NGAY_TAO DESC' }}>
                                        <SortBy
                                            style={{ width: 150 }}
                                            label="Sắp xếp theo"
                                            name="sortBy"
                                            options={[
                                                { label: 'Mới nhất', value: 'NGAY_TAO DESC', },
                                                { label: 'Cũ nhất', value: 'NGAY_TAO ASC', },
                                                { label: 'Đánh giá cao', value: 'SO_SAO DESC', },
                                                { label: 'Đánh giá thấp', value: 'SO_SAO ASC', },
                                            ]} />
                                    </Form>
                                    <FeedBackList feedBackAvailable={feedBackAvailable} onReFreshFeedBackList={onReFreshFeedBackList} feedBackList={feedBackList} isLoading={loading?.feedBackList} />
                                    <Pagination onChange={(_page) => setPagination(prev => ({ ...prev, _page }))} current={pagination._page} total={pagination._totalPage} pageSize={1} />
                                </div>
                            </div>
                    }
                </Tabs.TabPane>
                {
                    user?.USER_ID &&
                    <Tabs.TabPane tab="Viết đánh giá" key="3">
                        <div className="feedback-wrapper">
                            <div className='my-feedback'>
                                {
                                    isAuth ?
                                        (
                                            feedBackAvailable ?
                                                <Form
                                                    onFinish={handleFeedBack}
                                                    form={form} initialValues={initialValues} className="form-feedback" layout='vertical'>
                                                    <div className="vote">
                                                        <label className='label'>Đánh giá của bạn</label>
                                                        <Form.Item
                                                            rules={[{ required: true, message: "Số sao không được để trống." }]}
                                                            name="SO_SAO">
                                                            <Rate count={5} />
                                                        </Form.Item>
                                                    </div>
                                                    <div className="comments">
                                                        {/* <InputEmoijField
                                                            rules={[{ required: true, message: "Nội dung không được để trống." }]} name="NOI_DUNG" label="Nhận xét của bạn" placeHolder='-- Nhập nhận xét của bạn --'
                                                        /> */}
                                                        <InputField
                                                            type='textarea'
                                                            rows={5}
                                                            rules={[{ required: true, message: "Nội dung không được để trống." }]} name="NOI_DUNG" label="Nhận xét của bạn" placeHolder='-- Nhập nhận xét của bạn --'
                                                        />
                                                    </div>
                                                    <br />
                                                    <ButtonCustom type='submit' isLoading={loading?.sendFeedBack} >Gửi đánh giá</ButtonCustom>
                                                </Form>
                                                :
                                                <i>Chỉ những khách hàng đã mua sản phẩm mới có thể đánh giá.</i>

                                        )

                                        :
                                        <p>Vui lòng <Link to="" onClick={() => dispatch(switch_screenLogin(true))}>đăng nhập</Link> để đánh giá</p>
                                }
                            </div>
                        </div>
                    </Tabs.TabPane>
                }

            </Tabs>
        </div >
    );
}

export default GroupInfoAndFeedBack;