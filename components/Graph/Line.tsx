import React from 'react';
import {Line} from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js/auto';
Chart.register(ArcElement);

const Graph = (props) : JSX.Element => {
    const options : any = {
        responsive: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },

            title: {
                display: true,
                text: props.title?props.title:""
            }
        },
    }
    return (
        <Line data={props.data} options={options}/>
    );
};


export default Graph;