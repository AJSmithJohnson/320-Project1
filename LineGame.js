const Server = require('./Server.js').Server;
const PacketBuilder = require("./packet-build.js").PacketBuilder;

const Game = {
	whoseTurn: 1,
	whoHasWon: 0,
	board: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0],
	],

	clientA:null,
	clientB:null,
	PlayMove(client, x, y, type){
		//console.log(x);
		//console.log(y);
		this.board[y][x] = type;
		console.log(this.board);
		this.checkStateAndUpdate(x, y, type);
	},
	checkStateAndUpdate(x, y, type){
		//Look for game over
		//TODO send update packet to everyone
		const packet = PacketBuilder.update(this, x, y, type);
		Server.broadcastPacket(packet);
	},
};

Server.start(Game);