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
	PlayMove(clint, x, y, type){
		this.board[x][y] = type;
		console.log(this.board);
		
	},
};

Server.start(Game);