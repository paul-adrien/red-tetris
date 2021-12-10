const http = require('http');
const app = require('./app');
const socketController = require('./controllers/socket.controller');

app.set('port', 8080);

const server = http.createServer(app);
const options = {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
        allowEIO3: true
    },
};
const io = require('socket.io')(server, options);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + 8080;
    console.log('Listening on ' + bind);
});

socketController.socketController(io);

server.listen(8080, () => {
    console.log(`Server is running on port 8080.`);
});