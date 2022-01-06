class HardTetromino {
    lock = false;
    position = { x: 3, y: 0, yMax: 0 };
    tetro = [0][0];
    constructor() {
        const tetroList = [
            [[0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]],
            [[1, 1, 1, 1], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
            [[1, 0, 0], [1, 1, 0], [0, 1, 1]],
            [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1]],
        ];
        this.tetroId = Math.floor(Math.random() * 4);
        this.tetro = tetroList[this.tetroId]; 
    }
}

module.exports = HardTetromino;