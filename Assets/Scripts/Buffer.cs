using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

public class Buffer 
{

    private byte[] _bytes;

   public byte[] bytes
    {
        get
        {
            return _bytes;
        }
    }//end of public byte

    public int length
    {
        get
        {
            return _bytes.Length;
        }
    }//end of public int length

    public static Buffer Alloc(int size)
    {
        return new Buffer(size);
    }//end of public static buffer size

    public static Buffer From(string text)
    {
        Buffer b = new Buffer(text.Length);
        b.WriteString(text);
        return b;
    }

    public static Buffer From(byte[] items)
    {
        Buffer b = new Buffer(items.Length);
        b.WriteBytes(items);
        return b;
    }

    private Buffer(int size = 0)
    {
        if (size < 0) size = 0;
        _bytes = new byte[size];
    }

    public void Concat(byte[] newdata, int numOfBytes = -1)
    {
        if (numOfBytes < 0 || numOfBytes > newdata.Length) numOfBytes = newdata.Length;
        byte[] newbytes = new byte[_bytes.Length + numOfBytes];

        for (int i = 0; i < newbytes.Length; i++)
        {
            if (i < _bytes.Length)
            {
                newbytes[i] = _bytes[i];
            }
            else
            {
                newbytes[i] = newdata[i - _bytes.Length]; //how big I should be now that it has gone through bytes

            }
        }

        _bytes = newbytes;
    }

    public void Concat(Buffer other)
    {
        Concat(other._bytes);
    }
    public void Clear()
    {
        _bytes = new byte[0];
    }
    public void Consume(int numOfBytes)
    {
        int newLength = _bytes.Length - numOfBytes;
        if (newLength >= _bytes.Length) return;//
        if (newLength <= 0)
        {
            _bytes = new byte[0];
            return;
        }

        byte[] newbytes = new byte[newLength];
        for (int i = 0; i < newbytes.Length; i++)
        {
            newbytes[i] = _bytes[i + numOfBytes];
        }
        _bytes = newbytes;
    }
    public override string ToString()
    {
        StringBuilder sb = new StringBuilder("<Buffer");

        foreach (byte b in _bytes)
        {
            sb.Append(" ");
            sb.Append(b.ToString("x2"));//we have an x2 here because it makes the buffers value hexidecimal in C# 
        }

        sb.Append(">");

        return sb.ToString();
    }

    #region Read Integers

    //Read unsigned 8-bit
    /// <summary>
    /// This is an alias of ReadUInt8()
    /// </summary>
    /// <param name="offset"></param>
    /// <returns></returns>
    public byte ReadByte(int offset = 0)
    {
        return ReadUInt8(offset);
    }
    public byte ReadUInt8(int offset)//IN C SHARP unsigned 8 bit is a byte
    {
        if (offset < 0 || offset >= _bytes.Length) return 0;// could throw exception but it is personal preference if you want to fail quietly like this
        return _bytes[offset];
    }
    //read signed 8-bit
    public sbyte ReadInt8(int offset = 0)
    {
        return (sbyte)ReadByte(offset);//DOes same thing as ReadUInt8 but we cast it as a signed byte
    }
    //Read unsigned 16-bit LE
    public ushort ReadUInt16LE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);

        return (ushort)((b << 8) | a);
    }
    //read unsigned 16-bit BE
    public ushort ReadUInt16BE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);

        return (ushort)((a << 8) | b);
    }
    //read signed   16-bit LE
    public short ReadInt16LE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);

        return (short)((b << 8) | a);
    }
    //read signed   16-bit BE
    public short ReadInt16BE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);

        return (short)((a << 8) | b);
    }


    //Read unsigned 32-bit LE
    //read unsigned 32-bit BE
    //read signed   32-bit LE
    //read signed   32-bit BE

    public uint ReadUInt32LE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);
        byte c = ReadByte(offset + 2);
        byte d = ReadByte(offset + 3);
        return (uint)((d << 24) | (c << 16) | (b << 8) | a);
    }

    public uint ReadUInt32BE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);
        byte c = ReadByte(offset + 2);
        byte d = ReadByte(offset + 3);
        return (uint)((a << 24) | (b << 16) | (c << 8) | d);
    }

    public int ReadInt32LE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);
        byte c = ReadByte(offset + 2);
        byte d = ReadByte(offset + 3);
        return (int)((d << 24) | (c << 16) | (b << 8) | a);
    }

    public int ReadInt32BE(int offset = 0)
    {
        byte a = ReadByte(offset);
        byte b = ReadByte(offset + 1);
        byte c = ReadByte(offset + 2);
        byte d = ReadByte(offset + 3);
        return (int)((a << 24) | (b << 16) | (c << 8) | d);
    }





    //Read unsigned 64-bit LE
    //read unsigned 64-bit BE
    //read signed   64-bit LE
    //read signed   64-bit BE
    #endregion

    #region Write Integers

    public void WriteUInt8(byte val, int offset = 0)
    {
        if (offset < 0 || offset >= _bytes.Length) return;
        _bytes[offset] = val;//put val into bytes array at offset position
    }

    //Like the Read Byte function this is literally just here because typing in UInt8 is annoying
    public void WriteByte(byte val, int offset = 0)
    {
        WriteUInt8(val, offset);
    }

    public void WriteBytes(byte[] vals, int offset = 0)
    {
        for (int i = 0; i < vals.Length; i++)
        {
            WriteByte(vals[i], offset + i);
        }
    }
    // Write signed 8-bit
    public void WriteInt8(sbyte val, int offset = 0)
    {
        WriteByte((byte)val, offset);
    }


    // Write unsigned 16-bit LE
    public void WriteUInt16LE(ushort val, int offset = 0)
    {
        WriteByte((byte)val, offset);
        WriteByte((byte)(val >> 8), offset + 1);
    }
    // Write unsigned 16-bit BE
    public void WriteUInt16BE(ushort val, int offset = 0)
    {
        WriteByte((byte)(val >> 8), offset);
        WriteByte((byte)(val), offset + 1);
    }
    //: Write signed   16-bit LE
    public void WriteInt16LE(short val, int offset = 0)
    {
        WriteByte((byte)val, offset);
        WriteByte((byte)(val >> 8), offset + 1);
    }
    //: Write signed   16-bit BE
    public void WriteInt16BE(short val, int offset = 0)
    {
        WriteByte((byte)(val >> 8), offset);
        WriteByte((byte)(val), offset + 1);
    }


    //TODO: Write unsigned 32-bit LE
    //TODO: Write unsigned 32-bit BE
    //TODO: Write signed   32-bit LE
    //TODO: Write signed   32-bit BE



    public void WriteUInt32LE(uint val, int offset = 0)
    {
        WriteByte((byte)(val >> 0), offset + 0);
        WriteByte((byte)(val >> 8), offset + 1);
        WriteByte((byte)(val >> 16), offset + 2);
        WriteByte((byte)(val >> 24), offset + 3);
    }

    public void WriteUInt32BE(uint val, int offset = 0)
    {
        WriteByte((byte)(val >> 0), offset + 3);
        WriteByte((byte)(val >> 8), offset + 2);
        WriteByte((byte)(val >> 16), offset + 1);
        WriteByte((byte)(val >> 24), offset + 0);
    }

    public void WriteInt32LE(int val, int offset = 0)
    {
        WriteByte((byte)(val >> 0), offset + 0);
        WriteByte((byte)(val >> 8), offset + 1);
        WriteByte((byte)(val >> 16), offset + 2);
        WriteByte((byte)(val >> 24), offset + 3);
    }

    public void WriteInt32BE(int val, int offset = 0)
    {
        WriteByte((byte)(val >> 0), offset + 3);
        WriteByte((byte)(val >> 8), offset + 2);
        WriteByte((byte)(val >> 16), offset + 1);
        WriteByte((byte)(val >> 24), offset + 0);
    }



    //TODO: Write unsigned 64-bit LE
    //TODO: Write unsigned 64-bit BE
    //TODO: Write signed   64-bit LE
    //TODO: Write signed   64-bit BE




    #endregion

    #region Read Floats
    public float ReadSingleBE(int offset = 0)
    {
        return BitConverter.ToSingle(_bytes, offset);
    }
    public float ReadSingleLE(int offset = 0)
    {
        //grab 4 bytes and flip their order for Lil endien
        byte[] temp = new byte[]
        {
           ReadByte(offset + 3), ReadByte(offset + 2), ReadByte(offset + 1), ReadByte(offset),
        };

        return BitConverter.ToSingle(temp, 0);
    }


    public double ReadDoubleBE(int offset = 0)
    {
        return BitConverter.ToDouble(_bytes, offset);
    }
    public double ReadDoubleLE(int offset = 0)
    {
        //grab 4 bytes and flip their order for Lil endien
        byte[] temp = new byte[]
        {
            ReadByte(offset + 7),
            ReadByte(offset + 6),
            ReadByte(offset + 5),
            ReadByte(offset + 4),
           ReadByte(offset + 3),
            ReadByte(offset + 2),
            ReadByte(offset + 1),
            ReadByte(offset),
        };

        return BitConverter.ToDouble(temp, 0);
    }
    #endregion

    #region Write Floats

    public void WriteSingleBE(float val, int offset = 0)
    {
        byte[] parts = BitConverter.GetBytes(val);
        WriteBytes(parts, offset);
        //WriteByte(parts[0], offset + 0);
        //WriteByte(parts[1], offset + 1);
        //WriteByte(parts[2], offset + 2);
        //WriteByte(parts[3], offset + 3);
    }

    public void WriteSingleLE(float val, int offset = 0)
    {
        byte[] parts = BitConverter.GetBytes(val);

        WriteByte(parts[3], offset + 0);
        WriteByte(parts[2], offset + 1);
        WriteByte(parts[1], offset + 2);
        WriteByte(parts[0], offset + 3);
    }


    public void WriteDoubleBE(double val, int offset = 0)
    {
        byte[] parts = BitConverter.GetBytes(val);
        WriteBytes(parts, offset);
        //WriteByte(parts[0], offset + 0);
        //WriteByte(parts[1], offset + 1);
        //WriteByte(parts[2], offset + 2);
        //WriteByte(parts[3], offset + 3);
    }

    public void WriteDoubleLE(double val, int offset = 0)
    {
        byte[] parts = BitConverter.GetBytes(val);

        WriteByte(parts[7], offset + 0);
        WriteByte(parts[6], offset + 1);
        WriteByte(parts[5], offset + 2);
        WriteByte(parts[4], offset + 3);
        WriteByte(parts[3], offset + 4);
        WriteByte(parts[2], offset + 5);
        WriteByte(parts[1], offset + 6);
        WriteByte(parts[0], offset + 7);
    }
    #endregion

    #region Read Strings
    public string ReadString(int offset = 0, int length = 0)
    {
        if (length <= 0) length = _bytes.Length;

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++)
        {
            if (i + offset >= _bytes.Length) break;
            sb.Append((char)ReadByte(i + offset));
        }
        return sb.ToString();
    }
    #endregion

    #region Write Strings
    public void WriteString(string str, int offset = 0)
    {
        char[] chars = str.ToCharArray();
        WriteChars(chars, offset);
    }

    public void WriteChars(char[] chars, int offset = 0)
    {
        for (int i = 0; i < chars.Length; i++)
        {
            if (offset + i >= _bytes.Length) break;
            char c = chars[i];
            WriteByte((byte)c, offset + i);
        }
    }

    #endregion

    #region Read Bool
    public bool ReadBool(int offset = 0)
    {
        return (ReadByte(offset) > 0);
    }
    public bool[] ReadBitField(int offset = 0)
    {
        bool[] res = new bool[8];

        byte b = ReadByte(offset);

        res[0] = (b & 1) > 0;
        res[1] = (b & 2) > 0;
        res[2] = (b & 4) > 0;
        res[3] = (b & 8) > 0;
        res[4] = (b & 16) > 0;
        res[5] = (b & 32) > 0;
        res[6] = (b & 64) > 0;
        res[7] = (b & 128) > 0;

        return res;
    }

    #endregion

    #region Write Bool
    public void WriteBool(bool val, int offset = 0)
    {
        byte b = (byte)(val ? 1 : 0); //if value is true set to 1 if value is false set to 0 //this is a ternary operator
        WriteByte(b, offset);
    }

    public void WriteBitField(bool[] bits, int offset = 0)
    {
        if (bits.Length < 8) return;//avoids the crash failing gracefully
        byte val = 0;

        if (bits[0]) val |= (byte)(1 << 0);
        if (bits[1]) val |= (byte)(1 << 1);
        if (bits[2]) val |= (byte)(1 << 2);
        if (bits[3]) val |= (byte)(1 << 3);
        if (bits[4]) val |= (byte)(1 << 4);
        if (bits[5]) val |= (byte)(1 << 5);
        if (bits[6]) val |= (byte)(1 << 6);
        if (bits[7]) val |= (byte)(1 << 7);
        WriteByte(val, offset);
    }
    #endregion


}
