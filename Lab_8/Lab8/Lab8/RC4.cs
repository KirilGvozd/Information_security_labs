namespace Lab8;

public class RC4
{
    private byte[] S = new byte[256];
    private int x = 0;
    private int y = 0;

    public RC4(byte[] key)
    {
        InitializeState(key);
    }

    public byte[] Encode(byte[] data)
    {
        byte[] cipher = new byte[data.Length];

        for (int i = 0; i < data.Length; i++)
        {
            cipher[i] = (byte)(data[i] ^ KeyItem());
        }

        return cipher;
    }

    private void InitializeState(byte[] key)
    {
        for (int i = 0; i < 256; i++)
        {
            S[i] = (byte)i;
        }

        int j = 0;
        for (int i = 0; i < 256; i++)
        {
            j = (j + S[i] + key[i % key.Length]) & 255;
            Swap(S, i, j);
        }
    }

    private byte KeyItem()
    {
        x = (x + 1) & 255;
        y = (y + S[x]) & 255;

        Swap(S, x, y);

        return S[(S[x] + S[y]) & 255];
    }

    private static void Swap<T>(T[] array, int index1, int index2)
    {
        (array[index1], array[index2]) = (array[index2], array[index1]);
    }
}