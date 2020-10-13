using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using TMPro;
using UnityEngine;

public class GameClient : MonoBehaviour
{

    static public GameClient singleton;
    TcpClient socket = new TcpClient();
    Buffer buffer = Buffer.Alloc(0);
    public TMP_InputField inputHost;
    public TMP_InputField inputport;
    public TMP_InputField inputUsername;

    public Transform panelHostDetails;
    public Transform panelUsername;
    public GameplayController panelGameplay;
    // Start is called before the first frame update
    void Start()
    {
        if (singleton)
        {
            Destroy(gameObject);
        }
        else
        {
            singleton = this;
            DontDestroyOnLoad(gameObject);
            AdjustPanels(1);
            
        }
    }


    public void OnButtonConnect()
    {
        string host = inputHost.text;
        UInt16.TryParse(inputport.text, out ushort port);
        TryToConnect(host, port);
    }
    public void OnButtonUsername()
    {
        string user = inputUsername.text;
        Buffer packet = PacketBuilder.Join(user);
        
    }

    async public void TryToConnect(string host, ushort port)
    {
        if (socket.Connected) return;//already connected to server
        try
        {
            await socket.ConnectAsync(host, port);
            AdjustPanels(2);
        }
        catch(Exception e)
        {
            print("Failed to connect" + e.ToString());
            AdjustPanels(1);
        }
    }


   

    void AdjustPanels(int order)
    {
        if(order == 1)
        {
            panelHostDetails.gameObject.SetActive(true);
            panelUsername.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(false);
        }else if(order == 2)
        {
            panelHostDetails.gameObject.SetActive(false);
            panelUsername.gameObject.SetActive(true);
            panelGameplay.gameObject.SetActive(false);
        }else if (order == 3)
        {
            panelHostDetails.gameObject.SetActive(false);
            panelUsername.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(true);
        }
    }


    async public void SendPacketToServer(Buffer packet)
    {
        if (!socket.Connected) return;
        await socket.GetStream().WriteAsync(packet.bytes, 0, packet.bytes.Length);
    }

    public void SendPlayPacket(int x, int y)
    {
        //TODO send the spaces on the board so we can get their info and test to see if this mess is working
    }


    void ProcessPackets()
    {
        if (buffer.length < 4) return;

        string packetIdentifier = buffer.ReadString(0, 4);
        switch(packetIdentifier)
        {
            case "JOIN":
                if (buffer.length < 5) return;
                byte joinResponse = buffer.ReadUInt8(4);

                if(joinResponse == 1 || joinResponse == 2|| joinResponse == 3)
                {
                    print(joinResponse);
                    AdjustPanels(3);
                }else
                {
                    print(joinResponse);
                    AdjustPanels(2);
                }

                buffer.Consume(5);
                break;
            case "UPDT":
                //have to figure out what this looks like still

                break;
        }//End of switch statement
    }

}
