import "../socket.io/socket.io.js";
import Chat from "./chat.js";

class RoomService {
    players = []

    constructor () {
        this.socket = io();
    }

    connect(playerName) {

        this.socket.on("connect", () => {

            Chat.printMessage("Te has conectado a la sala. Escribe un mensaje!")
            this.socket.volatile.emit("arrived", playerName);

            this.socket.on("arrived", (e) => { this.onArrived(e) })            
            this.socket.on("message", (e) => { this.onMessage(e) })
            this.socket.on("playerleft", (e) => { this.onPlayerleft(e) })

            const formMessage = document.forms["form-message"];

            for (const element of formMessage.elements) {
                element.removeAttribute("disabled")
            }

            formMessage.addEventListener("submit", (e) => { this.sendMessage(e) });

            this.socket.on("disconnect", () => {
                for (const element of formMessage.elements) {
                    element.setAttribute("disabled", "")
                }

                formMessage.removeEventListener("submit", sendMessage);

                Chat.printMessage("Se ha perdido la conexion con la sala", "#f33")
                this.socket.off("arrived", socketEvents.arrived)
                this.socket.off("playerleft", socketEvents.playerleft);
                this.socket.off("message", socketEvents.message);
                this.socket.removeAllListeners("disconnect");
            })

        })
    }

    sendMessage(e) {
        e.preventDefault();
                    
        if (e.target.elements["message"].value.length < 1) return;
    
        this.socket.volatile.emit("message", e.target.elements["message"].value);
    
        e.target.reset();
    }
    
    updatePlayerList(players) {
        const playerList = document.getElementById("players");
    
        playerList.innerHTML = "";
    
        players.sort((a, b) => b.currentScore - a.currentScore);
    
        for (const player of players) {
            const li = document.createElement("li");
            const name = document.createElement("span")
            const score = document.createElement("span")
    
            name.textContent = player.name;
            score.textContent = player.currentScore;
    
            li.append(name, score)
    
            playerList.append(li)
        }
    }

    onArrived(e) {
        const {playerName, players} = JSON.parse(e);
        this.printMessage("El jugador " + playerName + " se ha conectado.");
        this.players = players;
        this.updatePlayerList(this.players)
    }
    onMessage(e) {
        const { playerName, message } = JSON.parse(e);
        Chat.printMessage(playerName + ": " + message);
    }
    onPlayerleft(e) {
        const {playerName} = JSON.parse(e);
        printMessage(playerName + " se ha ido.", "#f33");
        this.players = this.players.filter(player => player.name !== playerName);
        this.updatePlayerList(this.players);
    }
}

export default RoomService;