//const axios = require("axios");
var io = require('socket.io-client');

var base_url = "http://localhost:8080"

userTest = {
    
};

userInviteTest = {
    
};

socketId = '';

describe("test", function () {

    var socket;

    beforeAll(() => {
        socket = io(base_url);
    });

    afterAll(() => {
        if (socket.connected) {
            socket.disconnect();
        } else {
        }
    });

    it('socketId', (done) => {
        socket.emit('socketId');

        socket.once('res socketId', (data) => {
            socketId = data;
            expect(socketId).not.toEqual(null);
            done();
        });
    });

    it('check piece id', (done) => {
        socket.emit('check piece id', { pieceId: 'test', id: socketId});

        socket.once('res check piece id', (data) => {
            // console.log(data)
            expect(data).toEqual(true);
            done();
        });
    });

    it('check player id', (done) => {
        socket.emit('check player id', { playerId: 'test', id: socketId});

        socket.once('res check player id', (data) => {
            // console.log(data)
            expect(data).toEqual(true);
            done();
        });
    });

    it('player list', (done) => {
        socket.emit('player list', { id: socketId});

        socket.once('res player list', (data) => {
            // expect(data).toEqual([]);
            done();
        });
    });

    it('piece list', (done) => {
        socket.emit('piece list', { id: socketId});

        socket.once('res piece list', (data) => {
            // expect(data).toEqual([]);
            done();
        });
    });

    it('create piece', (done) => {
        socket.emit('create piece', { pieceId: 'test', playerName: 'test', id: socketId});

        socket.once('res create piece', (data) => {
            expect(data).not.toEqual([]);
            done();
        });

        socket.once('res check piece id', (data) => {
            expect(data).toEqual(false);
            done();
        });

        socket.once('res check player id', (data) => {
            expect(data).toEqual(false);
            done();
        });
    });

    it('player list', (done) => {
        socket.emit('player list', { id: socketId});

        socket.once('res player list', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('piece list', (done) => {
        socket.emit('piece list', { id: socketId});

        socket.once('res piece list', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('create piece', (done) => {
        socket.emit('create piece', { pieceId: 'test', playerName: 'test', id: socketId});

        socket.once('res create piece', (data) => {
            // console.log(data)
            // expect(data).toEqual([]);
            done();
        });

        socket.once('res check piece id', (data) => {
            expect(data).toEqual(false);
            done();
        });

        socket.once('res check player id', (data) => {
            expect(data).toEqual(false);
            done();
        });
    });

    it('join piece', (done) => {
        socket.emit('join piece', { pieceId: 'test', playerName: 'test2', id: socketId});

        socket.once('res join piece', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('leave piece', (done) => {
        socket.emit('leave piece', { pieceId: 'test', playerName: 'test2', id: socketId});

        socket.once('res player lose', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('join piece', (done) => {
        socket.emit('join piece', { pieceId: 'test', playerName: 'test2', id: socketId});

        socket.once('res join piece', (data) => {
            // console.log(data)
            expect(data).not.toEqual([]);
            done();
        });

        socket.once('res check player join id', (data) => {
            // console.log(data)
            expect(data).toEqual({ status: false });
            done();
        });
    });

    it('start piece', (done) => {
        socket.emit('start piece', { pieceId: 'test', playerName: 'test2', id: socketId});

        socket.once('res start piece', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('join piece', (done) => {
        socket.emit('join piece', { pieceId: 'test', playerName: 'test2', id: socketId});

        socket.once('res join piece', (data) => {
            expect(data).not.toEqual([]);
            done();
        });

        socket.once('res check player join id', (data) => {
            // console.log(data)
            expect(data).toEqual({ status: false });
            done();
        });
    });

    it('new tetrominos', (done) => {
        socket.emit('new tetrominos', { pieceId: 'test'});

        socket.once('res new tetrominos', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('send spectrum', (done) => {
        socket.emit('send spectrum', { pieceId: 'test', player: { name: 'test2', game: { spectrum: [[]]}}});

        socket.once('res send spectrum', (data) => {
            // console.log(data)
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('malus', (done) => {
        socket.emit('malus', { pieceId: 'test', player: { name: 'test2', game: { spectrum: [[]]}}});

        socket.once('res malus', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('leave piece', (done) => {
        socket.emit('leave piece', { pieceId: 'test', playerName: 'test2', id: socketId});

        socket.once('res player lose', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });

    it('leave piece', (done) => {
        socket.emit('leave piece', { pieceId: 'test', playerName: 'test', id: socketId});

        socket.once('res player lose', (data) => {
            expect(data).not.toEqual([]);
            done();
        });
    });
})