import React from 'react';
import {Pie} from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'; //can't remove even if it's unused, doesn't work without


const Graph = (props) => {
    const options = {
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