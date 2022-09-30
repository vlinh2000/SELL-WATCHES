import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Col, Divider, List, Row, Skeleton, Spin, Timeline } from 'antd';
import './Dashboard.scss';
import { AppleOutlined, AreaChartOutlined, DollarOutlined, HourglassOutlined, LoadingOutlined, QuestionCircleOutlined, QuestionOutlined, RiseOutlined, TeamOutlined, UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { numberWithCommas } from 'assets/admin';
import { Chart } from 'pages/Admin/components/Chart';
import CarouselCustom from 'pages/User/features/Home/Components/CarouselCustom';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { donhangApi } from 'api/donhangApi';
import SkeletonCustom from 'pages/Admin/components/SkeletonCustom';

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

    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState(() => ([moment().startOf('month'), moment().endOf('month')]))

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

    React.useEffect(() => {
        const onFilterRevenue = async () => {
            try {
                setLoading(true);
                const dateFrom = date[0].format().slice(0, 10);
                const dateTo = date[1].format().slice(0, 10);
                const { result } = await donhangApi.getThongKes({ groupBy: 'day', dateFrom, dateTo });
                const labels = [];
                const data = [];
                result.forEach(dh => {
                    labels.push(dh.TEN_THONG_KE);
                    data.push(dh.TONG_TIEN);
                })
                setChartInfo(prev => ({ ...prev, labels, datasets: [{ ...prev.datasets[0], data }] }))
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log({ error });
            }
        }


        onFilterRevenue();
    }, [date])


    return (
        <div className='dashboard'>
            <Row gutter={[20, 0]}>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-dark">
                            <AreaChartOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Tổng đơn hàng  </div>
                            <div className="content-num">{isLoading ? <Spin size='small' /> : statistical?.TONG_DH}</div>
                        </div>
                        <p className='small-info'>Tính từ ngày {moment(statistical?.DH_TINH_TU_NGAY).format('DD-MM-YYYY')}</p>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-blue">
                            <UsergroupAddOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Tổng người dùng</div>
                            <div className="content-num">{isLoading ? <Spin size='small' /> : statistical?.TONG_USER}</div>
                        </div>
                        <p className='small-info'>Hôm nay <strong>+{statistical?.SL_USER_HOM_NAY}</strong> người dùng mới</p>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-green">
                            <DollarOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Tổng doanh thu</div>
                            <div className="content-num">{isLoading ? <Spin size='small' /> : numberWithCommas(statistical?.TONG_DOANH_THU || 0)}&nbsp;₫</div>
                        </div>
                        <p className='small-info'>Doanh thu hôm nay: <strong>{numberWithCommas(statistical?.TONG_DOANH_THU_HOM_NAY || 0)}&nbsp;₫</strong></p>
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <div className="box">
                        <div className="small-box bg-pink">
                            <HourglassOutlined />
                        </div>
                        <div className="content">
                            <div className="content-title">Đơn chờ xử lý</div>
                            <div className="content-num">{isLoading ? <Spin size='small' /> : statistical?.DH_CHO_XU_LY}</div>
                        </div>
                        <p className="small-info">
                            Danh sách đơn cần xử lý <Link className='view-btn' to="/admin/orders/confirm">View</Link>
                        </p>
                    </div>
                </Col>
            </Row>
            <Row gutter={[20, 0]}>
                <Col xs={24} sm={24} md={24} lg={12}>
                    <div className="box" style={{ minHeight: '40vh' }}>
                        <div className='sub-title'>Top sản phẩm bán chạy nhất</div>
                        {
                            isLoading
                                ? <SkeletonCustom rows={5} />
                                : <List
                                    itemLayout="horizontal">
                                    {
                                        statistical?.TOP_SP_BAN_CHAY?.map((sp, idx) =>
                                            <List.Item key={idx}>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={sp.HINH_ANH} />}
                                                    title={sp.TEN_SP}
                                                    description={sp.MO_TA.substring(0, 120) + '...'}
                                                />
                                                <div style={{ fontSize: 13 }}>Đã bán: {sp.DA_BAN}</div>
                                            </List.Item>
                                        )
                                    }

                                </List>
                        }


                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                    <div className="box" style={{ minHeight: '40vh' }}>
                        <div className='sub-title'>Đơn hàng mới nhất</div>
                        {
                            isLoading
                                ? <SkeletonCustom rows={5} />
                                :
                                <>
                                    <br />
                                    <Timeline mode="left">
                                        {
                                            statistical?.DON_HANG_MOI_NHAT?.map((dh, idx) =>
                                                <Timeline.Item key={idx}><i>{moment(dh.TG_DAT_HANG).format('DD-MM-YYYY HH:mm:ss')}</i> KH: <b>{dh.HO_TEN_NGUOI_DAT} </b> đã đặt đơn hàng với giá trị {numberWithCommas(dh.TONG_TIEN || 0)}&nbsp;₫</Timeline.Item>
                                            )
                                        }
                                    </Timeline>
                                </>
                        }
                    </div>
                </Col>
            </Row>
            <div className="box">
                <div className='sub-title'>Doanh thu tháng này ({date[0]?.format('MM-YYYY')}) <Link to="/admin/revenues/view">Xem chi tiết</Link></div>
                <br />
                <Chart isLoading={loading} options={options} data={chartInfo} />
            </div>

        </div>
    );
}

export default Dashboard;