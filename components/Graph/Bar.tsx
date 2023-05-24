import React from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js/auto';
Chart.register(ArcElement);

const Graph = (props) : JSX.Element => {
    const options : any = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: true,
                text: props.title?props.title:""
            },
        },
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Gemeinde'
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Prozent',
                },
                type: 'logarithmic',
                min: 0,
                max: 100,
            }
        }
    }
    return (
        <Bar height="400px" data={props.data} options={options}/>
    );
};


export default Graph;