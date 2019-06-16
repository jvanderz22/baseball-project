import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import Navbar from 'components/navbar'
import PlayerRoute from 'routes/player'
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
          <Router>
            <Switch>
              <Route
                path="/players/"
                render={() => <PlayerRoute players={appData.players} />}
              />
              <Redirect to="/players" />
            </Switch>
          </Router>
        </div>
      </div>
    )
  }
}

export default App
