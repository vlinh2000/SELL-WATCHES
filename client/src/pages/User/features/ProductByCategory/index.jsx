import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useParams } from 'react-router-dom';
import './ProductByCategory.scss';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import SortBy from 'components/SortBy';
import { Col, Form, Pagination, Row, Tag } from 'antd';
import FilterItem from './components/FilterItem';
import ListProducts from '../Home/Components/ListProducts';
import { sanphamApi } from 'api/sanphamApi';
import { useDispatch, useSelector } from 'react-redux';
import { onFilter, onSearch, onSort, savePagination } from 'pages/User/userSlice';
import { BarsOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';

ProductByCategory.propTypes = {

};

function ProductByCategory(props) {

    const [categories, setCategories] = React.useState([]);
    const [productList, setProductList] = React.useState([]);
    const [totalProduct, setTotalProduct] = React.useState(0);
    const [brands, setBrands] = React.useState();
    const [ropeMaterial, setRopeMaterial] = React.useState();
    const [dialShape, setDialShape] = React.useState();
    const [prices, setPrices] = React.useState([]);
    const dispatch = useDispatch();
    const { cart, data: { favouriteList }, groupFilter, sortBy, searchValue,
        pagination: { productByCategoryScreen: pagination } } = useSelector(state => state.userInfo);

    const [loading, setLoading] = React.useState(false);
    const { idCategory } = useParams();

    React.useEffect(() => {
        idCategory !== 'all' && dispatch(onFilter({ name: 'MA_LOAI_SP', filterValue: [idCategory] }))
    }, [idCategory])

    console.log({ searchValue })

    // fetch side bar
    React.useEffect(() => {
        const fetchData = async (query, setState) => {
            try {
                const { result } = await sanphamApi.getAll(query);
                setState(result);
                console.log({ result })
            } catch (error) {
                console.log({ error })
            }
        }

        fetchData({ groupBy: 'MA_LOAI_SP', tableName: 'LOAI_SAN_PHAM' }, setCategories);
        fetchData({ groupBy: 'MA_THUONG_HIEU', tableName: 'THUONG_HIEU' }, setBrands);
        fetchData({ groupBy: 'CHAT_LIEU_DAY' }, setRopeMaterial);
        fetchData({ groupBy: 'HINH_DANG_MAT_SO' }, setDialShape);
        fetchData({ groupBy: 'HINH_DANG_MAT_SO' }, setDialShape);
        fetchData({ groupBy: 'GIA' }, (values) => setPrices([values[0].GIA_TU, values[0].GIA_DEN]));
    }, [])

    // fetch products
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // const groupFilter_length = Object.keys(groupFilter).length;
                // const sortBy_length = Object.keys(sortBy).length;
                setLoading(true);
                const { result, totalRecord } = await sanphamApi.getAll({ _page: pagination._page, _limit: pagination._limit, sortBy: JSON.stringify(sortBy), groupFilterBy: JSON.stringify(groupFilter), searchValue });
                setProductList(result);
                setTotalProduct(totalRecord)
                dispatch(savePagination({ screen: 'productByCategoryScreen', _page: pagination._page, _totalPage: Math.ceil(totalRecord / pagination._limit) }))
                setLoading(false);
                document.querySelector('.navbar-list').scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                setLoading(false);
                console.log({ error });
            }
        }

        fetchData();
    }, [pagination._page, pagination._limit, groupFilter, sortBy, searchValue])

    const favouriteList_ID = useMemo(() => favouriteList?.map(f => f.MA_SP), [favouriteList])
    const productInCartList_ID = useMemo(() => cart?.map(f => f.MA_SP), [cart])

    const toggleSideBar = (isShow) => {
        console.log("chayj")
        document.querySelector('body').style.overflowY = isShow ? 'hidden' : 'auto';
        document.querySelector('.side-bar-wrapper').style.transform = isShow ? 'translateX(0)' : 'translateX(-200%)';
        document.querySelector('.side-bar-wrapper .close-btn').style.display = isShow ? 'block' : 'none';

    }

    return (
        <div className='product-by-category'>
            <BarsOutlined onClick={() => toggleSideBar(true)}
                className='menu-btn' />
            <Row gutter={[40, 0]}>
                <Col lg={8} xl={7} className="side-bar-wrapper">
                    <div className="side-bar-user">
                        <BreadcrumbCustom more='Danh m???c' />
                        <div className="list-filter-item">
                            <FilterItem title="Danh m???c s???n ph???m" name='MA_LOAI_SP' listItem={categories} />
                            <FilterItem title="Th????ng hi???u" name='MA_THUONG_HIEU' listItem={brands} />
                            <FilterItem title="L???c theo gi??" name='GIA_BAN' isSlider rangeValue={prices} />
                            <FilterItem title="Ch???t li???u d??y" name='CHAT_LIEU_DAY' listItem={ropeMaterial} />
                            <FilterItem title="H??nh d???ng m???t s???" name='HINH_DANG_MAT_SO' listItem={dialShape} />
                        </div>
                        <CloseCircleOutlined onClick={() => toggleSideBar(false)}
                            className='close-btn' />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={16} xl={17}>
                    <Form
                        initialValues={{ sortBy: 'NGAY_TAO-DESC' }}
                        onValuesChange={values => {
                            const [name, sortValue] = values.sortBy.split('-');
                            dispatch(onSort({ name, sortValue }));

                        }}>
                        <SortBy
                            style={{ width: 300 }}
                            label={`Xem t???t c??? ${totalProduct} k???t qu???`}
                            name="sortBy"
                            options={[
                                { label: 'S???p x???p theo s???n ph???m m???i nh???t', value: 'NGAY_TAO-DESC', },
                                { label: 'S???p x???p theo s???n ph???m c?? nh???t', value: 'NGAY_TAO-ASC', },
                                { label: 'S???p x???p theo ??i???m ????nh gi??: th???p t???i cao', value: 'DIEM_TB-ASC', },
                                { label: 'S???p x???p theo ??i???m ????nh gi??: cao t???i th???p', value: 'DIEM_TB-DESC', },
                                { label: 'S???p x???p theo gi??: th???p t???i cao', value: 'GIA_BAN-ASC', },
                                { label: 'S???p x???p theo gi??: cao t???i th???p', value: 'GIA_BAN-DESC', },
                            ]} />
                    </Form>
                    {searchValue && <p>T??m ki???m: <Tag onClose={() => {
                        document.querySelector('input[name="searchValue"]').value = "";
                        dispatch(onSearch(""))
                    }}
                        icon={<SearchOutlined rotate={90} />} closable color="cyan">{searchValue} </Tag></p>}
                    {productList?.length < 1 && <p>Kh??ng t??m th???y k???t qu??? ph?? h??p.</p>}
                    <ListProducts
                        favouriteList={favouriteList_ID}
                        productInCartList={productInCartList_ID}
                        productList={productList}
                        numProductPerLine={3} />
                    {
                        pagination._totalPage > 0 && <Pagination
                            onChange={(_page) => dispatch(savePagination({ screen: 'productByCategoryScreen', _totalPage: pagination._totalPage, _page }))}
                            current={pagination._page}
                            pageSize={1}
                            total={pagination._totalPage} />
                    }
                </Col>
            </Row>
        </div>
    );
}

export default ProductByCategory;