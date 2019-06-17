import React, { PureComponent, Fragment } from 'react'

import { splitGamesByMonth } from 'services/data-operations'
import {
  calculateOnBasePercentage,
  calculateBattingAverage,
  calculateSluggingPercentage,
  calculateOPS,
  sumRow,
} from 'services/stat-calculations'

import './styles.scss'

type Props = {
  games: Array<GameData>,
}

const DATA_KEYS = [
  'PA',
  'AB',
  'H',
  'HR',
  'BB',
  'SO',
  'HBP',
  'SF',
  'TB',
  'RBI',
  'AVG',
  'OBP',
  'SLG',
  'OPS',
]

const sumRowByKey = key => games => sumRow(games, key)

const DATA_KEY_FUNC_MAP = {
  PA: sumRowByKey('plateAppearances'),
  AB: sumRowByKey('atBats'),
  H: sumRowByKey('hits'),
  HR: sumRowByKey('homeRuns'),
  SO: sumRowByKey('strikeouts'),
  BB: sumRowByKey('walks'),
  HBP: sumRowByKey('hitByPitches'),
  SF: sumRowByKey('sacFlies'),
  TB: sumRowByKey('totalBases'),
  RBI: sumRowByKey('rbi'),
  AVG: games => calculateBattingAverage(games).toFixed(3),
  OBP: games => calculateOnBasePercentage(games).toFixed(3),
  SLG: games => calculateSluggingPercentage(games).toFixed(3),
  OPS: games => calculateOPS(games).toFixed(3),
}

class PlayerTable extends PureComponent<Props> {
  render() {
    const gamesByMonth = splitGamesByMonth(this.props.games)
    return (
      <Fragment>
        <table className="player-data-table">
          <thead>
            <tr>
              <th className="month-table-data"> Month </th>
              {DATA_KEYS.map(dataKey => (
                <th key={dataKey}>{dataKey} </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(gamesByMonth).map(month => {
              const games = gamesByMonth[month]
              return (
                <tr key={month}>
                  <td className="month-table-data"> {month} </td>
                  {DATA_KEYS.map(dataKey => {
                    const valueFunc = DATA_KEY_FUNC_MAP[dataKey]
                    const value = valueFunc(games)
                    return <td key={dataKey}>{value}</td>
                  })}
                </tr>
              )
            })}
            <tr className="total-data-row">
              <td className="month-table-data"> Total </td>
              {DATA_KEYS.map(dataKey => {
                const valueFunc = DATA_KEY_FUNC_MAP[dataKey]
                const value = valueFunc(this.props.games)
                return <td key={dataKey}>{value}</td>
              })}
            </tr>
          </tbody>
        </table>
      </Fragment>
    )
  }
}

export default PlayerTable
