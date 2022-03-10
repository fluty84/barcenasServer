const app = require("./app");
const PORT = process.env.PORT || 5005;

const http = require("http");
const socketServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(socketServer, {
  cors: {
    origin: process.env.ORIGIN || "https://waiterhack.herokuapp.com",
    //"http://localhost:3000" local,
    methods: ["GET", "POST"],
  },
})

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

<<<<<<< HEAD
  socket.on('join_room', (data) => {
    socket.join(data)
    io.emit('join_room',  data); // This will emit the event to all connected sockets
  })

})


// Server.listen(3001, () => {
//   console.log(`Server Socket listening on port 80`);
// });
=======
//   socket.on('join_room', (data) => {
//     socket.join(data)
//     io.emit('join_room',  data); // This will emit the event to all connected sockets
//   })

// })
>>>>>>> 3945827416239605fe0ff7a81dd5bc1fbf6548f8

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})

// socketServer.listen(PORT, () => {
//   console.log(`Sockets on port ${PORT}`);
// })