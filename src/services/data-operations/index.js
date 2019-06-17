export const splitGamesByMonth = games => {
  const gamesByMonth = {}
  for (const game of games) {
    const month = game.gameDate.format('MMMM YYYY')
    if (gamesByMonth[month]) {
      gamesByMonth[month].push(game)
    } else {
      gamesByMonth[month] = [game]
    }
  }
  return gamesByMonth
}
