import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Collapse, Pagination, Popconfirm, Row, Tooltip } from 'antd';
import './HistoryOrder.scss';
import { CaretRightOutlined, CarOutlined, HourglassOutlined, MessageOutlined, ShoppingOutlined, WarningOutlined } from '@ant-design/icons';
import { getStatusOrder, getStatusOrderClassName, numberWithCommas } from 'assets/admin';
import moment from 'moment';
import ButtonCustom from 'components/ButtonCustom';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_my_orders, savePagination } from 'pages/User/userSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { donhangApi } from 'api/donhangApi';
HistoryOrder.propTypes = {

};

function HistoryOrder(props) {
    const { myOrders } = props;
    const { pagination: { myOrders: pagination }, data: { statisticalMyOrders } } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();

    const handleOrder = async (MA_DH, isReceived) => {
        try {
            const data = isReceived ? { action: 'received' } : { action: 'cancle' }
            const { message } = await donhangApi.update(MA_DH, data);
            dispatch(fetch_my_orders({ action: 'get_my_orders', _limit: pagination._limit, _page: pagination._page }));
            toast.success(message);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log({ error })
        }
    }

    return (
        <div>
            <Row justify='center'>
                <Col xs={24} sm={20} md={20} lg={20}>
                    <div className="current-orders">
                        <Row justify='center'>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className='statistical'>
                                    <HourglassOutlined />
                                    <div className='statistical-text'>Chờ xử lý ({statisticalMyOrders[0]})</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className='statistical'>
                                    <CarOutlined />
                                    <div className='statistical-text'>Đang vận chuyển ({statisticalMyOrders[1]})</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className='statistical'>
                                    <ShoppingOutlined />
                                    <div className='statistical-text'>Đã giao ({statisticalMyOrders[2]})</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6}>
                                <div className='statistical'>
                                    <WarningOutlined />
                                    <div className='statistical-text'>Đã hủy ({statisticalMyOrders[3]})</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <ul className="history-bought">
                        <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
                            {
                                myOrders?.map((order, idx) =>
                                    <Collapse.Panel header={`Đơn hàng: ${order.MA_DH}`} key={idx} extra={<span className={getStatusOrderClassName(order.TRANG_THAI)}>{getStatusOrder(order.TRANG_THAI)}</span>}>
                                        <li className='history-bought__item'>
                                            <div className='history-bought__item__body'>
                                                <Row gutter={[40, 0]}>
                                                    <Col xs={24} sm={12}>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Họ tên người đặt </span><span className='category-label-value'>{order.HO_TEN_NGUOI_DAT}</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Số điện thoại</span><span className='category-label-value'>{order.SDT_NGUOI_DAT}</span>
                                                        </div>

                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>{order.MA_UU_DAI ? `${order.TEN_UU_DAI} (${order.MA_UU_DAI})` : 'Không áp dụng'}</span>
                                                        </div>

                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Hình thức thanh toán</span><span className='category-label-value'>{order.HINH_THUC_THANH_TOAN}</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Trạng thái thanh toán</span><span className='category-label-value'>{order.DA_THANH_TOAN === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Ghi chú</span><span className='category-label-value'>{order.GHI_CHU || '...'}</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Địa chỉ</span><span className='category-label-value'>{order.DIA_CHI}</span>
                                                        </div>
                                                    </Col>
                                                    <Col xs={24} sm={12}>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>{moment(order.TG_DAT_HANG).format('DD-MM-YYYY')}</span>
                                                        </div>
                                                        {
                                                            order.TRANG_THAI > 0 &&
                                                            <div className='category-label'>
                                                                <span className='category-label-key'>{order.TRANG_THAI === 3 ? 'Thời gian hủy đơn' : 'Ngày giao hàng'} {order.TRANG_THAI == 1 ? '(dự kiến)' : ''}</span><span className='category-label-value'>{moment(order.TRANG_THAI === 3 ? order.CAP_NHAT : order.TG_GIAO_HANG).format('DD-MM-YYYY')}</span>
                                                            </div>
                                                        }
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>{order.DON_VI_VAN_CHUYEN}</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Phí vận chuyển </span><span className='category-label-value'>{numberWithCommas(order.PHI_SHIP)} ₫</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Tổng tiền hàng</span><span className='category-label-value'>{numberWithCommas(order.TONG_TIEN)} ₫</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Tổng tiền</span><span className='category-label-value'>{numberWithCommas(order.TONG_TIEN + order.PHI_SHIP)} ₫</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Giảm giá </span><span className='category-label-value'>{numberWithCommas(order.GIAM_GIA)}&nbsp;₫</span>
                                                        </div>
                                                        <div className='category-label'>
                                                            <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value' style={{ fontSize: 20 }}>{numberWithCommas(order.TONG_TIEN + order.PHI_SHIP - order.GIAM_GIA)} ₫</strong>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
                                                    <Collapse.Panel header="Chi tiết sản phẩm" key={order.MA_DH}>
                                                        <ul className='list-products'>
                                                            {
                                                                order.SAN_PHAM?.map((sp, idx) =>
                                                                    <li key={sp.MA_SP}>
                                                                        <img src={sp.HINH_ANH} />
                                                                        <a href='' className='name'>{sp.TEN_SP}</a>
                                                                        <span>x {sp.SO_LUONG}</span>
                                                                        <span>{numberWithCommas(sp.GIA)}&nbsp;₫</span>
                                                                        {
                                                                            order.TRANG_THAI === 3 &&
                                                                            <Link to={`/products/${sp.MA_SP}`} state={{ feedbackFromOrder: true }}>
                                                                                <Tooltip title="Đánh giá sản phẩm này.">
                                                                                    <MessageOutlined />
                                                                                </Tooltip>
                                                                            </Link>
                                                                        }
                                                                    </li>)
                                                            }
                                                        </ul>
                                                    </Collapse.Panel>
                                                </Collapse>
                                            </div>
                                            <div className='history-bought__item__footer'>
                                                {
                                                    order.TRANG_THAI === 0 &&
                                                    <Popconfirm title="Bạn muốn hủy đơn hàng này ?" onConfirm={() => handleOrder(order.MA_DH, false)}>
                                                        <ButtonCustom className="btn-danger-custom" >Hủy đơn hàng</ButtonCustom>
                                                    </Popconfirm>
                                                }
                                                {

                                                    order.TRANG_THAI === 1 &&
                                                    <Popconfirm title="Xác nhận rằng bạn đã nhận được hàng ?" onConfirm={() => handleOrder(order.MA_DH, true)}>
                                                        <ButtonCustom >Đã nhận được hàng ?</ButtonCustom>
                                                    </Popconfirm>
                                                }
                                            </div>
                                        </li>
                                    </Collapse.Panel>
                                )
                            }
                        </Collapse>


                    </ul>
                    <br />
                    <Pagination onChange={(_page) => dispatch(savePagination({ screen: 'myOrders', _page, _totalPage: pagination._totalPage }))}
                        current={pagination._page} total={pagination._totalPage} pageSize={1} />
                </Col>
            </Row>
        </div>
    );
}

export default HistoryOrder;