import * as express from 'express';
import {createServer} from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
// import * as ejs from 'ejs';

let app = express();
let server = createServer(app);
let io = socketIo(server);

interface socketClient extends SocketIO.Socket {
    name: string;
}

// app.set('views','./client');
// app.engine('html',ejs.renderFile);
// app.set('view engine','html');

// app.use(express.static('./client'));

// app.get('/', (req, res) => {
//     res.render('index.html');
// });

app.set('view engine', 'pug');
app.set('views', './src/client');
app.use(express.static('./public'));
app.use('/', (req, res) => {
    res.render('index');
})

let onlineUsers = {};
let onlineCount = 0;

io.on('connection', (client: socketClient) => {
    console.log(client.conn.remoteAddress + ' connected!');
    /**
     * Listen User Join Room 
     */
    client.on('login', (obj) => {
        client.name = obj.userid;
        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;
        }

        io.emit('login', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
        console.log(`${obj.username} join Chat Room`);
    });
    /**
     * Listen on User Quit
     */
    client.on('disconnect', () => {
        if (onlineUsers.hasOwnProperty(client.name)) {
            var obj = { userid: client.name, username: onlineUsers[client.name] };

            delete onlineUsers[client.name];
            onlineCount--;

            io.emit('logout', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
            console.log(`${obj.username} leave Chat Room`);
        }
    });
    /**
     * Send Message
     */
    client.on('message', (obj) => {
        io.emit('message', obj);
        console.log(`${obj.username} say: ${obj.content}`);
    })
})

server.listen(8000, () => {
    console.log('Server running on port: 8000');
})