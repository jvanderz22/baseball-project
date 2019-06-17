import React, { PureComponent, Fragment } from 'react'

import LineChart from 'components/line-chart'
import { splitGamesByMonth } from 'services/data-operations'
import {
  calculateOnBasePercentage,
  calculateBattingAverage,
} from 'services/stat-calculations'

type Props = {
  games: Array<GameData>,
}

class Graph extends PureComponent<Props> {
  _getMonthlyData = () => {
    const monthlyData = []
    const gamesByMonth = splitGamesByMonth(this.props.games)
    console.log('gamesByMonth', gamesByMonth)
    for (const month of Object.keys(gamesByMonth)) {
      console.log('month', month)
      const games = gamesByMonth[month]
      const battingAverage = calculateBattingAverage(games)
      const onBasePercentage = calculateOnBasePercentage(games)
      monthlyData.push({ x: new Date(month), y: battingAverage })
    }
    return monthlyData
  }

  render() {
    const { games } = this.props
    const gamesData = {}
    const monthlyData = this._getMonthlyData()
    return (
      <Fragment>
        <LineChart data={monthlyData} />
      </Fragment>
    )
  }
}

export default Graph
