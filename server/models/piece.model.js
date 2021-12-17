const Tetromino = require("./tetromino.model");

class Piece {
    id = "";
    playersId = [""];
    nbPlayersInGame = 0;
    creator = "";
    start = false;
    pause = false;
    tetroList = [];
    mode = 0;
    constructor(pieceId) {
        this.id = pieceId;
    }
}

module.exports = Piece;