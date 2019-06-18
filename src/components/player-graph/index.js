// @flow

import React, { PureComponent, Fragment } from 'react'
import pickBy from 'lodash/pickBy'

import Checkbox from 'components/checkbox'
import LineChart from 'components/line-chart'
import { type GameData } from 'services/data'
import { splitGamesByMonth } from 'services/data-operations'
import {
  COMPUTED_DATA_FIELDS,
  COUNTING_DATA_FIELDS,
  DATA_FIELD_FUNC_MAP,
} from 'services/stat-calculations'

import './styles.scss'

type Props = {
  games: Array<GameData>,
}

type State = {
  displayOptions: {
    [option:
      | $Keys<typeof COMPUTED_DATA_FIELDS>
      | $Keys<typeof COUNTING_DATA_FIELDS>]: boolean,
  },
}

class Graph extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      displayOptions: {
        AVG: true,
      },
    }
  }

  _getMonthlyData = () => {
    const { displayOptions } = this.state
    const activeDataFields = pickBy(displayOptions, option => option === true)
    const dataContainer = Object.keys(activeDataFields).reduce(
      (data, dataField) => {
        data[dataField] = []
        return data
      },
      {}
    )
    const gamesByMonth = splitGamesByMonth(this.props.games)
    for (const month of Object.keys(gamesByMonth)) {
      const games = gamesByMonth[month]
      const dateMonth = new Date(month)
      for (const dataField of Object.keys(dataContainer)) {
        const monthlyDataFieldValue = DATA_FIELD_FUNC_MAP[dataField](games)
        dataContainer[dataField].push({
          x: dateMonth,
          y: monthlyDataFieldValue,
        })
      }
    }
    console.log('dataContainer', dataContainer)
    return dataContainer
  }

  handleOptionClick = (e: SyntheticEvent<HTMLInputElement>) => {
    const { dataField } = e.currentTarget.dataset
    this.setState({
      displayOptions: {
        ...this.state.displayOptions,
        [dataField]: !this.state.displayOptions[dataField],
      },
    })
  }

  render() {
    const { games } = this.props
    const { displayOptions } = this.state
    const monthlyData = this._getMonthlyData()
    return (
      <div className="player-graph-container">
        <div className="chart-container">
          <LineChart data={monthlyData} />
        </div>
        <div className="graph-options-container">
          <div className="graph-options-label">Graph Options</div>
          <div className="graph-options-subsection-container">
            <div className="graph-options-subsection-label">
              Counting Stats Options:
            </div>
            <div className="graph-options-checkbox-container">
              {Object.keys(COMPUTED_DATA_FIELDS).map(dataField => {
                return (
                  <div className="option-checkbox-container" key={dataField}>
                    <Checkbox
                      checked={!!displayOptions[dataField]}
                      label={dataField}
                      onChange={this.handleOptionClick}
                      data-data-field={dataField}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="graph-options-subsection-container">
            <div className="graph-options-subsection-label">
              Computed Stats Options:
            </div>
            <div className="graph-options-checkbox-container">
              {Object.keys(COUNTING_DATA_FIELDS).map(dataField => {
                return (
                  <div className="option-checkbox-container" key={dataField}>
                    <Checkbox
                      checked={!!displayOptions[dataField]}
                      label={dataField}
                      onChange={this.handleOptionClick}
                      data-data-field={dataField}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Graph
