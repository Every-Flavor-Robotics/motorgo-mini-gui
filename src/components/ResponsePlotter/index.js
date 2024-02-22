// ResponsePlotter.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const ResponsePlotter = ({ data }) => {
    const formattedData = {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.color,
            fill: false,
            type: 'line',
        }))
    };

    // const options = {
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //         }
    //     },
    //     plugins: {
    //         legend: {
    //             display: true,
    //             position: 'top',
    //         },
    //         tooltip: {
    //             enabled: true,
    //         }
    //     }
    // };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Line data={formattedData} />
        </div>
    );
};

export default ResponsePlotter;
