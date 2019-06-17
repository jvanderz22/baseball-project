// @flow
//
import moment from 'moment'

import dataset1 from 'datasets/mlb-543063.json'
import dataset2 from 'datasets/mlb-547180.json'
import dataset3 from 'datasets/mlb-605137.json'

export type PlayerGameData = {
  id: string,
  fullName: string,
  imageSrc: string,
  gameDate: string,
  team: string,
  teamImage: string,
  opponent: string,
  opponentImage: string,
  plateAppearances: number,
  atBats: number,
  hits: number,
  homeRuns: number,
  walks: number,
  strikeouts: number,
  hitByPitches: number,
  sacFlies: number,
  totalBases: number,
  rbi: number,
}

export type GameData = {
  gameDate: string,
  team: string,
  teamImage: string,
  opponent: string,
  opponentImage: string,
  plateAppearances: number,
  atBats: number,
  hits: number,
  homeRuns: number,
  walks: number,
  strikeouts: number,
  hitByPitches: number,
  sacFlies: number,
  totalBases: number,
  rbi: number,
}

const EXPECTED_HEADER_ROW_ORDER = [
  'playerId',
  'fullName',
  'playerImage',
  'gameDate',
  'team',
  'teamImage',
  'opponent',
  'opponentImage',
  'PA',
  'AB',
  'H',
  'HR',
  'BB',
  'K',
  'HBP',
  'SF',
  'TB',
  'RBI',
]

const HEADER_KEY_MAPPING = {
  playerId: 'id',
  fullName: 'fullName',
  playerImage: 'imageSrc',
  gameDate: 'gameDate',
  team: 'team',
  teamImage: 'teamImageSrc',
  opponent: 'opponent',
  opponentImage: 'opponentImageSrc',
  PA: 'plateAppearances',
  AB: 'atBats',
  H: 'hits',
  HR: 'homeRuns',
  BB: 'walks',
  K: 'strikeouts',
  HBP: 'hitByPitches',
  SF: 'sacFlies',
  TB: 'totalBases',
  RBI: 'rbi',
}

const readPlayerGameData = (headers, rows): PlayerGameData => {
  for (const index of headers.keys()) {
    const headerName = headers[index].label
    const expectedHeader = EXPECTED_HEADER_ROW_ORDER[index]
    if (headerName !== expectedHeader) {
      const errorMessage = `Unexpected header at index ${index}. Header was ${headerName} but expected ${expectedHeader}`
      throw new Error(errorMessage)
    }
  }
  return rows.map(row => {
    const rowData = {}
    for (const cellIndex of row.keys()) {
      const dataKey = HEADER_KEY_MAPPING[EXPECTED_HEADER_ROW_ORDER[cellIndex]]
      const data = row[cellIndex]
      rowData[dataKey] = data
    }
    return rowData
  })
}

const DATASETS = [dataset1, dataset2, dataset3]

type AppData = {
  players: {
    [playerId: string]: {
      id: string,
      fullName: string,
      imageSrc: string,
      gameData: Array<GameData>,
    },
  },
}

export const readData = (): AppData => {
  const playerGameData = DATASETS.map(dataset =>
    readPlayerGameData(dataset.header, dataset.rows)
  )
  const players = playerGameData.reduce((playerData, playerGameData) => {
    const game = playerGameData[0]
    const { id, fullName, imageSrc } = game
    const gameData = playerGameData.map(playerGame => ({
      gameDate: moment(playerGame.gameDate),
      team: playerGame.team,
      teamImage: playerGame.teamImage,
      opponent: playerGame.opponent,
      opponentImage: playerGame.opponentImage,
      plateAppearances: playerGame.plateAppearances,
      atBats: playerGame.atBats,
      hits: playerGame.hits,
      homeRuns: playerGame.homeRuns,
      walks: playerGame.walks,
      strikeouts: playerGame.strikeouts,
      hitByPitches: playerGame.hitByPitches,
      sacFlies: playerGame.sacFlies,
      totalBases: playerGame.totalBases,
      rbi: playerGame.rbi,
    }))

    playerData[id] = {
      id,
      fullName,
      imageSrc,
      gameData,
    }
    return playerData
  }, {})
  return {
    players,
  }
}
