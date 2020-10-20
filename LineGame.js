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
	activeClientInit : "",
	clientBScore: 0,
	totalScore: 0,
	board: [
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1, x = 1, and y = 3 x = 1
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1 x =3,   and y = 3 x = 3
		[5, 0, 5, 0, 5],
	],
	defaultBoard: [
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1, x = 1, and y = 3 x = 1
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1 x =3,   and y = 3 x = 3
		[5, 0, 5, 0, 5],
	],
	clientA: 0,
	clientB: 0,
	readyPlayers : 0,
	Start()
	{
		this.whoHasWon = 0;
		this.whoseTurn = 1;
		//console.log("Starting game");
		this.totalScore = 0;
		this.scoreSpotA = 0;
		this.scoreSpotB = 0;
		this.scoreSpotC = 0;
		this.scoreSpotD = 0;
		this.clientAScore = 0;
		this.clientBScore = 0;
		this.readyPlayers = 0;
		this.activeClientInit = " ";
		//var otherBoard = this.defaultBoard.slice(0);
		//console.log("Old board looks like" + this.board);
		//this.board = otherBoard;
		this.board = [
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1, x = 1, and y = 3 x = 1
		[5, 0, 5, 0, 5],
		[0, 3, 0, 3, 0],//spaces of importance y = 1 x =3,   and y = 3 x = 3
		[5, 0, 5, 0, 5],
		];
		//console.log("New board looks like" + this.board);

	},
	PlayMove(client, x, y, type){
		console.log("THE TURN NUMBER IS" + this.whoseTurn);
		//console.log(this.clientA);
		//console.log(this.clientA.username + " that is");
		//console.log(this.totalScore + "This is the score");
		//console.log(x);
		//console.log("");
		//console.log(y);
		/*console.log(this.board[1][1]);
		console.log(this.board[3][1]);
		console.log(this.board[1][3]);
		console.log(this.board[3][3]);*/
		
		if(this.whoseTurn == 1)
		{
			this.activeClientInit = this.clientA.username.substring(0, 2);

		}
		else if(this.whoseTurn == 2)
		{
			this.activeClientInit = this.clientB.username.substring(0, 2);
		}
     	if(client == this.clientA && this.whoseTurn == 1)
     	{
     		

		if(type == 5 || type == 3){
			//TODO: send a packet that notifies the client that they need to 
			//actually select a horizontal or vertical line space
			//this.moves += 1;
		}
		else if(type < 3 && type >0)
		{
			//this.moves += 1;
			this.board[y][x] = type;
			//console.log(this.board);
			if(this.scoreSpotA == 0 && this.checkFor1stSpotScore() == 1){
				
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 1, 1, this.activeClientInit);
				Server.broadcastPacket(packet);
				this.scoreSpotA = 1;
			}
			if(this.scoreSpotB == 0 && this.checkForSecondSpotScore() == 1)
			{
				this.scoreSpotB = 1;
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 3, 1, this.activeClientInit);
				Server.broadcastPacket(packet);
			}
			if(this.scoreSpotC == 0 && this.checkForThirdSpotScore() == 1)
			{
				this.scoreSpotC = 1;
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 1, 3, this.activeClientInit);
				Server.broadcastPacket(packet);
			}
			if(this.scoreSpotD == 0 && this.checkForFourthSpotScore() == 1){
				this.scoreSpotD = 1;
				this.totalScore += 1;
				this.clientAScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 3, 3, this.activeClientInit);
				Server.broadcastPacket(packet);
			} 
			if(this.whoseTurn == 1)
			{
				console.log("This.whose turn should be 2");
				this.whoseTurn = 2;

			}
			else if(this.whoseTurn == 2)
			{
				console.log("This.whose turn should be 1");
				this.whoseTurn = 1;
			}
			if(this.totalScore > 3)
			{
				this.endGame();
			}else
			{
				this.checkStateAndUpdate(x,y, type);	
			}
			//update the board
			
			

			
			}
	//end of total Score if
		} else if(client == this.clientB && this.whoseTurn == 2)
		{
			if(type == 5 || type == 3){
			//TODO: send a packet that notifies the client that they need to 
			//actually select a horizontal or vertical line space
			//this.moves += 1;
			}
			else if(type < 3 && type >0)
			{
			//this.moves += 1;
			this.board[y][x] = type;
			//console.log(this.board);
			if(this.scoreSpotA == 0 && this.checkFor1stSpotScore() == 1){
				
				this.totalScore += 1;
				this.clientBScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 1, 1, this.activeClientInit);
				Server.broadcastPacket(packet);
				this.scoreSpotA = 1;
			}
			if(this.scoreSpotB == 0 && this.checkForSecondSpotScore() == 1)
			{
				this.scoreSpotB = 1;
				this.totalScore += 1;
				this.clientBScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 3, 1, this.activeClientInit);
				Server.broadcastPacket(packet);
			}
			if(this.scoreSpotC == 0 && this.checkForThirdSpotScore() == 1)
			{
				this.scoreSpotC = 1;
				this.totalScore += 1;
				this.clientBScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 1, 3, this.activeClientInit);
				Server.broadcastPacket(packet);
			}
			if(this.scoreSpotD == 0 && this.checkForFourthSpotScore() == 1){
				this.scoreSpotD = 1;
				this.totalScore += 1;
				this.clientBScore +=1;
				const packet = PacketBuilder.scoreAndUpdate(this, x, y, type, 3, 3, this.activeClientInit);
				Server.broadcastPacket(packet);
			} 
			if(this.whoseTurn == 1)
			{
				console.log("This.whose turn should be 2");
				this.whoseTurn = 2;

			}
			else if(this.whoseTurn == 2)
			{
				console.log("This.whose turn should be 1");
				this.whoseTurn = 1;
			}
			if(this.totalScore > 3)
			{
				this.endGame();
			}else
			{
				this.checkStateAndUpdate(x,y, type);	
			}
			//update the board
			
			
			}
		}
		
	},
	checkFor1stSpotScore()
	{
		console.log("here in the checkfor 1st spot spot");
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
		console.log(this.checks + "THIS IS HOW MANY CHECKS THERE ARE");
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
		var winningClient = " ";
		//const packet = PacketBuilder.gameWon(this, this.clientAScore, this.clientBScore, this.whoHasWon, this.clientA, this.clientB);
		if(this.clientAScore > this.clientBScore)
		{
			this.whoHasWon = 1;
			winningClient = this.clientA;
		}else if(this.clientBScore > this.clientAScore)
		{
			this.whoHasWon = 2;
			winningClient = this.clientB;
		}
		const packet = PacketBuilder.gameWon(this, this.clientAScore, this.clientBScore, this.whoHasWon, winningClient);
		Server.broadcastPacket(packet);
	},
};

Server.start(Game);