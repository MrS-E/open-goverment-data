import React from 'react';
import {Pie} from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js/auto'; //can't remove even if it's unused, doesn't work without
Chart.register(ArcElement);

const Graph = (props) => {
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
                    text: 'Energiemix'
                }
            },
        }
    return (
        <Pie height="400vmin" data={props.data} options={options}/>
    );
};


export default Graph;