import { Line } from 'vue-chartjs'
import moment from 'moment'

const typeTranslate = {
  'electricity': 'Электричество',
  'water': 'Вода',
  'gas': 'Газ',
}

const typeStyles = {
  electricity: {
    borderColor: '#09e3ff',
  },
  water: {
    borderColor: '#3f51b5',
  },
  gas: {
    borderColor: '#fdc506',
  }
}

export default {
  extends: Line,
  props: ['data'],
  mounted () {
    let labels = new Set()
    const datasets = this.data.map(i => {
      const [type, values] = Object.entries(i)[0]
      values.map(i => {
        labels.add( moment.unix(i[0]).lang('ru').format('dddd DD/MM'))
      })
      return {
        label: typeTranslate[type],
        data: values.map(i => {
          return {
            x: i[0],
            y: i[1],
          }
        }),
        pointRadius: 4,
        pointBorderWidth: 2,
        fill: false,
        backgroundColor: 'transparent',
        ...typeStyles[type],
      }
    })

    this.renderChart({
      labels: [...labels],
      datasets,
      
    }, {responsive: true, maintainAspectRatio: false})
  }
}