// @flow

import React, { PureComponent, Fragment } from 'react'

import { type GameData } from 'services/data'
import { splitGamesByMonth } from 'services/data-operations'
import { DATA_FIELDS, DATA_FIELD_FUNC_MAP } from 'services/stat-calculations'

import './styles.scss'

type Props = {
  games: Array<GameData>,
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
              {Object.keys(DATA_FIELDS).map(dataField => (
                <th key={dataField}>{dataField} </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(gamesByMonth).map(month => {
              const games = gamesByMonth[month]
              return (
                <tr key={month}>
                  <td className="month-table-data"> {month} </td>
                  {Object.keys(DATA_FIELDS).map(dataField => {
                    const valueFunc = DATA_FIELD_FUNC_MAP[dataField]
                    const value = valueFunc(games)
                    return <td key={dataField}>{value}</td>
                  })}
                </tr>
              )
            })}
            <tr className="total-data-row">
              <td className="month-table-data"> Total </td>
              {Object.keys(DATA_FIELDS).map(dataField => {
                const valueFunc = DATA_FIELD_FUNC_MAP[dataField]
                const value = valueFunc(this.props.games)
                return <td key={dataField}>{value}</td>
              })}
            </tr>
          </tbody>
        </table>
      </Fragment>
    )
  }
}

export default PlayerTable
