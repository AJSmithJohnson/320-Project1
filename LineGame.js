const Server = require('./Server.js').Server;
const PacketBuilder = require("./packet-build.js").PacketBuilder;

const Game = {
	whoseTurn: 1,
	whoHasWon: 0,
	moves: 0,
	checks: 0,
	board: [
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1, x = 1, and y = 3 x = 1
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1 x =3,   and y = 3 x = 3
		[5, 0, 5, 0, 5],
	],

	clientA:null,
	clientB:null,
	PlayMove(client, x, y, type){
		console.log(this.board[1][1]);
		console.log(this.board[3][1]);
		console.log(this.board[1][3]);
		console.log(this.board[3][3]);
		if(type == 5 || type == 3){
			//TODO: send a packet that notifies the client that they need to 
			//actually select a horizontal or vertical line space
			this.moves += 1;
		}
		else if(type < 3 && type >0)
		{
			this.moves += 1;
			this.board[y][x] = type;
			console.log(this.board);
			if(this.checkFor1stSpotScore() == 1){
				const packet = PacketBuilder.scoreAndUpdate(this, y, x, type, 1, 1);
				Server.broadcastPacket(packet);
			}else if(this.checkForSecondSpotScore() == 1)
			{
				const packet = PacketBuilder.scoreAndUpdate(this, y, x, type, 3, 1);
				Server.broadcastPacket(packet);
			}
			else if(this.checkForThirdSpotScore() == 1)
			{
				const packet = PacketBuilder.scoreAndUpdate(this, y, x, type, 1, 3);
				Server.broadcastPacket(packet);
			}else if(this.checkForFourthSpotScore() == 1){
				const packet = PacketBuilder.scoreAndUpdate(this, y, x, type, 3, 3);
				Server.broadcastPacket(packet);
			}else {
				//update the board
				this.checkStateAndUpdate(x,y, type);
			}
			
		}else{
			//TODO: Send an error message
		}//We need to send an error message if the type isn't something we recognize

		
	},
	checkFor1stSpotScore()
	{
		this.checks = 0;
		//Find the closest space the player can score from
		//Find the sorrounding spaces 
		//Check all of the spaces sorrounding each thing
		if(this.board[0][1] == 1){
			this.checks+=1;
		}
		if(this.board[2][1] == 1){
			this.checks+=1;
		}
		if(this.board[1][0] == 2){
			this.checks+=1;
		}
		if(this.board[1][2] == 2)
		{
			this.checks+=1;
		}
		if(this.checks == 4)
		{
			return 1;
		}
		else
		{
			return 2;	
		}
		
	},
	checkForSecondSpotScore()
	{
		this.checks = 0;
		//Find the closest space the player can score from
		//Find the sorrounding spaces 
		//Check all of the spaces sorrounding each thing
		if(this.board[2][1] == 1){
			this.checks+=1;
		}
		if(this.board[4][1] == 1){
			this.checks+=1;
		}
		if(this.board[3][0] == 2){
			this.checks+=1;
		}
		if(this.board[3][2] == 2)
		{
			this.checks+=1;
		}

		console.log("CHecks equals " + this.checks);

		if(this.checks == 4)
		{
			return 1;
		}
		else
		{
			return 2;	
		}
	},
	checkForThirdSpotScore()
	{
		this.checks = 0;
		//Find the closest space the player can score from
		//Find the sorrounding spaces 
		//Check all of the spaces sorrounding each thing
		if(this.board[2][3] == 1){
			this.checks+=1;
		}
		if(this.board[4][3] == 1){
			this.checks+=1;
		}
		if(this.board[3][2] == 2){
			this.checks+=1;
		}
		if(this.board[3][4] == 2)
		{
			this.checks+=1;
		}

		console.log("CHecks equals " + this.checks);
		if(this.checks == 4)
		{
			return 1;
		}
		else
		{
			return 2;	
		}
	},
	checkForFourthSpotScore()
	{
		this.checks = 0;
		//Find the closest space the player can score from
		//Find the sorrounding spaces 
		//Check all of the spaces sorrounding each thing
		if(this.board[2][3] == 1){
			this.checks+=1;
		}
		if(this.board[4][3] == 1){
			this.checks+=1;
		}
		if(this.board[3][2] == 2){
			this.checks+=1;
		}
		if(this.board[3][4] == 2)
		{
			this.checks+=1;
		}

		console.log("CHecks equals " + this.checks);
		if(this.checks == 4)
		{
			return 1;
		}
		else
		{
			return 2;	
		}
	},
	checkStateAndUpdate(x, y, type){
		//Look for game over
		//TODO send update packet to everyone
		const packet = PacketBuilder.update(this, x, y, type);
		Server.broadcastPacket(packet);
	},
};

Server.start(Game);