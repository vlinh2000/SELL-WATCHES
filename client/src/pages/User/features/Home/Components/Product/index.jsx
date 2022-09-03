import { HeartFilled, HeartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Col, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import './Product.scss';

Product.propTypes = {

};

function Product(props) {
    const { animation, numProductPerLine } = props;
    return (
        <Col xs={24} sm={24} md={24 / (numProductPerLine - 1)} lg={24 / numProductPerLine} style={{ padding: '10px' }}>
            <div className="product">
                <div data-aos={animation || ''}>
                    <Link to="">
                        <img width={300} height={300} className='product__image' src='https://mauweb.monamedia.net/dongho/wp-content/uploads/2018/03/13900AA05.BDC102-600x600-300x300.jpg' alt='product' />
                    </Link>
                    <div className='product__category'>Đồng hồ nam</div>
                    <Link to="" className='product__name'>ĐỒNG HỒ LOUIS ERARD 13900AA05.BDC102 NAM PIN DÂY DA</Link>
                    <div className='product__price'>
                        <div className="old-price">20,217,000&nbsp;₫</div>
                        <div className="price">18,195,300&nbsp;₫</div>
                    </div>
                    <div className="product__btn-add-to-cart">
                        <Tooltip title="Thêm vào giỏ" placement='top'>
                            <ShoppingOutlined className='add-to-cart-icon' />
                        </Tooltip>
                    </div>
                    <div className="product__btn-like">
                        <Tooltip title="Thêm vào yêu thích" placement='top'>
                            <HeartOutlined className='like-icon' />
                            {/* <HeartFilled className='like-icon' /> */}
                        </Tooltip>
                    </div>
                    <div className="product__out-of-stock">Hết hàng</div>
                    <div className="product__discount">10%</div>
                </div>
            </div>

        </Col>
    );
}

export default Product;