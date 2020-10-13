const Client = require("./Client.js").Client;
const PacketBuilder = require("./packet-build.js").PacketBuilder;

exports.Server = {
	port: 320,
	clients: [],
	maxConnectedUsers : 8,

	start(game){
		this.game = game;
		this.socket = require('net').createServer({}, c=>this.onClientConnect(c));
		this.socket.on('error', (e)=>this.onError(e));
		this.socket.listen({port: this.port}, ()=>this.onStartListen());
	},
	onClientConnect(socket){
		console.log("New connection from " + socket.localAddress);

		if(this.isServerFull()){
			const packet = PacketBuilder.join(9);
			this.console.log("Server is full");
			socket.end(packet);
		}//End of isServerFull
		else{
			const client = new Client(socket, this);
			this.clients.push(client);
		}//Server is not full
	},//End of onClientConnect

	onClientDisconnect(client)
	{
		if(this.game.clientA == client) this.game.clientA = null;
		if(this.game.clientB == client) this.game.clientB = null;

		const index =  this.clients.indexOf(client);
		if(index >= 0) this.clients.splice(index, 1);
	},

	onError(e)
	{
		console.log("Error with listener " + e);
	},
	onStartListen()
	{
		console.log("ser ver NOW LISTENING on port " + this.port);
	},
	isServerFull()
	{
		return(this.clients.length >= this.maxConnectedUsers);
	},
	generateResponseID(desiredUsername, client)
	{
				if(desiredUsername.length <= 3) return  4;
				if(desiredUsername.length >= 12) return  5;



				//letters(upercase and lowercase)
				//spaces
				//numbers
				const regex1 = /^[a-zA-Z0-9]+$/;//literal regex in JavaScript//upcarrot is beginning // dollar sign is end

				if(!regex1.test(desiredUsername)) return 6;//uses invalid characters!


				let isUsernameTaken = false;

				this.clients.forEach(c=>{//This is effectively a function inside of a loop// so the return statement is valid
					if(c == this) return;
					if(c.username == desiredUsername) isUsernameTaken = true;
				});

				if(isUsernameTaken) return 7;

				const regex2 = /(fuck|shit|damn|faggot)/i;
        		if(regex2.test(desiredUsername)) return 8;

        		if(this.game.clientA == client) {
					this.game.clientA = client;
					return 1;//you are already client X

        		}
        		if(this.game.clientB == client) {
					this.game.clientB = client;
					return 2;//you are already client O
				}
        		if(!this.game.clientA) {
        			console.log("NO client A");
					this.game.clientA = client;
					return 1;//you are new clientX

        		}
        		if(!this.game.clientB) {
					this.game.clientB = client;
					return 2;//you are new clientX

        		}

        		return 3;
	},

	broadcastPacket(packet){
		this.clients.forEach(c=>{
			c.sendPacket(packet);
		});
	},


};//End of exports.Server