import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import './Dashboard.scss';
import { AppleOutlined, AreaChartOutlined, DollarOutlined, HourglassOutlined, QuestionCircleOutlined, QuestionOutlined, TeamOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';

Dashboard.propTypes = {

};

function Dashboard(props) {
    return (
        <div className='dashboard'>
            <Row gutter={[20, 0]}>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-dark">
                            <AreaChartOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Tổng đơn hàng</div>
                            <div className="content-num">100</div>
                        </div>
                        <p className='small-info'>Thời gian từ 2022-08-01 - 2022-08-31</p>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-blue">
                            <UsergroupAddOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Người dùng mới</div>
                            <div className="content-num">100</div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-green">
                            <DollarOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Doanh thu</div>
                            <div className="content-num">100</div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-pink">
                            <HourglassOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Đơn hàng chờ xử lý</div>
                            <div className="content-num">100</div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className="box">
                biểu đồ doanh thu
            </div>
            <div className="box">
                chưa biết
            </div>
        </div>
    );
}

export default Dashboard;