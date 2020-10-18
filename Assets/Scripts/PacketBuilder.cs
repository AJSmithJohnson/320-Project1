using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class PacketBuilder 
{
    public static Buffer Join(string username)
    {
        //Buffer packet = Buffer.From("JOIN");
        //packet.Concat(new byte[] { (byte)username.Length });
        //These are commented out because they are slooowww the solution below is faster


        int packetLength = 5 + username.Length;
        Buffer packet = Buffer.Alloc(packetLength);
        packet.WriteString("JOIN");
        packet.WriteUInt8((byte)username.Length, 4);
        packet.WriteString(username, 5);

        return packet;
    }

    public static Buffer Ready(int ready)
    {
        int packetLength = 0;
        Buffer packet = Buffer.Alloc(packetLength);

        packet.WriteString("REDY");
        packet.WriteUInt8((byte)ready, 4);
        return packet;
    }

    //get username or maybe not we might not even need the username here
    public static Buffer Chat(string message)
    {
        int packetLength = 5 + message.Length;
        
        Buffer packet = Buffer.Alloc(packetLength);
        packet.WriteString("CHAT");
        packet.WriteUInt8((byte)message.Length, 4);
        packet.WriteString(message, 5);

        return packet;
    }

    public static Buffer Play(int x, int y, int type)
    {
        
        Buffer packet = Buffer.Alloc(9);
        packet.WriteString("PLAY");
        packet.WriteUInt8((byte)x, 4);
        packet.WriteUInt8( 0, 5);
        packet.WriteUInt8((byte)y, 6);
        packet.WriteUInt8(0, 7);
        packet.WriteUInt8((byte)type, 8);

        return packet;
    }
}
