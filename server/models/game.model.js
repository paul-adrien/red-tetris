class Game {
  spectrum = [];
  score = 0;
  tetrominosNumber = 0;
  constructor() {
    for (let i = 0; i < 20; i++) {
      this.spectrum[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  }
}

module.exports = Game;
