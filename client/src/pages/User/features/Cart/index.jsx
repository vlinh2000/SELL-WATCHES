import React from 'react';
import PropTypes from 'prop-types';

import './Cart.scss';
import { Button, Col, Popconfirm, Row, Table } from 'antd';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { numberWithCommas } from 'assets/admin';
import { getTotalPrice } from 'assets/common';
import { changeQuantityInCart, removeFromCart } from 'pages/User/userSlice';

Cart.propTypes = {

};

function Cart(props) {
    const { cart } = useSelector(state => state.userInfo);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className='wrapper-content'>
            <div className="cart">
                <Row gutter={[30, 0]}>
                    <Col xs={24} sm={24} md={24} lg={16}>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Sản phẩm </th>
                                    <th>Giá </th>
                                    <th>Số lượng </th>
                                    <th>Tổng cộng </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cart?.map((product, idx) =>
                                        <tr key={idx}>
                                            <td>
                                                <Popconfirm title="Bạn có chắc muốn xóa sản phẩm này ?" onConfirm={() => dispatch(removeFromCart(product.MA_SP))}>
                                                    <Button size='small' icon={<CloseOutlined style={{ fontSize: 10 }} />} shape="circle"></Button>
                                                </Popconfirm>
                                            </td>
                                            <td>
                                                <div className="sort-product-info">
                                                    <img src={(product?.ANH_SAN_PHAM?.length > 0 && product?.ANH_SAN_PHAM[0]?.HINH_ANH) || product?.HINH_ANH} />
                                                    <Link to={`/products/${product?.MA_SP}`}>{product?.TEN_SP}</Link>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='price'>
                                                    {numberWithCommas(product?.GIA_BAN)}&nbsp;₫
                                                </div>
                                            </td>
                                            <td >
                                                <div className='change-quantity'>
                                                    <Button
                                                        onClick={() => dispatch(changeQuantityInCart({ id: product?.MA_SP, quantity: -1 }))}
                                                        disabled={product?.SL_TRONG_GIO < 2}>-</Button>
                                                    <Button className='show-quantity' disabled>{product?.SL_TRONG_GIO}</Button>
                                                    <Button
                                                        onClick={() => dispatch(changeQuantityInCart({ id: product?.MA_SP, quantity: 1 }))}
                                                        disabled={product?.SL_TRONG_GIO > product?.SO_LUONG - 1}>+</Button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='total-price-per-product'>
                                                    {numberWithCommas(product?.SL_TRONG_GIO * product?.GIA_BAN)}&nbsp;₫
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                {
                                    cart.length < 1 && <tr><td></td><td>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</td></tr>
                                }
                            </tbody>
                        </table>
                        <Button icon={<LeftOutlined />} danger onClick={() => navigate('/')}>Tiếp tục xem sản phẩm</Button>
                        <br />
                        <br />
                        <br />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div className='title-custom'>Tổng số lượng</div>
                        <div>
                            {/* <div className='category-label'>
                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value'>{numberWithCommas(getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO'))}&nbsp;₫</strong>
                            </div> */}
                            <div className='category-label'>
                                <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                            </div>
                            {/* <div className='category-label'>
                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>Không áp dụng</span>
                            </div> */}
                            <div className='category-label'>
                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value'>{numberWithCommas(getTotalPrice(cart, 'GIA_BAN', 'SL_TRONG_GIO'))}&nbsp;₫</strong>
                            </div>
                            <br />
                            {
                                cart.length > 0 &&
                                <ButtonCustom onClick={() => navigate('/payments')} style={{ width: '100%', justifyContent: 'center', textTransform: 'uppercase' }} text="Tiến hành thanh toán" />
                            }
                        </div>

                        {/* <div className='title-custom'>Mã ưu đãi</div>
                        <div>
                            <InputField name="voucher" disabled={cart.length < 1} placeHolder='Mã ưu đãi' />
                            <Button disabled={cart.length < 1} block>Áp dụng mã ưu đãi</Button>
                        </div> */}

                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Cart;