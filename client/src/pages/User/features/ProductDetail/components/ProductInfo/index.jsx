import React from 'react';
import PropTypes from 'prop-types';

import './ProductInfo.scss';
import ButtonCustom from 'components/ButtonCustom';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
ProductInfo.propTypes = {

};

function ProductInfo(props) {
    return (
        <div className='product-info'>
            <div className='product-info__name'>ĐỒNG HỒ CASIO GA-110GB-1ADR NAM PIN DÂY NHỰA</div>
            <div className='product-info__description'>Đồng hồ nam CASIO GA-110GB-1AVDF có thiết kế mới sử dụng kim loại màu vàng làm vạch số và kim nổi bật, sang trọng hơn so với thiết kế cũ nên mẫu GA-110GB-1AVDF rất được lòng giới trẻ hiện nay.</div>
            <div className="product-info__status-stock">Sản phẩm này đã hết hàng hoặc không có sẵn.</div>

            <div className="product-info__group-quantity">
                <Button className='btn-decrease'>-</Button>
                <div className='current-quantity'>0</div>
                <Button className='btn-increase'>+</Button>
                <ButtonCustom className="btn-add-to-cart" text="Thêm vào giỏ"></ButtonCustom>
            </div>

            <ul className="product-info__info-list">
                <li className="info-item">
                    Mã: 654 TASMAN
                </li>
                <li className="info-item">
                    Danh mục: <Link to="">Dây Da ZRC</Link>,<Link to="">Phụ kiện</Link>
                </li>
                <li className="info-item">
                    Tags: <Link to="">Dây Da ZRC</Link>,<Link to="">Phụ kiện</Link>
                </li>
            </ul>

        </div>
    );
}

export default ProductInfo;