// @flow

import React, { Component, Fragment } from 'react'
import moment from 'moment'
import debounce from 'lodash/debounce'
import {
  Crosshair,
  ChartLabel,
  XYPlot,
  XAxis,
  Hint,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  MarkSeries,
  AxisUtils,
  ScaleUtils,
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

const STAT_COLOR_CLASS_MAP = {
  AVG: 'blue',
  OBP: 'gray',
  SLG: 'orange',
  OPS: 'yellow',
  PA: 'lightblue',
  AB: 'green',
  H: 'red',
  HR: 'darkblue',
  BB: 'darkgray',
  SO: 'darkyellow',
  HBP: 'darkorange',
  SF: 'yellowgreen',
  TB: 'bluegreen',
  RBI: 'brown',
}

const getComputedValueFromScaledValue = (computedValue, maxScaleValue) => {
  return (computedValue / maxScaleValue / 3).toFixed(3)
}

class LineChart extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      crosshairValues: [],
    }
  }

  handleMouseOverPoint = debounce(e => {
    this.setState({
      crosshairValues: [{ ...e }],
    })
  }, 150)

  handleMouseOutPoint = debounce(() => {
    this.setState({
      crosshairValues: [],
    })
  }, 300)

  render() {
    const { data } = this.props
    const { crosshairValues } = this.state
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

    const renderableData = Object.keys(data).reduce((obj, dataKey) => {
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

    for (const dataKey of Object.keys(renderableData)) {
      const maxDataVal = maxBy(renderableData[dataKey], 'y').y
      if (maxDataVal > maxChartValue) {
        maxChartValue = maxDataVal
      }
    }

    const yDomain = hasCountedValues
      ? [0, maxChartValue]
      : [0, ceil(maxComputedValue, 1)]

    const tickTotal = ceil(maxComputedValue, 1) / 0.1 + 1
    let tickValues = []
    if (tickTotal > 0) {
      tickValues = [...Array(ceil(tickTotal, 1)).keys()].map(index => {
        return index * 0.1 * maxCountedValue * 3
      })
    }

    const usedCountingStats = Object.keys(renderableData).filter(
      dataKey => !!COUNTING_DATA_FIELDS[dataKey]
    )
    const usedComputedStats = Object.keys(renderableData).filter(
      dataKey => !!COMPUTED_DATA_FIELDS[dataKey]
    )
    const countingStatsLabel = usedCountingStats.join(' / ')
    const computedStatsLabel = usedComputedStats.join(' / ')
    return (
      <XYPlot
        width={675}
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
        {Object.keys(renderableData).map(dataFieldLabel => {
          const dataValues = renderableData[dataFieldLabel]
          return (
            <LineSeries
              key={dataFieldLabel}
              data={dataValues}
              color={STAT_COLOR_MAP[dataFieldLabel]}
            />
          )
        })}
        {Object.keys(renderableData).map(dataFieldLabel => {
          const dataValues = renderableData[dataFieldLabel]
          let calculatedValue = data
          const dataValuesWithLabel = dataValues.map(dataValue => ({
            ...dataValue,
            x: Number(dataValue.x),
            timeframe: moment(dataValue.x).format('MMMM YYYY'),
            dataFieldLabel,
            displayValue: COMPUTED_DATA_FIELDS[dataFieldLabel]
              ? getComputedValueFromScaledValue(dataValue.y, maxChartValue)
              : dataValue.y,
          }))

          return (
            <MarkSeries
              key={dataFieldLabel}
              data={dataValuesWithLabel}
              size={5}
              color={STAT_COLOR_MAP[dataFieldLabel]}
              onValueMouseOver={this.handleMouseOverPoint}
              onValueMouseOut={this.handleMouseOutPoint}
            />
          )
        })}
        {Object.keys(renderableData).map(dataFieldLabel => {
          const dataValues = renderableData[dataFieldLabel]
          const maxValue = maxBy(dataValues, 'y')
          let yLocation = 1 - maxValue.y / yDomain[1]
          if (yLocation < 0.05) {
            yLocation = 0.05
          }
          return (
            <ChartLabel
              text={dataFieldLabel}
              className={`line-chart-line-label ${STAT_COLOR_CLASS_MAP[dataFieldLabel]}`}
              key={dataFieldLabel}
              includeMargin={false}
              xPercent={dataValues.indexOf(maxValue) / dataValues.length}
              yPercent={yLocation}
            />
          )
        })}
        <XAxis />
        {hasComputedValues && (
          <YAxis
            tickFormat={v => {
              return getComputedValueFromScaledValue(v, maxCountedValue)
            }}
            tickValues={tickValues}
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
          values={this.state.crosshairValues}
          style={{ color: 'black' }}
          color="black"
        >
          {crosshairValues.length > 0 && (
            <div className="crosshair">
              <div>{crosshairValues[0].timeframe}</div>
              <div>{crosshairValues[0].dataFieldLabel}</div>
              <div>{crosshairValues[0].displayValue}</div>
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
    )
  }
}

export default LineChart
