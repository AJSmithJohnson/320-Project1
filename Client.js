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
		console.log(packetIdentifier);

		switch(packetIdentifier){
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

				this.buffer = this.buffer.slice(5 + lengthOfUsername);

				const packet = PacketBuilder.join(responseType);
				this.sendPacket(packet);
				const packet2 = PacketBuilder.update(this.server.game);
				console.log("User wants to change name: " +desiredUsername+"");
			break;
			case "CHAT":

			break;
			case "PLAY":
				if(this.buffer.length < 6) return;
				const x = this.buffer.readUInt8(4);
				const y = this.buffer.readUInt8(5);

				this.buffer.slice(6);
				this.server.game.PlayMove(this,x,y);

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
		this.socket.write(packet);
	}
}//End of client class