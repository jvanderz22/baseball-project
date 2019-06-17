import React from 'react'
import {
  XYPlot,
  XAxis,
  Hint,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
} from 'react-vis'
import maxBy from 'lodash/maxBy'
import ceil from 'lodash/ceil'

import './styles.scss'

function LineChart(props) {
  const { data } = props
  const maxYValue = maxBy(data, 'y').y
  const maxYRange = ceil(maxYValue, 1)
  return (
    <XYPlot
      width={600}
      height={400}
      xType="time"
      yDomain={[0, maxYRange]}
      margin={{
        left: 60,
        top: 10,
        right: 60,
        bottom: 40,
      }}
    >
      <HorizontalGridLines />
      <LineSeries data={data} />
      <XAxis />
      <YAxis tickFormat={v => v.toFixed(3)} />
    </XYPlot>
  )
}

export default LineChart
