import React, { Component } from 'react'

import Graph from 'components/graph'

import './styles.scss'

class PlayerView extends Component {
  constructor(props) {
    super(props)
    const { players } = props
    const selectedPlayerId = Object.keys(players)[0]
    this.state = {
      selectedPlayerId,
    }
  }

  handleSelectPlayer = e => {
    this.setState({
      selectedPlayerId: e.target.value,
    })
  }

  render() {
    const { players } = this.props
    const { selectedPlayerId } = this.state
    const selectedPlayer = players[selectedPlayerId]
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
              value={selectedPlayerId}
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
          <Graph games={players[selectedPlayerId].gameData} />
        </div>
      </div>
    )
  }
}

export default PlayerView
