using System.Text;

namespace Lab9;

public class RanceCipher
{
    private readonly Random _randomizer = new();

    public int GetInverse(int a, int n)
    {
        for (int i = 1; i <= n; i++)
        {
            if (((a * i) % n) == 1)
            {
                return i;
            }
        }

        return 0;
    }

    public string ConvertToString(int[] arr)
    {
        StringBuilder result = new StringBuilder();

        foreach (int num in arr)
        {
            result.Append(num.ToString()).Append("; ");
        }

        return result.ToString();
    }

    public string GetBinaryRepresentation(string str)
    {
        StringBuilder binaryStr = new StringBuilder();

        foreach (char ch in str)
        {
            binaryStr.Append(Convert.ToString(ch, 2));
        }

        return binaryStr.ToString();
    }

    public int[] GenerateSequence(int z)
    {
        int[] sequence = new int[z];
        int sum = 0;

        for (int i = 0; i < z; i++)
        {
            sequence[i] = _randomizer.Next(sum, sum + 63);
            sum += sequence[i];
        }

        return sequence;
    }

    public int[] ComputeSequence(int[] d, int a, int n, int z)
    {
        int[] e = new int[z];

        for (int i = 0; i < z; i++)
        {
            e[i] = (d[i] * a) % n;
        }

        return e;
    }

    public int[] Encrypt(int[] d, string message, int z)
    {
        int[] result = new int[message.Length];
        int j = 0;

        Console.Write("Зашифрованное сообщение: ");
        StringBuilder binaryMessage = new StringBuilder();

        foreach (char ch in message)
        {
            int total = 0;
            string binary = '0' + Convert.ToString(ch, 2);
            Console.Write($"{binary} ");
            binaryMessage.Append(binary + " ");

            for (int i = 0; i < binary.Length; i++)
            {
                if (binary[i] == '1')
                {
                    total += d[i];
                }
            }

            result[j] = total;
            j++;
        }

        return result;
    }

    public string Decrypt(int[] d, int s, int z)
    {
        StringBuilder res = new StringBuilder();
        StringBuilder res2 = new StringBuilder();
        StringBuilder binaryMessage = new StringBuilder();

        for (int i = z; i > 0; i--)
        {
            if (s >= d[i - 1])
            {
                res.Append('1');
                s -= d[i - 1];
            }
            else
            {
                res.Append('0');
            }
        }

        for (int i = res.Length - 1; i >= 0; i--)
        {
            res2.Append(res[i]);
            binaryMessage.Append(res[i]);
        }

        Console.Write($"{res2} ");

        return res2.ToString();
    }
}