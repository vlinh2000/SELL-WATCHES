import React from 'react';
import PropTypes from 'prop-types';

import './Cart.scss';
import { Button, Col, Row, Table } from 'antd';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';

Cart.propTypes = {

};

function Cart(props) {
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
                                <tr>
                                    <td>
                                        <Button size='small' icon={<CloseOutlined style={{ fontSize: 10 }} />} shape="circle"></Button>
                                    </td>
                                    <td>
                                        <div className="sort-product-info">
                                            <img src='http://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-tissot-t063.907.11.058.00-nam-tu-dong-day-inox-600x600-300x300.jpg' />
                                            <Link to="">ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='price'>
                                            21,940,000 ₫
                                        </div>
                                    </td>
                                    <td >
                                        <div className='change-quantity'>
                                            <Button>-</Button>
                                            <Button className='show-quantity' disabled>1</Button>
                                            <Button>+</Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='total-price-per-product'>
                                            21,940,000 ₫
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button size='small' icon={<CloseOutlined style={{ fontSize: 10 }} />} shape="circle"></Button>
                                    </td>
                                    <td>
                                        <div className="sort-product-info">
                                            <img src='http://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/dong-ho-tissot-t063.907.11.058.00-nam-tu-dong-day-inox-600x600-300x300.jpg' />
                                            <Link to="">ĐỒNG HỒ TISSOT T063.907.11.058.00 NAM TỰ ĐỘNG DÂY INOX</Link>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='price'>
                                            21,940,000 ₫
                                        </div>
                                    </td>
                                    <td >
                                        <div className='change-quantity'>
                                            <Button>-</Button>
                                            <Button className='show-quantity' disabled>1</Button>
                                            <Button>+</Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='total-price-per-product'>
                                            21,940,000 ₫
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Button icon={<LeftOutlined />} danger>Tiếp tục xem sản phẩm</Button>
                        <br />
                        <br />
                        <br />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div className='title-custom'>Tổng số lượng</div>
                        <div>
                            <div className='category-label'>
                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value'>28,852,000 ₫</strong>
                            </div>
                            <div className='category-label'>
                                <span className='category-label-key'>Đơn vị vận chuyển </span><span className='category-label-value'>Giao hàng nhanh (GHN)</span>
                            </div>
                            <div className='category-label'>
                                <span className='category-label-key'>Mã ưu đãi </span><span className='category-label-value'>không áp dụng</span>
                            </div>
                            <div className='category-label'>
                                <span className='category-label-key'>Tổng cộng </span><strong className='category-label-value'>28,852,000 ₫</strong>
                            </div>
                            <br />
                            <ButtonCustom style={{ width: '100%', justifyContent: 'center', textTransform: 'uppercase' }} text="Tiến hành thanh toán" />
                        </div>

                        <div className='title-custom'>Mã ưu đãi</div>
                        <div>
                            <InputField name="voucher" placeHolder='Mã ưu đãi' />
                            <Button block>Áp dụng mã ưu đãi</Button>
                        </div>

                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Cart;