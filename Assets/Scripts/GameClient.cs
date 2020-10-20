using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class GameClient : MonoBehaviour
{

    public Text instructionText;
    private Text _instructionText;
    static public GameClient singleton;
    TcpClient socket = new TcpClient();
    Buffer buffer = Buffer.Alloc(0);
    public TMP_InputField inputHost;
    public TMP_InputField inputport;
    public TMP_InputField inputUsername;

    public Transform panelHostDetails;
    public Transform panelUsername;
    public Transform panelGameplay;
    public Transform panelLobby;
    public Button[] gameBttn = new Button [9];

    public TMP_InputField chatField;
    public TextMeshProUGUI displayText;


    public TextMeshProUGUI lobbyText;

    public Text playerAText;
    public Text playerBText;
    public Button readyUpButton;

    private int readyOrNot = 0;


    // Start is called before the first frame update
    void Start()
    {
        readyOrNot = 0;
        _instructionText = instructionText;
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
            panelLobby.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(false);
        }else if(order == 2)
        {
            panelHostDetails.gameObject.SetActive(false);
            panelUsername.gameObject.SetActive(true);
            panelLobby.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(false);
        }else if (order == 3)
        {
            panelHostDetails.gameObject.SetActive(false);
            panelUsername.gameObject.SetActive(false);
            panelLobby.gameObject.SetActive(false);
            panelGameplay.gameObject.SetActive(true);
        }else if(order == 4)
        {
            panelHostDetails.gameObject.SetActive(false);
            panelUsername.gameObject.SetActive(false);
            panelLobby.gameObject.SetActive(true);
            panelGameplay.gameObject.SetActive(false);
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
    public void ReadyButtonHit()
    {
        print("Hitting ready button");
        if(readyOrNot == 0)
        {
            readyOrNot = 1;
            SendPacketToServer(PacketBuilder.Ready(readyOrNot));
        }
        else if(readyOrNot == 1)
        {
            readyOrNot = 0;
            SendPacketToServer(PacketBuilder.Ready(readyOrNot));
        }
    }
    public void ChatDoneWithInput()
    {
        if (new Regex(@"^\\list$", RegexOptions.IgnoreCase).IsMatch(chatField.text))
        {
            SendPacketToServer(PacketBuilder.Chat(chatField.text));
            chatField.text = "";
        }
        else if (!new Regex(@"^(\s|\t)*$").IsMatch(chatField.text))
        {
            SendPacketToServer(PacketBuilder.Chat(chatField.text));
            chatField.text = "";
        }

        chatField.Select();
        chatField.ActivateInputField();
    }

    public void UpdateButtens(int xRef, int yRef, int type, string scoreText)
    {
        if(type == 5)
        {
            instructionText.text = "Please select a line space with a '+' symbol on it";
        }
        print("getting to updateButtens");
        foreach(Button b in gameBttn)
        {
            if(b.GetComponent<GameplayController>().xPos == xRef)
            {
                if(b.GetComponent<GameplayController>().yPos == yRef)
                {
                    //print("is the problem the text portion");
                    if(type == 1)
                    {
                        b.GetComponentInChildren<Text>().text = "-";
                    }
                    else if(type == 2){
                        b.GetComponentInChildren<Text>().text = "|";
                    }else if(type == 3)
                    {
                        //TODO have first two letters of users username get placed into the box
                        //TODO would need to rework IP update protocol
                        b.GetComponentInChildren<Text>().text = scoreText;
                    }
                    
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

    public void DisplayChatText(string text, int whichText)
    {
        print(whichText);
        if(whichText == 1)
        {
            lobbyText.text += $"{text} connected to the lobby \n";
        }
        else if(whichText == 2)
        {
            lobbyText.text += $"{text} connected to the lobby \n";
        }
        else if (whichText == 3)
        {
            lobbyText.text += $"{text} connected to the lobby \n";
        }
        else if (whichText == 4)
        {
            
            displayText.text += $"{text}\n";
        }else if(whichText == 5)
        {
            lobbyText.text += $"{text} \n";
        }

    }

    void ProcessPackets()
    {
        print(buffer);
        if (buffer.length < 4) return;

        string packetIdentifier = buffer.ReadString(0, 4);
        switch(packetIdentifier)
        {
            case "STRT":
                AdjustPanels(3);
                
                //we need the ability to switch from the lobby to the start of the game
                buffer.Consume(4);
                break;
            case "CHAT":
                int senderNameLength = buffer.ReadUInt8(4);
                int messageLength = buffer.ReadUInt8(5);
                string userName = buffer.ReadString(6, senderNameLength);
                string chatMessage = buffer.ReadString(6 + senderNameLength, messageLength);

                DisplayChatText($"{userName} : {chatMessage}", 2);

                buffer.Consume(6 + senderNameLength + messageLength);
                break;
            case "JOIN":
                print("Getting packets");
                if (buffer.length < 5) return;
                byte joinResponse = buffer.ReadUInt8(4);

                if(joinResponse == 1 || joinResponse == 2|| joinResponse == 3)
                {
                    print(joinResponse);
                    AdjustPanels(4);
                    SendPacketToServer(PacketBuilder.Request());
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
                UpdateButtens(xVal, yVal, type, " ");
                buffer.Consume(9);
                break;
            case "SCOR":
                int xValue = buffer.ReadUInt8(6);
                int yValue= buffer.ReadUInt8(7);
                int typeVal = buffer.ReadUInt8(8);
                int scoreXVal = buffer.ReadUInt8(9);
                int scoreYVal = buffer.ReadUInt8(10);
                string winnerName = buffer.ReadString(11, 2);
                UpdateButtens(xValue, yValue, typeVal, " ");
                UpdateButtens(scoreXVal, scoreYVal, 3, winnerName);
                buffer.Consume(13);

                break;
            case "LOBY":
                int nameLength = buffer.ReadUInt8(4);
                int isClient = buffer.ReadUInt8(5);
                string nameToLobby = buffer.ReadString(6, 6 + nameLength);

                buffer.Consume(6 + nameLength);
                if(isClient == 1)
                {
                    playerAText.text = "Player A is: " + nameToLobby;
                    DisplayChatText($"{nameToLobby}", 1);
                }
                else if (isClient == 2)
                {
                    playerBText.text = "Player B is: " + nameToLobby;
                    DisplayChatText($"{nameToLobby}", 2);

                }
                else if(isClient == 3)
                {
                    DisplayChatText($"{nameToLobby}", 3);
                }
                break;
            case "GWON":
                print("GETTING AN ENDGAME PACKET");
                int winningUsernameLength = buffer.ReadUInt8(4);
                //int otherUsernameLength = buffer.ReadUInt8(5);
                int clientAScore = buffer.ReadUInt8(5);
                int clientBScore = buffer.ReadUInt8(6);
                int winningClientNum = buffer.ReadUInt8(7);
                string winnersUsername = buffer.ReadString(8, winningUsernameLength);
                //string secondClientUsername = buffer.ReadString(10 + winnersUsername.Length);
                print(winnersUsername);
                print(clientAScore);
                string displayText = "The winner was " + winnersUsername;
                DisplayChatText(displayText, 5);
                AdjustPanels(4);
                buffer.Consume(8 + winnersUsername.Length);
                break;
           
        }//End of switch statement
    }

}
