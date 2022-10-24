import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'custom-fields/SelectField';
import { Col, Divider, Form, Row, Space, DatePicker, Statistic, Button, Table, List, Avatar } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import moment from 'moment';
import { formatDate, numberWithCommas } from 'assets/admin';
import { Chart } from 'pages/Admin/components/Chart';
import { donhangApi } from 'api/donhangApi';
import './Report.scss';
import { LikeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import PickDateField from 'custom-fields/PickDateField';
RevenueReport.propTypes = {

};
const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'Báo cáo doanh thu',
        },
    },
};

const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#4B91F7'];

function RevenueReport(props) {
    const [loading, setLoading] = React.useState(false);
    const { user } = useSelector(state => state.auth);
    const [statistical, setStatistical] = React.useState();
    const [moreData, setMoreData] = React.useState();
    const [chartInfo, setChartInfo] = React.useState({
        labels: [],
        datasets: [
            {
                fill: true,
                label: 'Doanh thu',
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgb(75, 192, 192)',
            },
            {
                fill: true,
                label: 'Lợi nhuận',
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgb(255, 99, 132)',
            },
        ]
    });
    const onFilterRevenue = async (values) => {
        // console.log({ values })
        // return;
        try {
            setLoading(true);
            const dateFrom = values.dateFrom.format('YYYY-MM-DD');
            const dateTo = values.dateTo.format('YYYY-MM-DD');
            const { result, moreData: resMoreData } = await donhangApi.getThongKes({ groupBy: values.groupBy, dateFrom, dateTo, action: 'more-data' });
            const data = result.map(dh => ({ name: dh.TEN_THONG_KE, 'Doanh thu': dh.TONG_TIEN, "Lợi nhuận": dh.TONG_TIEN - dh.TIEN_VON }));
            setChartInfo(data)
            setMoreData(resMoreData);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log({ error });
        }
    }

    React.useEffect(() => {
        console.log({ chartInfo })
    }, [chartInfo])

    React.useEffect(() => {
        const fetchStatisticalRevenue = async () => {
            try {
                const { result } = await donhangApi.getThongKes({ action: 'get_only_statistical' });
                setStatistical(result);
            } catch (error) {
                console.log({ error })
            }
        }

        fetchStatisticalRevenue();
    }, [])

    React.useEffect(() => {
        form.submit();
    }, [])

    const initialValues = {
        HO_TEN: user?.HO_TEN,
        groupBy: 'day',
        dateFrom: moment().startOf('month'),
        dateTo: moment()
    }

    const [form] = Form.useForm();

    const data = [
        'Racing car sprays burning fuel into crowd.',
        'Japanese princess to wed commoner.',
        'Australian walks 100km after outback crash.',
        'Man charged over missing wedding girl.',
        'Los Angeles battles huge wildfires.',
    ];
    return (
        <div className='revenues box'>
            <br />
            <div className='filter-box'>
                <Form
                    form={form}
                    initialValues={initialValues}
                    onFinish={onFilterRevenue}
                // labelCol={{
                //     span: 5
                // }}
                >
                    <Row gutter={[40, 0]} >
                        <Col xs={24} sm={24} md={12} lg={7}>
                            <InputField label='Tên nhân viên' name='HO_TEN' disabled />
                            <SelectField style={{ width: '100%' }} name='groupBy' label='Thống kê theo'
                                options={[
                                    { label: 'Ngày', value: 'day' },
                                    { label: 'Tuần', value: 'week' },
                                    { label: 'Tháng', value: 'month' },
                                    { label: 'Quý', value: 'quarter' },
                                    { label: 'Năm', value: 'year' },
                                ]} />

                        </Col>
                        <Col xs={24} sm={24} md={12} lg={7}>
                            <PickDateField label='Ngày bắt đầu' type='date' name='dateFrom' />
                            <PickDateField label='Ngày kết thúc' type='date' name='dateTo' />
                        </Col>
                        {/* <Divider type='vertical' /> */}
                        <Col xs={24} sm={24} md={24} lg={10}>
                            <div className="show-statistical">
                                <Row justify='center'>
                                    <Col span={8}>
                                        <Statistic title="Tổng doanh thu" value={statistical?.DOANH_THU} suffix="đ" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Tổng lợi nhuận" value={statistical?.LOI_NHUAN || 0} suffix="đ" />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Tổng vốn" value={statistical?.TIEN_VON} suffix="đ" />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                    <ButtonCustom
                        type='submit'
                        style={{ marginTop: 30 }}
                        isLoading={loading}>Tìm kiếm</ButtonCustom>
                </Form>

            </div>
            <br />
            {/* <br /> */}
            <Row className='top-seller' justify="space-between">
                <Col xs={24} sm={24} md={24} lg={13} className="box">
                    <div className='sub-title'>Top sản phẩm bán chạy nhất</div>
                    {
                        <List
                            bordered
                            itemLayout="horizontal">
                            {
                                moreData?.TOP_SP_BAN_CHAY?.map((sp, idx) =>
                                    <List.Item key={sp.MA_SP}>
                                        <List.Item.Meta
                                            avatar={<><span className='text-order'>#{idx + 1}</span>&nbsp;&nbsp;&nbsp;<Avatar src={sp.HINH_ANH} /></>}
                                            title={sp.TEN_SP}
                                            description={sp.TEN_LOAI_SP}
                                        />
                                        <div style={{ fontSize: 13 }}>đã bán: {sp.TONG_SO}</div>
                                    </List.Item>
                                )
                            }
                        </List>
                    }
                </Col>
                <Col xs={24} sm={24} md={24} lg={11} xl={8} className="box">
                    <div className='sub-title'>Top mua hàng </div>
                    {
                        <List
                            bordered
                            itemLayout="horizontal">

                            {
                                moreData?.TOP_USER?.map((user, idx) =>
                                    <List.Item key={user.USER_ID}>
                                        <List.Item.Meta
                                            avatar={<><span className='text-order'>#{idx + 1}</span>&nbsp;&nbsp;&nbsp;<Avatar style={{ backgroundColor: colorList[idx + 4] }} src={user.ANH_DAI_DIEN}>{!user.ANH_DAI_DIEN ? user.HO_TEN.charAt(0).toUpperCase() : ''}</Avatar></>}
                                            title={user.HO_TEN}
                                            description={user.DIA_CHI?.split(', ')?.pop()}
                                        />
                                        <div style={{ fontSize: 13 }}>đã mua: {numberWithCommas(user.TONG_SO) + ' đ'}</div>
                                    </List.Item>
                                )
                            }


                        </List>
                    }
                </Col>
            </Row>
            <br />
            <br />
            <div className='sub-title'>Biểu đồ thống kê doanh thu</div>
            {/* <Divider /> */}
            <Chart type="bar" isLoading={loading} data={chartInfo} />

        </div>
    );
}

export default RevenueReport;