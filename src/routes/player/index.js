import React from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'

import PlayerView from 'components/player-view'

function PlayerRoute(props) {
  const { players } = props
  return (
    <Switch>
      <Route
        path="/players/:playerId"
        render={props => (
          <PlayerView
            players={players}
            history={props.history}
            activePlayerId={props.match.params.playerId}
          />
        )}
      />
      <Redirect to={`/players/${Object.keys(props.players)[0]}`} />
    </Switch>
  )
}

export default PlayerRoute
