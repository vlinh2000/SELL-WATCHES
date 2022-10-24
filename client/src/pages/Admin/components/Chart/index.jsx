import React from 'react';
import PropTypes from 'prop-types';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Tooltip, Legend } from 'recharts';

// import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     BarElement,
//     Title,
//     Tooltip,
//     Filler,
//     Legend
// } from 'chart.js';
// import { Line, Bar } from 'react-chartjs-2';


Chart.propTypes = {
    data: PropTypes.object,
    type: PropTypes.string,
};

Chart.defaultProps = {
    data: {},
    type: 'line',
};


export function Chart(props) {
    const { data, type } = props;
    return <>
        <ResponsiveContainer width="100%" height={300}>
            {
                type === 'bar' ?

                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Doanh thu" fill="#8884d8" />
                        <Bar dataKey="Lợi nhuận" fill="#82ca9d" />
                    </BarChart>
                    :
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Doanh thu" stroke="#8884d8" />
                        <Line type="monotone" dataKey="Lợi nhuận" stroke="#82ca9d" />
                    </LineChart>
            }
        </ResponsiveContainer>
    </>
}

