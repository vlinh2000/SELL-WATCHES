import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './WishList.scss';
import ButtonCustom from 'components/ButtonCustom';
import { useDispatch, useSelector } from 'react-redux';
import { numberWithCommas } from 'assets/admin';
import { addToCart, fetch_favouriteList } from 'pages/User/userSlice';
import toast from 'react-hot-toast';
import { yeuthichApi } from 'api/yeuthichApi';
import Title from 'components/Title';

WishList.propTypes = {

};

function WishList(props) {
    const { cart, data: { favouriteList } } = useSelector(state => state.userInfo);
    const productInCart = useMemo(() => cart?.map(f => f.MA_SP, [cart]));

    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();

    const handleDeleteFromFavouriteList = async (idProduct) => {
        try {
            setLoading(true)
            const { message } = await yeuthichApi.delete(idProduct);
            dispatch(fetch_favouriteList());
            setLoading(false);
            toast.success(message);

        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
        }

    }
    return (
        <div className='wrapper-content'>
            <Title style={{ fontSize: 20 }}>Sản phẩm yêu thích</Title>
            <div className="wishlist">
                {
                    favouriteList?.length < 1 ? <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.&nbsp;<Link to="/">Về trang chủ</Link></p>
                        :
                        <table >
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
                                {
                                    favouriteList?.map((product, idx) =>
                                        <tr key={idx}>
                                            <td>
                                                <Popconfirm title="Bạn có chắc muốn xóa sản phẩm này ?" onConfirm={() => handleDeleteFromFavouriteList(product.MA_SP)}>
                                                    <Button size='small' icon={<CloseOutlined style={{ fontSize: 10 }} />} shape="circle"></Button>
                                                </Popconfirm>
                                            </td>
                                            <td>
                                                <div className="sort-product-info">
                                                    <img src={product.HINH_ANH} />
                                                    <Link to="">{product.TEN_SP}</Link>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='price'>
                                                    {numberWithCommas(product.GIA_BAN)}&nbsp;₫
                                                </div>
                                            </td>
                                            <td >
                                                {product.SO_LUONG < 1 ? 'Hết hàng' : 'Còn hàng'}
                                            </td>
                                            <td className='action'>
                                                {
                                                    productInCart?.includes(product.MA_SP) ? <i>Sản phẩm đã có trong giỏ hàng</i> : product.SO_LUONG > 0 ?
                                                        <ButtonCustom onClick={() => {
                                                            dispatch(addToCart({ product }));
                                                            toast.success("Đã thêm sản phẩm vào giỏ hàng");
                                                        }}
                                                            text="Thêm vào giỏ"></ButtonCustom>
                                                        : ''
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                }
            </div>
        </div>
    );
}

export default WishList;