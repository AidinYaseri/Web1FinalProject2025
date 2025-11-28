export const PLAYER_ONE = {
  playerId: "Jesse",
  totalScore: 0,
  totalHealth: 100,
  stats: {
    resilience: 50,
    exhaustion: 20,
    defense: 20,
    imagesrc: "../assets/jessy_avatar.jpg",
  },

  UpdateScore(increseNum) {
    return (this.totalScore += increseNum);
  },

  LoseHealth(attackAmount) {
    this.totalHealth -=
      (attackAmount * this.stats.exhaustion - this.stats.defence) /
      this.stats.resilience;
  },
};
export const PLAYER_TWO = {
  playerId: "Walter",
  totalScore: 0,
  totalHealth: 100,
  stats: {
    resilience: 20,
    exhaustion: 30,
    defense: 50,
    imagesrc: "../assets/walter_avatar.jpg",
  },
  UpdateScore(increseNum) {
    return (this.totalScore += increseNum);
  },

  LoseHealth(attackAmount) {
    this.totalHealth -=
      (attackAmount * this.stats.exhaustion - this.stats.defence) /
      this.stats.resilience;
  },
};
