import React, { Component } from 'react'

import Graph from 'components/graph'

import './styles.scss'

class PlayerView extends Component {
  handleSelectPlayer = e => {
    const newPlayerId = e.target.value
    this.props.history.push(`/players/${newPlayerId}`)
  }

  render() {
    const { activePlayerId, players } = this.props
    console.log('this.props', this.props)
    const selectedPlayer = players[activePlayerId]
    const imageSrc = selectedPlayer.imageSrc.replace('https', 'http')
    console.log('imageSrc', imageSrc)
    console.log('selectedPlayer', selectedPlayer)
    return (
      <div className="player-view-container">
        <div className="player-view-header">
          <div className="player-info-container">
            <div className="player-name">{selectedPlayer.fullName}</div>
            <div>
              <img src={imageSrc} alt="" />
            </div>
          </div>
          <div className="player-select-container">
            <select
              name="Select a player"
              value={activePlayerId}
              onChange={this.handleSelectPlayer}
            >
              {Object.values(players).map(player => {
                return (
                  <option key={player.id} value={player.id}>
                    {player.fullName}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <div className="player-data-container">
          <Graph games={players[activePlayerId].gameData} />
        </div>
      </div>
    )
  }
}

export default PlayerView
