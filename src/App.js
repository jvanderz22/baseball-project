import React, { Component } from 'react'

import PlayerView from 'components/player-view'
import Navbar from 'components/navbar'
import { readData } from 'services/data'
import './App.scss'

class App extends Component {
  constructor(props) {
    super(props)
    const appData = readData()
    this.state = {
      appData,
    }
  }

  render() {
    const { appData } = this.state
    return (
      <div className="App">
        <Navbar />
        <div className="body">
          <PlayerView players={appData.players} />
        </div>
      </div>
    )
  }
}

export default App
