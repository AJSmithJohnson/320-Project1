//TODO: FIX UP GAME UPDATE PACKAGE //I COULD ALWAYS JUST USE NICKS METHOD
//BUT I"M PRETTY SURE THERE IS AN EASIER WAY TO CODE THAT INFO
//ALSO IM NOT SURE well no when I write a UINT8 I am writing that value into it
//OKay I figured it out in the game script we are writing the board state into the array at that location
//so it is 1,2,3,4,5 or whatever there and then our array is reading that info and
//writing it into the buffer

//YOU could maybe change your packet to look like
// row x, column y, row x, colum y
// or rowx, column 1, 2, 3, 4 for the bits encoded there

exports.PacketBuilder = {

	join(responseID){
		const packet = Buffer.alloc(5);
		packet.write("JOIN", 0);
		packet.writeUInt8(responseID,4);

		return packet;
	},
	chat(){

	},

	update(game){
		const packet = Buffer.alloc(15);
		packet.write("UPDT", 0);
		packet.writeUInt8(game.whoseTurn, 4);
		packet.writeUInt8(game.whoHasWon, 5);

		var offset = 6;
		for(var x = 0; x < 36; x++)
		{
			for(var y = 0; y < 36; y++)
			{
				//packet.writeUInt8();//game board stuff here
				offset++;
			}

		}

		return packet;
	}

	
	
};//This is a javascript object