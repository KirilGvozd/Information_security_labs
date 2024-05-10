using System.Collections;

public static class BitArrayExtensions
{
    public static byte[] FromHex(string hex)
    {
        hex = hex.Replace("-", "");
        byte[] raw = new byte[hex.Length / 2];
        for (int i = 0; i < raw.Length; i++)
        {
            raw[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
        }
        return raw;
    }
    public static string ToBinaryString(this BitArray bits)
    {
        var binaryString = "";
        for (var i = 0; i < bits.Length; i++)
            binaryString += bits[i].ToBinaryDigit();
        System.Diagnostics.Debug.WriteLine(binaryString);
        return binaryString;
    }
    public static string ToBinaryDigit(this bool bit)
    {
        return bit ? "1" : "0";
    }
    public static BitArray[] SplitInHalf(this BitArray array)
    {
        var halfLength = array.Length / 2;
        var firstHalf = new bool[halfLength];
        var secondHalf = new bool[halfLength];

        for (var i = 0; i < halfLength; i++)
        {
            firstHalf[i] = array[i];
            secondHalf[i] = array[i + halfLength];
        }

        return new[] { new BitArray(firstHalf), new BitArray(secondHalf) };
    }
    public static BitArray Concatenate(this BitArray first, BitArray second)
    {
        var combinedLength = first.Length + second.Length;
        var combinedBits = new bool[combinedLength];
        first.CopyTo(combinedBits, 0);
        second.CopyTo(combinedBits, first.Length);
        return new BitArray(combinedBits);
    }
}