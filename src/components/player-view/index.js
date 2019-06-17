import React, { Component } from 'react'

import PlayerTable from 'components/player-table'
import Graph from 'components/graph'

import './styles.scss'

class PlayerView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayValue: 'Graph',
    }
  }

  handleSelectPlayer = e => {
    const newPlayerId = e.target.value
    this.props.history.push(`/players/${newPlayerId}`)
  }

  handleSelectView = e => {
    this.setState({
      displayValue: e.target.value,
    })
  }

  render() {
    const { activePlayerId, players } = this.props
    const { displayValue } = this.state
    const selectedPlayer = players[activePlayerId]
    const imageSrc = selectedPlayer.imageSrc.replace('https', 'http')
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
          <div className="player-data-display-options-container">
            <div className="display-view-radio-container">
              <button
                className={
                  'radio-button ' + (displayValue === 'Graph' ? 'active' : '')
                }
                value="Graph"
                onClick={this.handleSelectView}
                onKeyPress={this.handleSelectView}
              >
                Graph
              </button>
              <button
                className={
                  'radio-button ' + (displayValue === 'Table' ? 'active' : '')
                }
                value="Table"
                onClick={this.handleSelectView}
                onKeyPress={this.handleSelectView}
              >
                Table
              </button>
            </div>
          </div>
          <div className="display-container">
            {displayValue === 'Graph' && (
              <Graph games={players[activePlayerId].gameData} />
            )}
            {displayValue === 'Table' && (
              <PlayerTable games={players[activePlayerId].gameData} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default PlayerView
