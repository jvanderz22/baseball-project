// @flow

export const sumRow = (
  games: Array<GameData>,
  field: $keys<typeof GameData>
) => {
  return games.reduce((sum, game) => {
    return (sum += game[field])
  }, 0)
}

export const calculateBattingAverage = (games: GameData) => {
  const hits = sumRow(games, 'hits')
  const atBats = sumRow(games, 'atBats')
  return hits / atBats
}

export const calculateOnBasePercentage = (games: GameData) => {
  const hits = sumRow(games, 'hits')
  const walks = sumRow(games, 'walks')
  const hitByPitches = sumRow(games, 'hitByPitches')
  const plateAppearances = sumRow(games, 'plateAppearances')
  return (hits + walks + hitByPitches) / plateAppearances
}

export const calculateSluggingPercentage = (games: GameData) => {
  const totalBases = sumRow(games, 'totalBases')
  const plateAppearances = sumRow(games, 'plateAppearances')
  return totalBases / plateAppearances
}

export const calculateOPS = (games: GameData) => {
  const sluggingPercentage = calculateSluggingPercentage(games)
  const onBasePercentage = calculateOnBasePercentage(games)
  return sluggingPercentage + onBasePercentage
}
