import React from 'react';
import PropTypes from 'prop-types';
import { Col, Collapse, Pagination, Row } from 'antd';
import './HistoryOrder.scss';
import { CarOutlined, HourglassOutlined, ShoppingOutlined, WarningOutlined } from '@ant-design/icons';
import { getStatusOrder, numberWithCommas } from 'assets/admin';
import moment from 'moment';
import ButtonCustom from 'components/ButtonCustom';
import { useDispatch, useSelector } from 'react-redux';
import { savePagination } from 'pages/User/userSlice';
HistoryOrder.propTypes = {

};

function HistoryOrder(props) {
    const { myOrders } = props;
    const { pagination: { myOrders: pagination } } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const [statisticalOrders, setStatisticalOrders] = React.useState([0, 0, 0, 0]);


    React.useEffect(() => {
        const groupByStatusList = [0, 0, 0, 0];
        myOrders?.forEach(order => {
            groupByStatusList[order.TRANG_THAI] += 1;
        })
        setStatisticalOrders(groupByStatusList);
    }, [myOrders])



    return (
        <div>
            <Row justify='center'>
                <Col xs={24} sm={20} md={20} lg={20}>
                    <div className="current-orders">
                        <Row justify='center'>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <div className='statistical'>
                                    <HourglassOutlined />
                                    <div className='statistical-text'>Chờ xử lý ({statisticalOrders[0]})</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <div className='statistical'>
                                    <CarOutlined />
                                    <div className='statistical-text'>Đang vận chuyển ({statisticalOrders[1]})</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <div className='statistical'>
                                    <ShoppingOutlined />
                                    <div className='statistical-text'>Đã giao ({statisticalOrders[2]})</div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <div className='statistical'>
                                    <WarningOutlined />
                                    <div className='statistical-text'>Đã hủy ({statisticalOrders[3]})</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <ul className="history-bought">
                        <Collapse>
                            {
                                myOrders?.map((order, idx) =>
                                    <Collapse.Panel header={`Đơn hàng: ${order.MA_DH}`} key={idx} extra={<span className='status-pending'>{getStatusOrder(order.TRANG_THAI)}</span>}>
                                        <li className='history-bought__item'>
                                            <div className='history-bought__item__body'>
                                                <div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Họ tên người đặt </span><span className='category-label-value'>{order.HO_TEN_NGUOI_DAT}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Số điện thoại</span><span className='category-label-value'>{order.SDT_NGUOI_DAT}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>{order.DON_VI_VAN_CHUYEN}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>{order.MA_UU_DAI || 'Không áp dụng'}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Ngày đặt hàng</span><span className='category-label-value'>{moment(order.TG_DAT_HANG).format('DD-MM-YYYY')}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Hình thức thanh toán</span><span className='category-label-value'>{order.HINH_THUC_THANH_TOAN}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Trạng thái thanh toán</span><span className='category-label-value'>{order.DA_THANH_TOAN === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Địa chỉ</span><span className='category-label-value'>{order.DIA_CHI}</span>
                                                    </div>
                                                    <div className='category-label'>
                                                        <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value' style={{ fontSize: 20 }}>{numberWithCommas(order.TONG_TIEN)} ₫</strong>
                                                    </div>
                                                    <br />
                                                </div>
                                                <Collapse>
                                                    <Collapse.Panel header="Chi tiết sản phẩm" key={order.MA_DH}>
                                                        <ul className='list-products'>
                                                            {
                                                                order.SAN_PHAM?.map((sp, idx) =>
                                                                    <li key={sp.MA_SP}>
                                                                        <img src={sp.HINH_ANH} />
                                                                        <a href='' className='name'>{sp.TEN_SP}</a>
                                                                        <span>x {sp.SO_LUONG}</span>
                                                                        <strong>{numberWithCommas(sp.GIA)}&nbsp;₫</strong>
                                                                    </li>)
                                                            }
                                                        </ul>
                                                    </Collapse.Panel>
                                                </Collapse>
                                            </div>
                                            <div className='history-bought__item__footer'>
                                                <ButtonCustom className="btn-info-custom" text='Đánh giá' />
                                                <ButtonCustom className="btn-success-custom" text='Đã nhận được hàng ?' />
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