const io = require('socket.io')(8000, {
    cors: {
        origin: "*",  // Allows access from all origins (for development, you can limit this in production)
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    console.log('A new user connected:', socket.id);
    socket.on('new-user-joined', name => {
        console.log("New user:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});
