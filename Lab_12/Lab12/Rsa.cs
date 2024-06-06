using System.Numerics;
using System.Security.Cryptography;
using System.Text;

namespace Lab12;

internal class Rsa
{
    private readonly BigInteger _n;
    private readonly BigInteger _e;
    private readonly BigInteger _d;
    private byte[] _hash = null!;

    public Rsa()
    {
        var p = Helper.GeneratePrimeNumber();
        var q = Helper.GeneratePrimeNumber();
        _n = p * q;
        var fi = (p - 1) * (q - 1);
        _e = Helper.GenerateCoprimeNumber(fi);
        _d = Helper.ModInverse(_e, fi);
        Console.WriteLine($"Открытый ключ: (e, n) = ({_e}, {_n})");
        Console.WriteLine($"Закрытый ключ: (d, n) = ({_d}, {_n})");
    }

    public BigInteger[] CreateDigitalSignature(string text)
    {
        DateTime startTimeRsa = DateTime.Now;
        using (SHA256 sha256 = SHA256.Create())
        {
            _hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(text));
        }
        BigInteger[] digitalSign = new BigInteger[_hash.Length];
        for (int i = 0; i < _hash.Length; i++)
        {
            digitalSign[i] = BigInteger.ModPow(_hash[i], _d, _n);
        }
        DateTime endTimeRsa = DateTime.Now;
        Console.WriteLine($"Цифровая подпись: {string.Join(" ", digitalSign)}");
        Console.WriteLine($"Время создания цифровой подписи: {(endTimeRsa - startTimeRsa).TotalMilliseconds} мс");
        return digitalSign;
    }

    public bool VerifyDigitalSignature(string text, BigInteger[] digitalSign)
    {
        DateTime startVerifyTimeRsa = DateTime.Now;
        byte[] signBytes = new byte[digitalSign.Length];
        for (int i = 0; i < digitalSign.Length; i++)
        {
            signBytes[i] = (byte)BigInteger.ModPow(digitalSign[i], _e, _n);
        }

        using SHA256 sha256 = SHA256.Create();
        byte[] receivedHash = sha256.ComputeHash(Encoding.UTF8.GetBytes(text));
        bool result = VerifyByteArrays(receivedHash, signBytes);
        DateTime endVerifyTimeRsa = DateTime.Now;
        Console.WriteLine($"Результат проверки цифровой подписи: {result}");
        Console.WriteLine($"Время проверки цифровой подписи: {(endVerifyTimeRsa - startVerifyTimeRsa).TotalMilliseconds} мс\n");
        return result;
    }

    private bool VerifyByteArrays(byte[] arr1, byte[] arr2)
    {
        if (arr1.Length != arr2.Length)
            return false;

        for (int i = 0; i < arr1.Length; i++)
        {
            if (arr1[i] != arr2[i])
                return false;
        }

        return true;
    }
}