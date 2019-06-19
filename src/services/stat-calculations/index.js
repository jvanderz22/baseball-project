// @flow

import { type GameData } from 'services/data'

export const sumRow = (
  games: Array<GameData>,
  field: $Keys<GameData>
): number => {
  return games.reduce((sum, game) => {
    return Number((sum += game[field]))
  }, 0)
}

export const calculateBattingAverage = (games: Array<GameData>) => {
  const hits = sumRow(games, 'hits')
  const atBats = sumRow(games, 'atBats')
  return hits / atBats
}

export const calculateOnBasePercentage = (games: Array<GameData>) => {
  const hits = sumRow(games, 'hits')
  const walks = sumRow(games, 'walks')
  const hitByPitches = sumRow(games, 'hitByPitches')
  const plateAppearances = sumRow(games, 'plateAppearances')
  return (hits + walks + hitByPitches) / plateAppearances
}

export const calculateSluggingPercentage = (games: Array<GameData>) => {
  const totalBases = sumRow(games, 'totalBases')
  const plateAppearances = sumRow(games, 'plateAppearances')
  return totalBases / plateAppearances
}

export const calculateOPS = (games: Array<GameData>) => {
  const sluggingPercentage = calculateSluggingPercentage(games)
  const onBasePercentage = calculateOnBasePercentage(games)
  return sluggingPercentage + onBasePercentage
}

const sumRowByKey = (key: $Keys<GameData>) => (games: Array<GameData>) =>
  sumRow(games, key)

export const COMPUTED_DATA_FIELDS = {
  AVG: 'AVG',
  OBP: 'OBP',
  SLG: 'SLG',
  OPS: 'OPS',
}

export const COUNTING_DATA_FIELDS = {
  PA: 'PA',
  AB: 'AB',
  H: 'H',
  HR: 'HR',
  BB: 'BB',
  SO: 'SO',
  HBP: 'HBP',
  SF: 'SF',
  TB: 'TB',
  RBI: 'RBI',
}

export const DATA_FIELDS = {
  ...COMPUTED_DATA_FIELDS,
  ...COUNTING_DATA_FIELDS,
}

/* Maps a data key to a function to calculate it for a set of games */
export const DATA_FIELD_FUNC_MAP = {
  PA: sumRowByKey('plateAppearances'),
  AB: sumRowByKey('atBats'),
  H: sumRowByKey('hits'),
  HR: sumRowByKey('homeRuns'),
  SO: sumRowByKey('strikeouts'),
  BB: sumRowByKey('walks'),
  HBP: sumRowByKey('hitByPitches'),
  SF: sumRowByKey('sacFlies'),
  TB: sumRowByKey('totalBases'),
  RBI: sumRowByKey('rbi'),
  AVG: (games: Array<GameData>) => calculateBattingAverage(games).toFixed(3),
  OBP: (games: Array<GameData>) => calculateOnBasePercentage(games).toFixed(3),
  SLG: (games: Array<GameData>) =>
    calculateSluggingPercentage(games).toFixed(3),
  OPS: (games: Array<GameData>) => calculateOPS(games).toFixed(3),
}
