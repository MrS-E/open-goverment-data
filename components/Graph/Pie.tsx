import React from 'react';
import {Pie} from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js/auto';
Chart.register(ArcElement);

const Graph = (props) : JSX.Element => {
    const options : any = {
            maintainAspectRatio: false,
            responsive: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true
                },
                title: {
                    display: true,
                    text: props.title?props.title:""
                }
            },
        }
    return (
        <Pie height="400vmin" data={props.data} options={options}/>
    );
};


export default Graph;