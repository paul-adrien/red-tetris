const Piece = require('../models/piece.model')
const Player = require('../models/player.model');
const Tetromino = require('../models/tetromino.model');
const Game = require('../models/game.model');

const pieceList = [];
const playerList = [];

exports.checkPieceId = async (pieceId) => {
    return new Promise((res, rej) => {
        if (pieceList.length == 0) {
            res(true);
        } else if (pieceList.map((p) => { return p.id }).indexOf(pieceId) != -1) {
            res(false);
        } else {
            res(true);
        }
    })
}

exports.pieceList = async () => {
    return new Promise((res, rej) => {
        res(pieceList)
    })
}

exports.createPiece = async (piece) => {
    return new Promise((res, rej) => {
        if (!piece || !piece.pieceId || !piece.playerName || !piece.id)
            rej({ error: 'Wrong piece format' });
        else {
            const pieceIndex = pieceList.map((p) => { return p.id }).indexOf(piece.pieceId)
            if (pieceIndex != -1) {
                pieceList[pieceIndex].playersId.push(piece.playerName);
                if (pieceList[pieceIndex].creator === '')
                    pieceList[pieceIndex].creator = piece.playerName;
                if ((playerIndex = playerList.map((p) => { return p.name }).indexOf(piece.playerName)) == -1) {
                    var player = new Player(piece.pieceId, piece.playerName, piece.id);
                    playerList.push(player);
                    var newPlayer = true;
                } else {
                    var player = playerList[playerIndex];
                    var newPlayer = false;
                }
                res({ success: 'This piece as been joined', piece: pieceList[pieceIndex], player: player, newPiece: false, newPlayer: newPlayer })
            } else {
                const newPiece = new Piece(piece.pieceId);
                newPiece.playersId = [piece.playerName];
                newPiece.creator = piece.playerName;
                pieceList.push(newPiece);
                if ((playerIndex = playerList.map((p) => { return p.name }).indexOf(piece.playerName)) == -1) {
                    var player = new Player(piece.pieceId, piece.playerName, piece.id);
                    playerList.push(player);
                    var newPlayer = true;
                } else {
                    var player = playerList[playerIndex];
                    var newPlayer = false;
                }
                res({ success: 'This piece as been created', piece: newPiece, player: player, newPiece: true, newPlayer: newPlayer })
            }
        }
    })
}

exports.leavePiece = async (piece) => {
    console.log(piece)
    return new Promise((res, rej) => {
        if (!piece || !piece.pieceId || !piece.playerName)
            rej({ error: 'Wrong piece format' });
        else {
            const pieceIndex = pieceList.map((p) => { return p.id }).indexOf(piece.pieceId);
            const playerIndex = playerList.map((p) => { return p.name }).indexOf(piece.playerName);
            playerList[playerIndex].delete = true;
            if (pieceList[pieceIndex].playersId.length > 1) {//multi
                pieceList[pieceIndex].nbPlayersInGame--;
                pieceList[pieceIndex].playersId.splice(pieceList[pieceIndex].playersId.indexOf(piece.playerName), 1);
                if (pieceList[pieceIndex].creator === piece.playerName) {
                    pieceList[pieceIndex].creator = piece.playerName;
                }
                if (pieceList[pieceIndex].nbPlayersInGame < 2) {
                    pieceList[pieceIndex].nbPlayersInGame = 0;
                    pieceList[pieceIndex].start = 0;
                    res({ piece: pieceList[pieceIndex], player: playerList[playerIndex] })
                } else {
                    res({ piece: pieceList[pieceIndex], player: playerList[playerIndex] })
                }
            } else {//solo
                pieceList.splice(pieceIndex, 1);
                playerList[playerIndex].delete = true;
                res({ piece: pieceList[pieceIndex], player: playerList[playerIndex] })
            }
        }
    })
}

async function createTetrominos(pieceIndex) {
    return new Promise((res, rej) => {
        if (pieceIndex != -1) {
            i = 0;
            while (i < 10) {
                if (pieceList[pieceIndex].tetroList === undefined)
                    pieceList[pieceIndex].tetroList[0] = new Tetromino;
                else
                    pieceList[pieceIndex].tetroList.push(new Tetromino);
                i++;
            }
            if (i == 10)
                res({ piece: pieceList[pieceIndex] });
        } else {
            rej({ error: "this piece doesn't exist" });
        }
    })
}

async function getSpectrums(pieceIndex) {
    return new Promise((res, rej) => {
        if (pieceIndex != -1) {
            i = 0;
            j = pieceList[pieceIndex].playersId.length;
            var players = [];
            while (i < j) {
                let playerIndex = playerList.map((p) => { return p.name }).indexOf(pieceList[pieceIndex].playersId[i]);
                if (playerIndex != -1) {
                    playerList[playerIndex].game = new Game;
                    if (players === undefined)
                        players[0] = playerList[playerIndex];
                    else
                        players.push(playerList[playerIndex])
                }
                i++;
            }
            if (i == j)
                res({ players });
        } else {
            rej({ error: "this piece doesn't exist" });
        }
    })
}

async function delSpectrums(pieceIndex) {
    return new Promise((res, rej) => {
        if (pieceIndex != -1) {
            i = 0;
            j = pieceList[pieceIndex].playersId.length;
            var players = [];
            while (i < j) {
                let playerIndex = playerList.map((p) => { return p.name }).indexOf(pieceList[pieceIndex].playersId[i]);
                if (playerIndex != -1) {
                    if (players === undefined) {
                        for (let i = 0; i < 22; i++) {
                            playerList[playerIndex].game.spectrum[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        };
                    }
                    else {
                        for (let i = 0; i < 22; i++) {
                            playerList[playerIndex].game.spectrum[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        };
                    }
                }
                i++;
            }
            if (i == j)
                res({ players });
        } else {
            rej({ error: "this piece doesn't exist" });
        }
    })
}

exports.newTetrominos = async (data) => {
    return new Promise((res, rej) => {
        if (!data || !data.pieceId)
            rej({ error: 'Wrong piece format' });
        else {
            const pieceIndex = pieceList.map((p) => { return p.id }).indexOf(data.pieceId);
            if (pieceIndex != -1) {
                pieceList[pieceIndex].start = true;
                createTetrominos(pieceIndex).then((piece) => {
                    res({ piece: pieceList[pieceIndex] });
                }).catch((err) => { rej(err) })
            } else {
                rej({ error: "this piece doesn't exist" });
            }
        }
    })
}

exports.startPiece = async (data) => {
    return new Promise((res, rej) => {
        if (!data || !data.pieceId || !data.playerName)
            rej({ error: 'Wrong piece format' });
        else {
            const pieceIndex = pieceList.map((p) => { return p.id }).indexOf(data.pieceId);
            if (pieceIndex != -1) {
                pieceList[pieceIndex].start = true;
                pieceList[pieceIndex].nbPlayersInGame = pieceList[pieceIndex].playersId.length;
                createTetrominos(pieceIndex).then((piece) => {
                    getSpectrums(pieceIndex).then((players) => {
                        console.log(players)
                        res({ piece: pieceList[pieceIndex], players: players.players })
                    })
                }).catch((err) => { rej(err) })
            } else {
                rej({ error: "this piece doesn't exist" });
            }
        }
    })
}

exports.playerLose = async (data) => {
    return new Promise((res, rej) => {
        if (!data || !data.pieceId || !data.player)
            rej({ error: 'Wrong piece format' });
        else {
            const pieceIndex = pieceList.map((p) => { return p.id }).indexOf(data.pieceId);
            if (pieceIndex != -1) {
                if (pieceList[pieceIndex].playersId.length > 1) {//multi
                    pieceList[pieceIndex].nbPlayersInGame--;
                    const playerIndex = playerList.map((p) => { return p.name }).indexOf(data.player.name);
                    playerList[playerIndex].lose = true;
                    if (pieceList[pieceIndex].nbPlayersInGame < 2) {
                        pieceList[pieceIndex].nbPlayersInGame = 0;
                        pieceList[pieceIndex].start = 0;
                        res({ piece: pieceList[pieceIndex], player: playerList[playerIndex] })
                    } else {
                        res({ piece: pieceList[pieceIndex], player: playerList[playerIndex] })
                    }
                } else {//solo
                    pieceList[pieceIndex].nbPlayersInGame = 0;
                    pieceList[pieceIndex].start = 0;
                    res({ piece: pieceList[pieceIndex], player: playerList[playerIndex] })
                }
            } else {
                rej({ error: "this piece doesn't exist" });
            }
        }
    })
}

exports.updateSpectrum = async (data) => {
    return new Promise((res, rej) => {
        if (!data || !data.pieceId || !data.player)
            rej({ error: 'Wrong format' });
        else {
            const pieceIndex = pieceList.map((p) => { return p.id }).indexOf(data.pieceId);
            if (pieceIndex != -1) {
                const playerIndex = pieceList[pieceIndex].playersId.indexOf(data.player.name);
                playerList[playerIndex].game.spectrum = data.player.game.spectrum;
                res({ pieceId: data.pieceId, player: data.player })
            } else {
                rej({ error: "this piece doesn't exist" });
            }
        }
    })
}

exports.checkPlayerId = async (playerId) => {
    console.log(playerList)
    return new Promise((res, rej) => {
        if (playerList.length == 0) {
            res(true);
        } else {
            var check = playerList.filter((p) => { return p.delete === false }).every(player => {
                if (player.name === playerId)
                    return false;
                else
                    return true;
            });
            res(check);
        }
    })
}

exports.playerList = async () => {
    return new Promise((res, rej) => {
        res(playerList)
    })
}

exports.playerDisconnect = async (socketId) => {
    return new Promise((res, rej) => {
        const playerIndex = playerList.map((p) => { return p.id }).indexOf(socketId)
        if (playerIndex != -1 && playerList[playerIndex].delete === false) {
            playerList[playerIndex].delete = true;
            pieceList.map((p) => {
                if (p.playersId.length > 0) {
                    let pIndex = p.playersId.indexOf(playerList[playerIndex].name);
                    if (pIndex != -1) {
                        p.playersId.splice(pIndex, 1);
                        p.nbPlayersInGame - 1;
                        if (pieceList[pieceIndex].nbPlayersInGame < 2) {
                            pieceList[pieceIndex].nbPlayersInGame = 0;
                            pieceList[pieceIndex].start = 0;
                        }
                        if (p.creator === playerList[playerIndex].name && p.playersId.length >= 1)
                            p.creator = p.playersId[0];
                        else
                            p.creator = '';
                    }
                }
            })
            res(pieceList)
        };
    })
}

//module.exports = pieceList;