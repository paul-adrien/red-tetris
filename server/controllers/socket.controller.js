const pieceController = require("./piece.controller");

exports.socketController = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      pieceController.playerDisconnect(socket.id).then((res) => {
        console.log(res);
        if (res.piece === undefined) {
          pieceController.pieceList().then((res) => {
            io.emit("res piece list", res);
          });
        } else {
          io.emit("res player lose", res);
        }
      });
      console.log("user disconnected", socket.id);
    });

    socket.on("socketId", () => {
      return io.to(socket.id).emit("res socketId", socket.id);
    });
    //pieces
    socket.on("check piece id", (data) => {
      if (data && data.pieceId && data.id) {
        return pieceController.checkPieceId(data.pieceId).then((res) => {
          io.to(data.id).emit("res check piece id", res);
        });
      }
    });

    socket.on("create piece", async (data) => {
      if (data && !data.id) data.id = socket.id;
      pieceController.checkPieceId(data.pieceId).then((res1) => {
        pieceController.checkPlayerId(data.playerName).then((res2) => {
          if (res2 === true && res1 === true) {
            return pieceController
              .createPiece(data)
              .then((res3) => {
                if (res3.newPiece === true)
                  io.emit("updatePiece", { piece: res3.piece });
                if (res3.newPlayer === true)
                  io.emit("updatePlayer", {
                    piece: res3.piece,
                    player: res3.player,
                  });
                io.to(data.id).emit("res create piece", res3);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log(res2, res1);
            if (res2 === false)
              io.to(data.id).emit("res check player id", res2);
            if (res1 === false) io.to(data.id).emit("res check piece id", res1);
          }
        });
      });
    });

    socket.on("join piece", async (data) => {
      if (data && !data.id) data.id = socket.id;
      pieceController.checkPlayerId(data.playerName).then((res1) => {
        if (res1 === true) {
          return pieceController
            .createPiece(data)
            .then((res3) => {
              if (res3.newPiece === true)
                io.emit("updatePiece", { piece: res3.piece });
              if (res3.newPlayer === true)
                io.emit("updatePlayer", {
                  piece: res3.piece,
                  player: res3.player,
                });
              io.to(data.id).emit("res join piece", res3);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log(res1);
          if (res1 === false)
            io.to(data.id).emit("res check player join id", {
              status: res1,
              index: data.index,
            });
        }
      });
    });

    socket.on("piece list", async (data) => {
      return pieceController
        .pieceList()
        .then((res) => {
          console.log("piece list");
          io.to(data.id).emit("res piece list", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("leave piece", async (data) => {
      return pieceController
        .leavePiece(data)
        .then((res) => {
          if (res.piece === undefined) {
            pieceController.pieceList().then((res) => {
              io.emit("res piece list", res);
            });
          } else {
            io.emit("res player lose", res);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("start piece", async (data) => {
      console.log("start piece");
      return pieceController
        .startPiece(data)
        .then((res) => {
          io.emit("res start piece", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("player lose", async (data) => {
      console.log("player lose", data);
      return pieceController
        .playerLose(data)
        .then((res) => {
          io.emit("res player lose", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("new tetrominos", async (data) => {
      return pieceController
        .newTetrominos(data)
        .then((res) => {
          io.emit("res new tetrominos", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("send spectrum", async (data) => {
      return pieceController
        .updateSpectrum(data)
        .then((res) => {
          io.emit("res send spectrum", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("malus", async (data) => {
      console.log("malus");
      io.emit("res malus", data);
    });

    socket.on("malus hardcore", async (data) => {
      return pieceController
        .getHardTetro(data)
        .then((res) => {
          if (res != null) io.to(data.id).emit("res malus hardcore", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    socket.on("change mode", async (data) => {
      return pieceController
        .changeGameMode(data)
        .then((res) => {
          if (res != null) io.emit("res change mode", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    //players
    socket.on("check player id", (data) => {
      if (data && data.playerId) {
        return pieceController.checkPlayerId(data.playerId).then((res) => {
          io.to(data.id).emit("res check player id", res);
        });
      }
    });

    socket.on("player list", async (data) => {
      return pieceController
        .playerList()
        .then((res) => {
          io.to(data.id).emit("res player list", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
};
