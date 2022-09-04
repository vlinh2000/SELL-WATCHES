import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Col, Divider, List, Row, Timeline } from 'antd';
import './Dashboard.scss';
import { AppleOutlined, AreaChartOutlined, DollarOutlined, HourglassOutlined, QuestionCircleOutlined, QuestionOutlined, TeamOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { numberWithCommas } from 'assets/admin';
import { Chart } from 'pages/Admin/components/Chart';
import CarouselCustom from 'pages/User/features/Home/Components/CarouselCustom';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { donhangApi } from 'api/donhangApi';

Dashboard.propTypes = {

};
const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: false,
            text: 'Thống kê doanh thu',
        },
    },
};
function Dashboard(props) {

    const {
        loading: { statistical: isLoading },
        data: { statistical, ordersConfirm } } = useSelector(state => state.adminInfo);

    const [chartInfo, setChartInfo] = React.useState({
        labels: [],
        datasets: [
            {
                fill: true,
                label: 'Doanh thu',
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });

    const onFilterRevenueByMonth = async (dateFrom, dateTo) => {
        try {
            const { result } = await donhangApi.getThongKes({ dateFrom, dateTo });
            const labels = [];
            const data = [];
            result.forEach(dh => {
                labels.push(dh.THANG);
                data.push(dh.TONG_TIEN);
            })

            setChartInfo(prev => ({ ...prev, labels, datasets: [{ ...prev.datasets[0], data }] }))
        } catch (error) {
            console.log({ error });
        }
    }

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
                            <div className="content-num">{statistical?.TONG_DH}</div>
                        </div>
                        {/* <p className='small-info'></p> */}
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-blue">
                            <UsergroupAddOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Tổng người dùng</div>
                            <div className="content-num">{statistical?.TONG_USER}</div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-green">
                            <DollarOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Tổng doanh thu</div>
                            <div className="content-num">{numberWithCommas(statistical?.TONG_DOANH_THU || 0)}&nbsp;₫</div>
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
                            <div className="content-num">{ordersConfirm?.length}</div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={[20, 0]}>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <div className="box" style={{ minHeight: '40vh' }}>
                        <div className='sub-title'>Top sản phẩm bán chạy nhất</div>
                        <List
                            itemLayout="horizontal">
                            {
                                statistical?.TOP_SP_BAN_CHAY?.map((sp, idx) =>
                                    <List.Item key={idx}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={sp.HINH_ANH} />}
                                            title={sp.TEN_SP}
                                            description={sp.MO_TA}
                                        />
                                        <div>Đã bán: {sp.DA_BAN}</div>
                                    </List.Item>
                                )
                            }

                        </List>


                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <div className="box" style={{ minHeight: '40vh' }}>
                        <div className='sub-title'>Đơn hàng mới nhất</div>
                        <br />
                        <Timeline mode="left">
                            {
                                statistical?.DON_HANG_MOI_NHAT?.map((dh, idx) =>
                                    <Timeline.Item key={idx}><i>{moment(dh.TG_DAT_HANG).format('DD-MM-YYYY HH:mm:ss')}</i> KH: <b>{dh.HO_TEN_NGUOI_DAT} </b> đã đặt đơn hàng với giá trị {numberWithCommas(dh.TONG_TIEN || 0)}&nbsp;₫</Timeline.Item>
                                )
                            }
                        </Timeline>
                    </div>
                </Col>
            </Row>
            <div className="box">
                <div className='sub-title'>Thống kê doanh thu</div>
                <br />
                <Chart onFilter={onFilterRevenueByMonth} options={options} data={chartInfo} />
            </div>

        </div>
    );
}

export default Dashboard;