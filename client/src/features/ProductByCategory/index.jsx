import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import './ProductByCategory.scss';
import BreadcrumbCustom from 'components/BreadcrumbCustom';
import SortBy from 'components/SortBy';
import { Col, Pagination, Row } from 'antd';
import ListProducts from 'features/Home/Components/ListProducts';
import FilterItem from './components/FilterItem';

ProductByCategory.propTypes = {

};

function ProductByCategory(props) {
    return (
        <div className='product-by-category'>
            <Row gutter={[40, 0]}>
                <Col xs={24} sm={24} md={8} lg={6}>
                    <BreadcrumbCustom />
                    <div className="list-filter-item">
                        <FilterItem title="Danh mục sản phẩm" name='DANHMUC' listItem={[
                            { id: 'donghonam', label: "Đồng hồ nam", quantity: 10 },
                            { id: 'donghonu', label: "Đồng hồ nữ", quantity: 8 },
                            { id: 'donghodoi', label: "Đồng hồ đôi", quantity: 5 },
                            { id: 'phukien', label: "Phụ kiện", quantity: 20 },
                        ]} />
                        <FilterItem title="Thương hiệu" name='THUONGHIEU' listItem={[
                            { id: 'Casio', label: "Casio", quantity: 10 },
                            { id: 'Citizen', label: "Citizen", quantity: 8 },
                            { id: 'G-shock&Baby-G', label: "G-shock & Baby-G", quantity: 5 },
                            { id: 'louiserard', label: "Louis Erard", quantity: 20 },
                        ]} />
                        <FilterItem title="Lọc theo giá" name='GIA' isSlider />
                        <FilterItem title="Giới tính" name='GIOITINH'
                            listItem={[
                                { id: 'gioitinhnam', label: "Nam", quantity: 10 },
                                { id: 'gioitinhnu', label: "Nữ", quantity: 8 },
                                { id: 'gioitinhcapdoi', label: "Cặp đôi", quantity: 5 },
                            ]} />

                    </div>
                </Col>
                <Col xs={24} sm={24} md={16} lg={18}>
                    <SortBy
                        style={{ width: 250 }}
                        label="Xem tất cả 4 kết quả"
                        name="sortBy"
                        options={[
                            { label: 'Thứ tự theo điểm đánh giá', value: 'new', },
                            { label: 'Thứ tự theo sản phẩm mới', value: 'old', },
                            { label: 'Thứ tự theo giá: thấp tới cao', value: 'high', },
                            { label: 'Thứ tự theo giá: cao tới thấp', value: 'low', },
                        ]} />
                    <ListProducts numProductPerLine={3} />
                    <Pagination defaultCurrent={1} total={50} />;
                </Col>
            </Row>


        </div>
    );
}

export default ProductByCategory;