using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

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
    public Transform panelGameplay;
    public Button[] gameBttn = new Button [9];
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
        SendPacketToServer(packet);
    }

    async public void TryToConnect(string host, ushort port)
    {
        if (socket.Connected) return;//already connected to server
        try
        {
            await socket.ConnectAsync(host, port);
            AdjustPanels(2);

            StartReceivingPackets();
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

    async private void StartReceivingPackets()
    {
        int maxPacketSize = 4096;

        while(socket.Connected)
        {
            byte[] data = new byte[maxPacketSize];

            try
            {
                int bytesRead = await socket.GetStream().ReadAsync(data, 0, maxPacketSize);
                buffer.Concat(data, bytesRead);

                ProcessPackets();
            }
            catch(Exception e)
            {
                print(" There was an issue" + e.ToString());
            }
        }
    }

    public void UpdateButtens(int xRef, int yRef, int type)
    {
        print("getting to updateButtens");
        foreach(Button b in gameBttn)
        {
            if(b.GetComponent<GameplayController>().xPos == xRef)
            {
                if(b.GetComponent<GameplayController>().yPos == yRef)
                {
                    print("is the problem the text portion");
                    b.GetComponentInChildren<Text>().text = "YAYYYY";
                }// end of if
            }//end of if
        }
    }//End of updateButtens Method
    async public void SendPacketToServer(Buffer packet)
    {
        if (!socket.Connected) return;
        await socket.GetStream().WriteAsync(packet.bytes, 0, packet.bytes.Length);
    }

    public void SendPlayPacket(int x, int y, int type)
    {
        print(x);
        print(y);
        SendPacketToServer(PacketBuilder.Play(x, y, type));
    }


    void ProcessPackets()
    {
        print(buffer);
        if (buffer.length < 4) return;

        string packetIdentifier = buffer.ReadString(0, 4);
        switch(packetIdentifier)
        {
            case "JOIN":
                print("Getting packets");
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
                print("WE has an update packet");
                if(buffer.length < 9)
                {
                    print("TOo small for update packet");
                    return;
                }
                //DO something based on whoseTurn it is
                //IF game has won either go to lobby or quit everything
                int xVal = buffer.ReadUInt8(6);
                int yVal = buffer.ReadUInt8(7);
                int type = buffer.ReadUInt8(8);
                UpdateButtens(xVal, yVal, type);
                buffer.Consume(9);
                break;
           
        }//End of switch statement
    }

}
