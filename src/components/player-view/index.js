// @flow

import React, { Component } from 'react'

import PlayerGraph from 'components/player-graph'
import PlayerTable from 'components/player-table'
import { type PlayerData } from 'services/data'

import './styles.scss'

type Props = {
  players: PlayerData,
  activePlayerId: string,
  history: {
    push: (newUrl: string) => void,
  },
}

type State = {
  displayValue: 'Graph' | 'Table',
}

class PlayerView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      displayValue: 'Graph',
    }
  }

  handleSelectPlayer = (e: SyntheticEvent<HTMLSelectElement>) => {
    const newPlayerId = e.currentTarget.value
    this.props.history.push(`/players/${newPlayerId}`)
  }

  handleSelectView = (e: SyntheticEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget
    if (value === 'Graph' || value === 'Table') {
      this.setState({
        displayValue: value,
      })
    }
  }

  render() {
    const { activePlayerId, players } = this.props
    const { displayValue } = this.state
    const selectedPlayer = players[activePlayerId]
    return (
      <div className="player-view-container">
        <div className="player-view-header">
          <div className="player-info-container">
            <div className="player-name">{selectedPlayer.fullName}</div>
            <div>
              <img src={selectedPlayer.imageSrc} alt="" />
            </div>
          </div>
          <div className="player-select-container">
            <select
              name="Select a player"
              value={activePlayerId}
              onChange={this.handleSelectPlayer}
            >
              {Object.keys(players).map(playerId => {
                const player = players[playerId]
                return (
                  <option key={playerId} value={playerId}>
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
              <PlayerGraph games={players[activePlayerId].gameData} />
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
