import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './WishList.scss';
import ButtonCustom from 'components/ButtonCustom';

WishList.propTypes = {

};

function WishList(props) {
    return (
        <div className='wrapper-content'>
            <div className="wishlist">
                <table width="100%">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Sản phẩm </th>
                            <th>Giá </th>
                            <th>Trạng thái</th>
                            <th></th>
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
                                Còn hàng
                            </td>
                            <td className='action'>
                                <ButtonCustom text="Thêm vào giỏ"></ButtonCustom>
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
                                Còn hàng
                            </td>
                            <td className='action'>
                                <ButtonCustom text="Thêm vào giỏ"></ButtonCustom>
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
                                Còn hàng
                            </td>
                            <td className='action'>
                                <ButtonCustom text="Thêm vào giỏ"></ButtonCustom>
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
                                Còn hàng
                            </td>
                            <td className='action'>
                                <ButtonCustom text="Thêm vào giỏ"></ButtonCustom>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WishList;