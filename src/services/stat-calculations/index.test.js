import { calculateBattingAverage, calculateOnBasePercentage } from './index'

const games = [
  {
    hits: 0,
    totalBases: 0,
    walks: 1,
    hitByPitches: 0,
    atBats: 4,
    plateAppearances: 5,
  },
  {
    hits: 2,
    totalBases: 6,
    walks: 0,
    hitByPitches: 0,
    atBats: 4,
    plateAppearances: 4,
  },
  {
    hits: 1,
    totalBases: 1,
    walks: 1,
    hitByPitches: 1,
    atBats: 2,
    plateAppearances: 4,
  },
]

describe('test calculateBattingAverage', () => {
  it('should return the batting average from the games', () => {
    expect(calculateBattingAverage(games)).toEqual(3 / 10)
  })
})

describe('test calculateOnBasePercentage', () => {
  it('should return the OBP from the games', () => {
    expect(calculateOnBasePercentage(games)).toEqual(6 / 13)
  })
})
