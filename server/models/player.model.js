const Game = require("./game.model");

class Player {
    id = "";
    name = "";
    pieceId = "";
    game = {};
    score = 0;
    delete = false;
    lose = false;
    win = false;
    constructor(pieceId, name, id) {
        this.pieceId = pieceId;
        this.name = name;
        this.id = id;
        this.game = new Game();
    }
}

module.exports = Player;