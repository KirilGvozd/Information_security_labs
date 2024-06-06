using System.Numerics;
using System.Security.Cryptography;
using System.Text;

namespace Lab12;

class Schnorr
{
    private readonly Random _random = new Random();
    private readonly BigInteger _primeP = 48731;
    private readonly BigInteger _primeQ;
    private readonly BigInteger _generatorG;
    private readonly BigInteger _secretKeyX;
    private readonly BigInteger _publicKeyY;
    private byte[] _hash = null!;

    public Schnorr()
    {
        do
        {
            _primeQ = Helper.GeneratePrimeNumberS();
        } while ((_primeP - 1) % _primeQ != 0);

        do
        {
            _generatorG = _random.Next(10000, 15000);
        } while (_generatorG == 1 || BigInteger.ModPow(_generatorG, (int)_primeQ, _primeP) != 1);

        do
        {
            _secretKeyX = _random.Next((int)_primeQ);
        } while (_secretKeyX >= _primeQ);

        _publicKeyY = Helper.ModInverse(BigInteger.ModPow(_generatorG, _secretKeyX, _primeP), _primeP);
        Console.WriteLine($"Открытый ключ: (p, q, g, y) = ({_primeP}, {_primeQ}, {_generatorG}, {_publicKeyY})");
        Console.WriteLine($"Закрытый ключ: (x) = ({_secretKeyX})");
        Console.WriteLine();
    }

    public BigInteger[,] GenerateDigitalSignature(string message)
    {
        DateTime startTimeSchnorr = DateTime.Now;
        BigInteger randomK;
        do
        {
            randomK = _random.Next();
        } while (!(randomK > 1 && randomK < _primeQ));
        BigInteger r = BigInteger.ModPow(_generatorG, randomK, _primeP);
        message += r;
        using (SHA256 sha256 = SHA256.Create())
        {
            _hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(message));
        }
        BigInteger[,] digitalSignature = new BigInteger[_hash.Length, 2];
        for (int i = 0; i < _hash.Length; i++)
        {
            digitalSignature[i, 0] = _hash[i];
            digitalSignature[i, 1] = BigInteger.Add(randomK, BigInteger.Multiply(_secretKeyX, _hash[i])) % _primeQ;
        }
        DateTime endTimeSchnorr = DateTime.Now;
        Console.WriteLine($"Цифровая подпись: {string.Join(" ", digitalSignature.Cast<BigInteger>())}");
        Console.WriteLine($"Время создания цифровой подписи: {(endTimeSchnorr - startTimeSchnorr).TotalMilliseconds} мс");
        return digitalSignature;
    }

    public bool VerifyDigitalSignature(string message, BigInteger[,] digitalSignature)
    {
        DateTime startVerifyTimeSchnorr = DateTime.Now;
        BigInteger x = BigInteger.Multiply(BigInteger.ModPow(_generatorG, (int)digitalSignature[0, 1], _primeP), BigInteger.ModPow(_publicKeyY, (int)digitalSignature[0, 0], _primeP)) % _primeP;
        message += x;
        using (SHA256 sha256 = SHA256.Create())
        {
            _hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(message));
        }
        bool result = _hash.SequenceEqual(Enumerable.Range(0, digitalSignature.GetLength(0)).Select(i => digitalSignature[i, 0].ToByteArray()[0]).ToArray());
        DateTime endVerifyTimeSchnorr = DateTime.Now;
        Console.WriteLine($"Результат проверки цифровой подписи: {result}");
        Console.WriteLine($"Время проверки цифровой подписи: {(endVerifyTimeSchnorr - startVerifyTimeSchnorr).TotalMilliseconds} мс\n");
        return result;
    }
}