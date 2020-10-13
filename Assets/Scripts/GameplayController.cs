using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class GameplayController : MonoBehaviour
{
    public int xPos = 0;
    public int yPos = 0;
    public int type = 0;
    
    //5 is for a dot space
    //1 is for horizontal line
    //2 is for vertical line
    //3 is for an empty winnable space
    // Start is called before the first frame update


    public void SendPacket()
    {
       // print(xPos + "         " + yPos);
        GameClient.singleton.SendPlayPacket(xPos, yPos,  type);
    }


    
}
