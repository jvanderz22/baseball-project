import React, { PureComponent } from 'react'

import {
  calculateOnBasePercentage,
  calculateBattingAverage,
} from 'services/stat-calculations'

type Props = {
  games: Array<GameData>,
}

class Graph extends PureComponent<Props> {
  render() {
    const { games } = this.props
    console.log('games', games)
    const battingAverage = calculateBattingAverage(games)
    const onBasePercentage = calculateOnBasePercentage(games)
    console.log('onBasePercentage', onBasePercentage)
    return (
      <div>
        My Graph
        <div>battingAverage: {battingAverage}</div>
      </div>
    )
  }
}

export default Graph
