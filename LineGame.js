const Server = require('./Server.js').Server;
const PacketBuilder = require("./packet-build.js").PacketBuilder;

const Game = {
	whoseTurn: 1,
	whoHasWon: 0,
	moves: 0,
	checks: 0,
	scoreSpotA: 0,
	scoreSpotB: 0,
	scoreSpotC: 0,
	scoreSpotD: 0,
	clientAScore: 0,
	clientBScore: 0,
	totalScore: 0,
	board: [
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1, x = 1, and y = 3 x = 1
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1 x =3,   and y = 3 x = 3
		[5, 0, 5, 0, 5],
	],
	clientA: 0,
	clientB: 0,
	PlayMove(client, x, y, type){
		//console.log(this.clientA);
		console.log(this.clientA.username + " that is");
		console.log(this.scoreSpotA && this.scoreSpotB && this.scoreSpotC && this.scoreSpotD)
		//console.log(x);
		//console.log("");
		//console.log(y);
		/*console.log(this.board[1][1]);
		console.log(this.board[3][1]);
		console.log(this.board[1][3]);
		console.log(this.board[3][3]);*/
		


		if(type == 5 || type == 3){
			//TODO: send a packet that notifies the client that they need to 
			//actually select a horizontal or vertical line space
			//this.moves += 1;
		}
		else if(type < 3 && type >0)
		{
			//this.moves += 1;
			//this.board[y][x] = type;
			//console.log(this.board);
			if(this.scoreSpotA == 0 && this.checkFor1stSpotScore() == 1){
				
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 1, 1);
				Server.broadcastPacket(packet);
				this.scoreSpotA = 1;
			}
			if(this.scoreSpotB == 0 && this.checkForSecondSpotScore() == 1)
			{
				this.scoreSpotB = 1;
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 3, 1);
				Server.broadcastPacket(packet);
			}
			if(this.scoreSpotC == 0 && this.checkForThirdSpotScore() == 1)
			{
				this.scoreSpotC = 1;
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 1, 3);
				Server.broadcastPacket(packet);
			}
			if(this.scoreSpotD == 0 && this.checkForFourthSpotScore() == 1){
				this.scoreSpotD = 1;
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 3, 3);
				Server.broadcastPacket(packet);
			} 
			//update the board
			this.checkStateAndUpdate(x,y, type);
			

			
		}else{
			//TODO: Send an error message
		}//We need to send an error message if the type isn't something we recognize
	//end of total Score if
	
		
	},
	checkFor1stSpotScore()
	{
		this.checks = 0;
		//Find the closest space the player can score from
		//Find the sorrounding spaces 
		//Check all of the spaces sorrounding each thing
		if(this.board[0][1] != 0){
			this.checks+=1;
		}
		if(this.board[2][1] != 0){
			this.checks+=1;
		}
		if(this.board[1][0] != 0){
			this.checks+=1;
		}
		if(this.board[1][2] != 0)
		{
			this.checks+=1;
		}

		if(this.checks == 4)
		{
			//console.log("FIRST SPOT SUCCESSFULL");
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
		if(this.board[1][2] != 0){
			this.checks+=1;
		}
		if(this.board[1][4] != 0){
			this.checks+=1;
		}
		if(this.board[0][3] != 0){
			this.checks+=1;
		}
		if(this.board[2][3] != 0)
		{
			this.checks+=1;
		}

		//console.log("CHecks equals " + this.checks);
		
		if(this.checks == 4)
		{
			//console.log("SECOND SPOT SUCCESSFULL");
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
		if(this.board[3][0] != 0){
			this.checks+=1;
		}
		if(this.board[3][2] != 0){
			this.checks+=1;
		}
		if(this.board[2][1] != 0){
			this.checks+=1;
		}
		if(this.board[4][1] != 0)
		{
			this.checks+=1;
		}
		
		//console.log("CHecks equals " + this.checks);
		if(this.checks == 4)
		{
			//console.log("THIRD SPOT SUCCESSFULL");
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
		if(this.board[3][2] != 0){
			this.checks+=1;
		}
		if(this.board[3][4] != 0){
			this.checks+=1;
		}
		if(this.board[2][3] != 0){
			this.checks+=1;
		}
		if(this.board[4][3] != 0)
		{
			this.checks+=1;
		}
		
		//console.log("CHecks equals " + this.checks);
		if(this.checks == 4)
		{
			//console.log("FOURTH SPOT SUCCESSFULL");
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
	endGame(){
		//TODO: make it so we actually set who has won in the game
		//TODO: replace clientA with winning client and clientB with the other client
		//Taking a final look at each project next week
		//Then we will start making real time games with UDP
		//TAKE A LOOK AT QUIZ again
		console.log("Sending end game packet");
		const packet = PacketBuilder.gameWon(this, clientAScore, clientBScore, this.whoHasWon, clientA, clientB);
		Server.broadcastPacket(packet);
	}
};

Server.start(Game);