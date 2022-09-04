import React from 'react';
import PropTypes from 'prop-types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import SelectField from 'custom-fields/SelectField';
import { Col, Divider, Form, Row, Space, DatePicker } from 'antd';
import ButtonCustom from 'components/ButtonCustom';
import InputField from 'custom-fields/InputField';
import moment from 'moment';
import { formatDate } from 'assets/admin';

Chart.propTypes = {
    onFilter: PropTypes.func,
    options: PropTypes.object,
    data: PropTypes.object
};

Chart.defaultProps = {
    onFilter: null,
    options: {},
    data: {}
};



ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export function Chart(props) {
    const { onFilter, options, data } = props;
    const [date, setDate] = React.useState(() => ([moment().startOf('year'), moment()]))
    const [isLoading, setIsLoading] = React.useState(false);


    React.useEffect(() => {
        handleFilter();
    }, [])

    const handleFilter = () => {
        if (!onFilter) return;
        const dateFrom = date[0].format().slice(0, 10);
        const dateTo = date[1].endOf('month').format().slice(0, 10);
        console.log({ dateFrom, dateTo })
        onFilter(dateFrom, dateTo);
    }

    return <>
        <Space direction="vertical" size={12}>
            <DatePicker.RangePicker picker="month" onChange={(values) => setDate(values)} defaultValue={[date[0], date[1]]} />
            <ButtonCustom isLoading={isLoading} onClick={handleFilter} className='admin-custom-btn' text='Lọc'></ButtonCustom>
        </Space>
        <br />
        <br />
        <Line options={options} data={data} />;
    </>
}
