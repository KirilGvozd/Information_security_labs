using System.Numerics;
using System.Security.Cryptography;
using System.Text;

namespace Lab12;

class ElGamal
{
    private readonly Random _random = new Random();
    private readonly BigInteger _primeP;
    private readonly BigInteger _generatorG;
    private readonly BigInteger _privateKeyX;
    private readonly BigInteger _publicKeyY;
    private byte[] _hash = null!;

    public ElGamal()
    {
        _primeP = Helper.GeneratePrimeNumber();
        _generatorG = Helper.GenerateCoprimeNumber(_primeP);
        _privateKeyX = _random.Next(2, (int)_primeP);
        _publicKeyY = BigInteger.ModPow(_generatorG, _privateKeyX, _primeP);
        Console.WriteLine($"Открытый ключ: (p, g, y) = ({_primeP}, {_generatorG}, {_publicKeyY})");
        Console.WriteLine($"Закрытый ключ: (p, g, x) = ({_primeP}, {_generatorG}, {_privateKeyX})");
        Console.WriteLine();
    }


    public BigInteger[,] CreateDigitalSignature(string message)
    {
        DateTime startTimeElGamal = DateTime.Now;
        using (SHA256 sha256 = SHA256.Create())
        {
            _hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(message));
        }
        BigInteger[,] digitalSignature = new BigInteger[_hash.Length, 2];
        for (int i = 0; i < _hash.Length; i++)
        {
            do
            {
                BigInteger k = _random.Next(2, (int)_primeP - 2);
                while (Helper.GetGcd(k, _primeP - 1) != 1)
                {
                    k = _random.Next(2, (int)_primeP - 2);
                }
                digitalSignature[i, 0] = BigInteger.ModPow(_generatorG, k, _primeP);
                BigInteger temp = BigInteger.Multiply(BigInteger.Subtract(_hash[i], BigInteger.Multiply(_privateKeyX, digitalSignature[i, 0])), Helper.ModInverse(k, _primeP - 1));
                digitalSignature[i, 1] = temp < 0 ? (_primeP - 1) - BigInteger.ModPow(BigInteger.Negate(temp), 1, _primeP - 1) : BigInteger.ModPow(temp, 1, _primeP - 1);
            } while (digitalSignature[i, 1] == 0);
        }
        DateTime endTimeElGamal = DateTime.Now;
        Console.WriteLine($"Цифровая подпись: {string.Join(" ", digitalSignature.Cast<BigInteger>())}");
        Console.WriteLine($"Время создания цифровой подписи: {(endTimeElGamal - startTimeElGamal).TotalMilliseconds} мс");
        return digitalSignature;
    }

    public bool VerifyDigitalSignature(string message, BigInteger[,] digitalSignature)
    {
        DateTime startVerifyTimeElGamal = DateTime.Now;
        using (SHA256 sha256 = SHA256.Create())
        {
            _hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(message));
        }
        bool result = true;
        for (int i = 0; i < digitalSignature.GetUpperBound(0) + 1; i++)
        {
            BigInteger leftPart = BigInteger.ModPow(_generatorG, _hash[i], _primeP);
            BigInteger rightPart = BigInteger.ModPow(BigInteger.Multiply(BigInteger.Pow(_publicKeyY, (int)digitalSignature[i, 0]), BigInteger.Pow(digitalSignature[i, 0], (int)digitalSignature[i, 1])), 1, _primeP);
            bool compareResult = leftPart == rightPart;
            result = result && compareResult;
        }
        DateTime endVerifyTimeElGamal = DateTime.Now;
        Console.WriteLine($"Результат проверки цифровой подписи: {result}");
        Console.WriteLine($"Время проверки цифровой подписи: {(endVerifyTimeElGamal - startVerifyTimeElGamal).TotalMilliseconds} мс\n");
        return result;
    }
}