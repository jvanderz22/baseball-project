// @flow

import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import Navbar from 'components/navbar'
import PlayerRoute from 'routes/player'
import { readData, type AppData } from 'services/data'

import './styles.scss'

type Props = {}
type State = {
  appData: AppData,
}

class App extends Component<Props, State> {
  constructor(props: Props) {
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
          <div className="content-container">
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
      </div>
    )
  }
}

export default App
