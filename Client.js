const PacketBuilder = require("./packet-build.js").PacketBuilder;

exports.Client = class Client {
	constructor(sock, server){
		this.socket = sock;
		this.server = server;
		this.username = "";
		this.buffer = Buffer.alloc(0);
		this.socket.on('error', (e)=>{this.onError(e)});
		this.socket.on('close', ()=>{this.onClose()});
		this.socket.on('data', (d)=>{this.onData(d)});
		this.xPos = 0;
		this.yPos = 0;
		this.type = 0;
	}

	onError(errMsg){
		console.log("Error with client : " + errMsg);
	}

	onClose(){
		this.server.onClientDisconnect(this);
	}

	onData(data){

		this.buffer = Buffer.concat([this.buffer, data]);

		if(this.buffer.length<4){
			console.log("NOT ENOUGH INFO" + data);
			return;
		}
		const packetIdentifier = this.buffer.slice(0,4).toString();
		//console.log(packetIdentifier);

		switch(packetIdentifier){
			case "REDY":
				if(this.buffer.length < 4)
				{
					console.log(data);
					return;
				}
				console.log("HERE in  redy case");
				let readyOrNotValue = this.buffer.readUInt8(4);

				//is player one of our clients
				if(this == this.server.game.clientA)
				{
					if(readyOrNotValue == 1){
						console.log("Player A is ready")
						this.server.game.readyPlayers += 1;	
					}else {
						console.log("Player A is not ready")
						this.server.game.readyPlayers -= 1;	
					}
					
				}else if(this == this.server.game.clientB)
				{
					if(readyOrNotValue == 1){
						console.log("Player B is ready")
						this.server.game.readyPlayers += 1;	
					}else {
						console.log("Player B is not ready")
						this.server.game.readyPlayers -= 1;	
					}
				}//End of is Player player A or B check
				console.log(this.server.game.readyPlayers);
				if(this.server.game.readyPlayers >= 2)
				{
					console.log("HERE the game should start");
					//RESET GAME SEND OUT START GAME
					this.server.game.Start();
					//SEND OUT START GAME PACKET
					let packet = PacketBuilder.start();
					this.server.broadcastPacket(packet);
				}
				this.buffer = Buffer.alloc(0);
			break;
			case "JOIN":
				if(this.buffer.length <5){
					console.log(data);
					return;
				}
				const lengthOfUsername = this.buffer.readUInt8(4);
				if(this.buffer.length < 5 + lengthOfUsername) return;
				const desiredUsername = this.buffer.slice(5, 5+lengthOfUsername).toString();

				//calls servers generate responseID needs desiredUsername and a reference to the client
				let responseType = this.server.generateResponseID(desiredUsername, this);
				//console.log(responseType + "This is the responseType");
				this.buffer = this.buffer.slice(5 + lengthOfUsername);

				let packet = PacketBuilder.join(responseType);
				//console.log(packet);
				this.sendPacket(packet);
				//const packet2 = PacketBuilder.update(this.server.game);
				console.log("User wants to change name: " +desiredUsername+"");
			break;
			case "CHAT":
				if(this.buffer.length < 5){
					console.log(data);
					return;
				}
				//const lengthOfUsername = this.buffer.readUInt8(4);
				
				const lengthOfMessage = this.buffer.readUInt8(4);
				//let senderName = this.buffer.slice(5, 5 + lengthOfUsername);
				//let chatMessage = this.buffer.slice(5+lengthOfUsername, 5 + lengthOfUsername+lengthOfMessage);
				let chatMessage = this.buffer.slice(5, 5+ lengthOfMessage).toString();
				console.log(chatMessage);
				//if(this.buffer.length < 5 + lengthOfUsername + lengthOfMessage) return;

				//empty pbuffer
				
				var packet2 = PacketBuilder.chat(this.username, chatMessage);
				this.server.broadcastPacket(packet2);
				this.buffer = Buffer.alloc(0);

			break;
			case "PLAY":
				if(this.buffer.length < 7) return;
				this.xPos = this.buffer.readUInt8(4);
				this.yPos = this.buffer.readUInt8(6);
				this.type = this.buffer.readUInt8(8);
				//console.log(this.xPos + "This is the xposition");
				//console.log(this.yPos + "This is the yposition");
				this.server.game.PlayMove(this,this.xPos,this.yPos, this.type);
				this.buffer = Buffer.alloc(0);
			break;
			
			case "RQST":
				if(this.buffer.length < 4) return;
				if(this == this.server.game.clientA)
				{
					var lobbyPacket = PacketBuilder.lobby(this.username, 1);	
				}else if(this == this.server.game.clientB)
				{
					var lobbyPacket = PacketBuilder.lobby(this.username, 2);	
				}else
				{
					var lobbyPacket = PacketBuilder.lobby(this.username, 3);	
				}
				
				this.server.broadcastPacket(lobbyPacket);
				this.buffer = Buffer.alloc(0);
			break;
			default:
				console.log("ERROR: packet identifier not recognize" + packetIdentifier );
				this.buffer = Buffer.alloc(0);//empty buffer//well maybe we need to slice the
				//info out of the buffer//I'm not sure but if you have errors maybe
				//check here
			break;
		}//End of switch
	}//End of onData method
	sendPacket(packet){
		//console.log("HERE");
		this.socket.write(packet);
	}
}//End of client class