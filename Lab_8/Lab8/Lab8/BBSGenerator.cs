using System.Numerics;

namespace Lab8;

public class BBSGenerator
{
    public BigInteger n;
    public BigInteger x;
    private BigInteger p;
    private BigInteger q;

    public BBSGenerator(BigInteger p, BigInteger q, BigInteger x)
    {
        if (!IsPrime(p) || !IsPrime(q))
        {
            throw new ArgumentException("Error: p и q should be simple");
        }

        this.p = p;
        this.q = q;
        n = p * q;

        if (x >= n)
        {
            throw new ArgumentException("x have to be less than n");
        }

        this.x = x;
    }

    private bool IsPrime(BigInteger number)
    {
        if (number < 2)
        {
            return false;
        }

        for (BigInteger i = 2; i * i <= number; i++)
        {
            if (number % i == 0)
            {
                return false;
            }
        }

        return true;
    }

    private BigInteger GenerateBit()
    {
        x = BigInteger.ModPow(x, 2, n);
        return x & 1;
    }

    public BigInteger GenerateRandomNumber(int length)
    {
        if (length <= 0 || length > 1000000)
        {
            throw new ArgumentException("Incorrect length");
        }

        BigInteger result = 0;
        for (int i = 0; i < length; i++)
        {
            BigInteger bit = GenerateBit();
            result = (result << 1) | bit;
        }

        return result;
    }
}