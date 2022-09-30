import React from 'react';
import PropTypes from 'prop-types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';


Chart.propTypes = {
    onFilter: PropTypes.func,
    options: PropTypes.object,
    data: PropTypes.object,
    isLoading: PropTypes.bool,
    type: PropTypes.string,
};

Chart.defaultProps = {
    onFilter: null,
    options: {},
    data: {},
    isLoading: false,
    type: 'line',
};


ChartJS.register(
    CategoryScale,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export function Chart(props) {
    const { options, data, isLoading, type } = props;

    return <>
        {
            type === 'bar' ? <Bar options={options} data={data} /> : <Line options={options} data={data} />
        }
    </>
}
