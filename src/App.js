import React, { Component } from 'react'

import Graph from 'components/graph'
import { readData } from 'services/data'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    const appData = readData()
    const selectedPlayer = Object.keys(appData.players)[0]
    console.log('appData', appData)
    console.log('selectedPlayer', selectedPlayer)
    this.state = {
      appData,
      selectedPlayer,
    }
  }

  handleSelectPlayer = e => {
    this.setState({
      selectedPlayer: e.target.value,
    })
  }

  render() {
    const { appData, selectedPlayer } = this.state
    const { players } = appData
    return (
      <div className="App">
        <select value={selectedPlayer} onChange={this.handleSelectPlayer}>
          {Object.values(players).map(player => {
            return (
              <option key={player.id} value={player.id}>
                {player.fullName}
              </option>
            )
          })}
        </select>
        <div>
          <Graph games={players[selectedPlayer].gameData} />
        </div>
      </div>
    )
  }
}

export default App
