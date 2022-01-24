const pieceController = require("../controllers/piece.controller");

describe("test", () => {
    test("check piece id", () => {

        pieceController.checkPieceId('test').then((res) => {
            expect(res).toBe(true);
        });
    });

    test("check player id", () => {

        pieceController.checkPlayerId('test').then((res) => {
            expect(res).toBe(true);
        });
    });
    
    test("create and join piece", () => {

        pieceController.createPiece().then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "Wrong piece format" });
        });

        pieceController.createPiece({pieceId: 'test', playerName: 'testP1', id: 'test'}).then((res) => {
            expect(res.newPiece).toBe(true);
        });

        pieceController.createPiece({pieceId: 'test', playerName: 'testP2', id: 'test'}).then((res) => {
            expect(res.newPiece).toBe(false);
        });

        pieceController.createPiece({pieceId: 'test', playerName: 'testP3', id: 'test'}).then((res) => {
            expect(res.newPiece).toBe(false);
        });

        pieceController.pieceList().then((res) => {
            expect(res.length > 0 ? true : false).toBe(true);
        });

        pieceController.playerList().then((res) => {
            expect(res.length > 0 ? true : false).toBe(true);
        });

        pieceController.checkPieceId('test').then((res) => {
            expect(res).toBe(false);
        });

        pieceController.checkPieceId('test2').then((res) => {
            expect(res).toBe(true);
        });

        pieceController.checkPlayerId('testP1').then((res) => {
            expect(res).toBe(false);
        });

        pieceController.checkPlayerId('testPX').then((res) => {
            expect(res).toBe(true);
        });
    });
    
    test("start piece", () => {

        pieceController.startPiece().then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "Wrong piece format" });
        });

        pieceController.startPiece({pieceId: 'test2', playerName: 'testP1', id: 'test'}).then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "this piece doesn't exist" });
        });

        pieceController.changeGameMode().then((res) => {
            expect(res).toBe(null);
        })

        pieceController.changeGameMode({pieceId: 'test2', mode: '0'}).then((res) => {
            expect(res).toBe(null);
        });

        pieceController.changeGameMode({pieceId: 'test', mode: '0'}).then((res) => {
            expect(res).not.toBe(null);
        });

        pieceController.startPiece({pieceId: 'test', playerName: 'testP1', id: 'test'}).then((res) => {
            expect(res).not.toBe(null);
        });

        pieceController.createPiece({pieceId: 'test', playerName: 'testP4', id: 'test'}).then((res) => {
        })
        .catch((err) => {
            expect(err.success).toEqual("This piece is start, wait the end");
        });
    });
    
    test("new tetrominos", () => {

        pieceController.newTetrominos().then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "Wrong piece format" });
        });

        pieceController.newTetrominos({pieceId: 'test2'}).then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "this piece doesn't exist" });
        });

        pieceController.newTetrominos({pieceId: 'test'}).then((res) => {
            expect(res).not.toBe(null);
        });
    });
    
    test("update spectrum", () => {

        pieceController.updateSpectrum().then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "Wrong format" });
        });

        pieceController.updateSpectrum({pieceId: 'test2', player: {name: 'testP1', score: 100, game: {spectrum: []}}, score: 100}).then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "this piece doesn't exist" });
        });

        pieceController.updateSpectrum({pieceId: 'test', player: {name: 'testPX', score: 100, game: {spectrum: []}}, score: 100}).then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "this player doesn't exist" });
        });

        pieceController.updateSpectrum({pieceId: 'test', player: {name: 'testP1', score: 100, game: {spectrum: []}}, score: 100}).then((res) => {
            expect(res).not.toBe(null);
        });
    });
    
    test("update spectrum", () => {

        pieceController.getHardTetro({malus: 2}).then((res) => {
            expect(res).not.toBe(null);
        });
    });
    
    test("player lose", () => {

        pieceController.playerLose().then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "Wrong piece format" });
        });

        pieceController.playerLose({pieceId: 'test2', player: {name: 'testP1'}}).then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "this piece doesn't exist" });
        });

        pieceController.playerLose({pieceId: 'test', player: {name: 'testP1'}}).then((res) => {
            expect(res).not.toBe(null);
        });
    });
    
    test("leave piece", () => {

        pieceController.leavePiece().then((res) => {
        })
        .catch((err) => {
            expect(err).toEqual({ error: "Wrong piece format" });
        });

        // pieceController.leavePiece({pieceId: 'test2'}).then((res) => {
        // })
        // .catch((err) => {
        //     expect(err).toEqual({ error: "this piece doesn't exist" });
        // });

        pieceController.leavePiece({pieceId: 'test', playerName: 'testP1'}).then((res) => {
            expect(res).not.toBe(null);
        });

        pieceController.playerLose({pieceId: 'test', player: {name: 'testP2'}}).then((res) => {
            expect(res).not.toBe(null);
        });

        pieceController.leavePiece({pieceId: 'test', playerName: 'testP2'}).then((res) => {
            expect(res).not.toBe(null);
        });

        pieceController.playerLose({pieceId: 'test', player: {name: 'testP3'}}).then((res) => {
            expect(res).not.toBe(null);
        });

        pieceController.leavePiece({pieceId: 'test', playerName: 'testP3'}).then((res) => {
            expect(res).not.toBe(null);
        });
    });
  });