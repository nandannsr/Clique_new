import React,{ useState, useEffect } from 'react'
import instance from "../../utils/axiosInstance";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminChart = (props) => {
      
      const { chartData } = props
      console.log("Inside chart",chartData)
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' 
          },
          title: {
            display: true,
            text: 'User And Video Growth',
          },
        },
      };
      
      const labels = chartData.months;
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Users',
            data: chartData.userCount,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Videos',
            data: chartData.videoCount,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
    //   const [chartData, setChartData] = useState([]);
  return (
    <Line options={options} data={data} />
  )
}

export default AdminChart