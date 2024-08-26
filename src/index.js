const { Server } = require("socket.io");
const {createServer} = require("http")
const express = require("express");
const { join } = require("path");
const RoomService = require("./services/room");

const app = express();

app.use(express.static("public"))

const httpServer = createServer(app);


app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../public/index.html"))
})

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const room = new RoomService();

io.on("connection", (socket) => {
    socket.on("arrived", playerName => {
        let assignedName = room.addPlayer(socket.id, playerName);

        io.emit("arrived", JSON.stringify({assignedName, players: room.getAllPlayers()}))
    })

    socket.on("message", message => {
        io.emit("message", JSON.stringify({playerName: room.getPlayerName(socket.id), message}));
    })

    socket.on("disconnect", e => {
        const playerName = room.getPlayerName(socket.id)
        room.removePlayer(socket.id)

        io.emit("playerleft", JSON.stringify({
            playerName,
            players: room.getAllPlayers()
        }));
    })
})

httpServer.listen(3000, () => {
    console.log("Listening on port 3000");
});