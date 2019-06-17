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
