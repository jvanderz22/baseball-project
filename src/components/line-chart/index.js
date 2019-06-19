// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'
import debounce from 'lodash/debounce'
import {
  Crosshair,
  ChartLabel,
  XYPlot,
  XAxis,
  YAxis,
  LineSeries,
  MarkSeries,
} from 'react-vis'
import map from 'lodash/map'
import max from 'lodash/max'
import maxBy from 'lodash/maxBy'
import ceil from 'lodash/ceil'

import {
  COMPUTED_DATA_FIELDS,
  COUNTING_DATA_FIELDS,
} from 'services/stat-calculations'

import styles from './styles.scss'

type Props = {
  data: Object,
}

type CrosshairData = {
  y: number,
  x: number,
  timeframe: string,
  dataKey: string,
  displayValue: string | number,
}

type State = {
  crosshairValue: ?CrosshairData,
  chartWidth: number,
}

const STAT_COLOR_MAP = {
  AVG: styles.blue,
  OBP: styles.gray,
  SLG: styles.orange,
  OPS: styles.yellow,
  PA: styles.lightblue,
  AB: styles.green,
  H: styles.red,
  HR: styles.darkblue,
  BB: styles.darkgray,
  SO: styles.darkyellow,
  HBP: styles.darkorange,
  SF: styles.yellowgreen,
  TB: styles.bluegreen,
  RBI: styles.brown,
}

const getComputedValueFromScaledValue = (computedValue, maxCountedValue) => {
  return (computedValue / maxCountedValue / 3).toFixed(3)
}

class LineChart extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      crosshairValue: null,
      chartWidth: 400,
    }
  }

  handleMouseOverPoint = debounce((activeCrosshair: CrosshairData) => {
    this.setState({
      crosshairValue: activeCrosshair,
    })
  }, 150)

  handleMouseOutPoint = debounce(() => {
    this.setState({
      crosshairValue: null,
    })
  }, 300)

  setChartWidth = (element: ?HTMLDivElement) => {
    if (element) {
      const { offsetWidth } = element
      const width = offsetWidth > 400 ? offsetWidth : 400
      this.setState({
        chartWidth: width,
      })
    }
  }

  render() {
    const { data } = this.props
    const { crosshairValue } = this.state

    // Figure out the max Y values of the raw data passed to the component
    const countedYValues = Object.keys(data).reduce((arr, key) => {
      if (COUNTING_DATA_FIELDS[key]) {
        return arr.concat(map(data[key], 'y'))
      }
      return arr
    }, [])
    const computedYValues = Object.keys(data).reduce((arr, key) => {
      if (COMPUTED_DATA_FIELDS[key]) {
        return arr.concat(map(data[key], 'y'))
      }
      return arr
    }, [])
    const hasCountedValues = countedYValues.length !== 0
    const hasComputedValues = computedYValues.length !== 0
    const maxComputedValue = max(computedYValues)
    const maxCountedValue = max(countedYValues) || 1 / 3
    let maxChartValue = maxCountedValue

    // Transform the given data into renderable values scaled to the chart
    const transformedData = Object.keys(data).reduce((obj, dataKey) => {
      if (COMPUTED_DATA_FIELDS[dataKey]) {
        obj[dataKey] = data[dataKey].map(dataValue => {
          return { x: dataValue.x, y: dataValue.y * maxCountedValue * 3 }
        })
      } else {
        obj[dataKey] = data[dataKey].map(dataValue => {
          return { x: dataValue.x, y: dataValue.y }
        })
      }

      return obj
    }, {})

    // Calculate the max Y value in the chart
    for (const dataKey of Object.keys(transformedData)) {
      const maxDataVal = maxBy(transformedData[dataKey], 'y').y
      if (maxDataVal > maxChartValue) {
        maxChartValue = maxDataVal
      }
    }

    // Set the domain of the chart from 0 to the max value
    const yDomain = hasCountedValues
      ? [0, maxChartValue]
      : [0, ceil(maxComputedValue, 1)]

    // Figure out which ticks to include on the computed axis
    const tickTotal = ceil(maxComputedValue, 1) / 0.1 + 1
    let computedAxisTicks = []
    if (tickTotal > 0) {
      computedAxisTicks = [...Array(ceil(tickTotal, 1)).keys()].map(index => {
        return index * 0.1 * maxCountedValue * 3
      })
    }

    const transformedDataKeys = Object.keys(transformedData)
    const usedCountingStats = transformedDataKeys.filter(
      dataKey => !!COUNTING_DATA_FIELDS[dataKey]
    )
    const usedComputedStats = transformedDataKeys.filter(
      dataKey => !!COMPUTED_DATA_FIELDS[dataKey]
    )
    const countingStatsLabel = usedCountingStats.join(' / ')
    const computedStatsLabel = usedComputedStats.join(' / ')
    const chartKeys = Object.keys(COMPUTED_DATA_FIELDS)
      .concat(Object.keys(COUNTING_DATA_FIELDS))
      .filter(dataKey => !!transformedData[dataKey])

    return (
      <div className="line-chart-container" ref={this.setChartWidth}>
        <div className="chart-key-container">
          {chartKeys.map(dataKey => {
            return (
              <div className="chart-key" key={dataKey}>
                <span
                  style={{ backgroundColor: STAT_COLOR_MAP[dataKey] }}
                  className="key-color"
                >
                  {' '}
                </span>
                {dataKey}
              </div>
            )
          })}
        </div>
        <XYPlot
          width={this.state.chartWidth}
          height={500}
          xType="time"
          yDomain={yDomain}
          margin={{
            left: 75,
            top: 10,
            right: 75,
            bottom: 100,
          }}
        >
          {transformedDataKeys.map(dataKey => {
            const dataValues = transformedData[dataKey]
            return (
              <LineSeries
                key={dataKey}
                data={dataValues}
                color={STAT_COLOR_MAP[dataKey]}
              />
            )
          })}
          {Object.keys(transformedData).map(dataKey => {
            const dataValues = transformedData[dataKey]
            const dataValuesWithLabel = dataValues.map(dataValue => ({
              ...dataValue,
              x: Number(dataValue.x),
              timeframe: moment(dataValue.x).format('MMMM YYYY'),
              dataKey,
              displayValue: COMPUTED_DATA_FIELDS[dataKey]
                ? getComputedValueFromScaledValue(dataValue.y, maxCountedValue)
                : dataValue.y,
            }))

            return (
              <MarkSeries
                key={dataKey}
                data={dataValuesWithLabel}
                size={5}
                color={STAT_COLOR_MAP[dataKey]}
                onValueMouseOver={this.handleMouseOverPoint}
                onValueMouseOut={this.handleMouseOutPoint}
              />
            )
          })}
          <XAxis />
          {hasComputedValues && (
            <YAxis
              tickFormat={v => {
                return getComputedValueFromScaledValue(v, maxCountedValue)
              }}
              tickValues={computedAxisTicks}
            />
          )}
          <ChartLabel
            text="Month"
            className="line-chart-label"
            includeMargin={false}
            xPercent={0.45}
            yPercent={1.2}
          />
          <Crosshair
            values={[crosshairValue]}
            style={{ color: 'black' }}
            color="black"
          >
            {crosshairValue && (
              <div className="crosshair">
                <div>{crosshairValue.timeframe}</div>
                <div>{crosshairValue.dataKey}</div>
                <div>{crosshairValue.displayValue}</div>
              </div>
            )}
          </Crosshair>
          {hasComputedValues && (
            <ChartLabel
              text={computedStatsLabel}
              className="line-chart-label"
              includeMargin={false}
              xPercent={-0.11}
              yPercent={0.5 - computedStatsLabel.length * 0.0075}
              style={{
                transform: 'rotate(-90)',
                textAnchor: 'end',
              }}
            />
          )}
          {hasCountedValues && (
            <ChartLabel
              text={countingStatsLabel}
              className="line-chart-label"
              includeMargin={false}
              xPercent={hasComputedValues ? 1.11 : -0.11}
              yPercent={0.5 - countingStatsLabel.length * 0.0075}
              style={{
                transform: 'rotate(-90)',
                textAnchor: 'end',
              }}
            />
          )}
          {hasCountedValues && (
            <YAxis orientation={hasComputedValues ? 'right' : 'left'} />
          )}
        </XYPlot>
      </div>
    )
  }
}

export default LineChart
