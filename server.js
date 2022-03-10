const app = require("./app");
const PORT = process.env.PORT || 5005;

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN || "https://waiterhack.herokuapp.com",
    //"http://localhost:3000" local,
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on('join_room', (data) => {

    socket.join(data)

    io.emit('join_room', data); // This will emit the event to all connected sockets
  })

})

server.listen(PORT, () => {
  console.log(`Server Socket listening on port 80`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
})
