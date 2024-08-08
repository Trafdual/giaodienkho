import './DashboardLayout.scss'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const dataLine = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Line Chart',
      data: [12, 19, 3, 5, 2],
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.2)'
    }
  ]
}

const dataBar = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  datasets: [
    {
      label: 'Bar Chart',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ]
    }
  ]
}

const dataPie = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Pie Chart',
      data: [300, 50, 100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ]
    }
  ]
}

function DashboardLayout () {
  return (
    <div className='dashboard'>
      <div className='chart-row'>
        <div className='chart'>
          <Line data={dataLine} />
        </div>
        <div className='chart'>
          <Bar data={dataBar} />
        </div>
      </div>
      <div className='chart-single'>
        <Pie data={dataPie} />
      </div>
    </div>
  )
}

export default DashboardLayout
