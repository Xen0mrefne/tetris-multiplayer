class Player {
    id;
    name;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class RoomService {
    players;

    constructor() {
        this.players = [];
    }

    addPlayer(id, name) {
        let playerName = name;

        let numClone = 1;
        while (this.nameAlreadyExists(playerName)) {
            playerName = name + " (" + numClone + ")"
            numClone++
        }

        this.players.push(new Player(id, playerName));
        return playerName;
    }

    removePlayer(id) {
        this.players = this.players.filter(player => player.id !== id);
    }

    nameAlreadyExists(name) {
        if (this.players.find(player => player.name === name)) return true; else return false;
    }

    getPlayerName(id) {
        return this.players.find(player => player.id = id).name;
    }

    getAllPlayers() {
        return this.players.map(player => {
            return {
                name: player.name
            }
        });
    }
}

module.exports = RoomService;