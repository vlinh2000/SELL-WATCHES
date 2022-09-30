import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'custom-fields/SelectField';
import { Col, Divider, Form, Row, Space, DatePicker, Statistic } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import moment from 'moment';
import { formatDate } from 'assets/admin';
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
function RevenueReport(props) {
    const [loading, setLoading] = React.useState(false);
    const { user } = useSelector(state => state.auth);
    const [statistical, setStatistical] = React.useState();
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
            const { result } = await donhangApi.getThongKes({ groupBy: values.groupBy, dateFrom, dateTo });
            const labels = [];
            const data = [];
            const data_profit = [];
            result.forEach(dh => {
                labels.push(dh.TEN_THONG_KE);
                data.push(dh.TONG_TIEN);
                data_profit.push(dh.TONG_TIEN - dh.TIEN_VON);
            })
            let newDataSets = [...chartInfo.datasets];
            newDataSets[0] = { ...chartInfo.datasets[0], data }
            newDataSets[1] = { ...chartInfo.datasets[1], data: data_profit }
            setChartInfo(prev => ({ ...prev, labels, datasets: newDataSets }))
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
                        isLoading={loading}
                        //  onClick={handleFilter} 
                        className='admin-custom-btn' text='Tìm kiếm'></ButtonCustom>
                </Form>

            </div>
            <br />
            <br />
            <Chart type="bar" isLoading={loading} options={options} data={chartInfo} />
        </div>
    );
}

export default RevenueReport;