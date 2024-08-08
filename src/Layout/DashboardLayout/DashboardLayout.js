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
const dataPareto = {
  labels: ['A', 'B', 'C', 'D', 'E'],
  datasets: [
    {
      label: 'Frequency',
      data: [120, 90, 60, 30, 10],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: '#FF6384',
      borderWidth: 1,
      yAxisID: 'y'
    },
    {
      label: 'Cumulative Percentage',
      data: [20, 40, 60, 80, 100],
      borderColor: '#36A2EB',
      fill: false,
      type: 'line',
      yAxisID: 'y1'
    }
  ]
}

// Tùy chỉnh cấu hình biểu đồ Pareto
const optionsPareto = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          if (context.dataset.type === 'line') {
            return `${context.dataset.label}: ${context.raw}%`
          }
          return `${context.dataset.label}: ${context.raw}`
        }
      }
    }
  },
  scales: {
    y: {
      type: 'linear',
      position: 'left',
      title: {
        display: true,
        text: 'Frequency'
      }
    },
    y1: {
      type: 'linear',
      position: 'right',
      title: {
        display: true,
        text: 'Cumulative Percentage'
      },
      grid: {
        drawOnChartArea: false
      },
      ticks: {
        callback: function (value) {
          return value + '%'
        }
      }
    }
  }
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
        <div className='chart'>
          <Pie data={dataPie} />
        </div>
        <div className='chart'>
          <Bar data={dataPareto} options={optionsPareto} />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
