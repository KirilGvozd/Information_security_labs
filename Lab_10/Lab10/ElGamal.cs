using System.Numerics;
using System.Text;

namespace Lab10;

public class ElGamalAscii
{
    private static BigInteger Exponentiation(BigInteger a, BigInteger b, BigInteger n)
    {
        var tmp = a;
        var sum = tmp;
        for (var i = 1; i < b; i++)
        {
            for (var j = 1; j < a; j++)
            {
                sum += tmp;
                if (sum >= n)
                {
                    sum -= n;
                }
            }

            tmp = sum;
        }

        return tmp;
    }

    private static BigInteger Multiplication(BigInteger a, BigInteger b, BigInteger n)
    {
        var sum = BigInteger.Zero;
        for (var i = BigInteger.Zero; i < b; i++)
        {
            sum += a;
            if (sum >= n)
            {
                sum -= n;
            }
        }
        return sum;
    }

    public static string Encrypt(string str)
    {
        return Crypt(397, 277, 8, str);
    }

    public static string Decrypt(string str)
    {
        return Decrypt(397, 8, str);
    }

    private static string Crypt(BigInteger p, BigInteger g, BigInteger x, string inString)
    {
        var result = "";
        var y = Exponentiation(g, x, p);
        var rand = new Random();
        Console.WriteLine($"Открытый ключ (p,g,y)=({p},{g},{y})");
        Console.WriteLine($"Закрытый ключ x={x}");

        foreach (byte code in Encoding.ASCII.GetBytes(inString))
        {
            if (code > 0)
            {
                Console.Write((char)code);
                var k = rand.Next() % (p - 2) + 1; // 1 < k < (p-1) 
                var a = Exponentiation(g, k, p);
                var b = Multiplication(Exponentiation(y, k, p), code, p);
                result += a + " " + b + " ";
            }
        }
        Console.WriteLine("");
        return result;
    }

    private static string Decrypt(BigInteger p, BigInteger x, string inText)
    {
        var result = "";

        var arr = inText.Split(' ').Where(xx => xx != "").ToArray();
        for (var i = 0; i < arr.Length; i += 2)
        {
            var a = BigInteger.Parse(arr[i]);
            var b = BigInteger.Parse(arr[i + 1]);

            if (a != BigInteger.Zero && b != BigInteger.Zero)
            {
                var deM = Multiplication(b, Exponentiation(a, p - 1 - x, p), p);
                var m = (char)deM;
                result += m;
            }
        }
        return result;
    }
}

public class ElGamal
{
    private static int Exponentiation(int a, int b, int n)
    {
        var tmp = a;
        var sum = tmp;
        for (var i = 1; i < b; i++)
        {
            for (var j = 1; j < a; j++)
            {
                sum += tmp;
                if (sum >= n)
                {
                    sum -= n;
                }
            }

            tmp = sum;
        }

        return tmp;
    }

    private static int Multiplication(int a, int b, int n)
    {
        var sum = 0;
        for (var i = 0; i < b; i++)
        {
            sum += a;
            if (sum >= n)
            {
                sum -= n;
            }
        }
        return sum;
    }

    public static string Encrypt(string str)
    {
        return Crypt(397, 277, 8, str);
    }

    public static string Decrypt(string str)
    {
        return Decrypt(397, 8, str);
    }

    private static string Crypt(int p, int g, int x, string inString)
    {
        var result = "";
        var y = Exponentiation(g, x, p);
        var rand = new Random();
        Console.WriteLine($"Открытый ключ (p,g,y)=({p},{g},{y})");
        Console.WriteLine($"Закрытый ключ x={x}");

        foreach (int code in inString)
        {
            if (code > 0)
            {
                Console.Write((char)code);
                var k = rand.Next() % (p - 2) + 1; // 1 < k < (p-1) 
                var a = Exponentiation(g, k, p);
                var b = Multiplication(Exponentiation(y, k, p), code, p);
                result += a + " " + b + " ";
            }
        }
        Console.WriteLine("");
        return result;
    }

    private static string Decrypt(int p, int x, string inText)
    {
        var result = "";

        var arr = inText.Split(' ').Where(xx => xx != "").ToArray();
        for (var i = 0; i < arr.Length; i += 2)
        {
            var a = int.Parse(arr[i]);
            var b = int.Parse(arr[i + 1]);

            if (a != 0 && b != 0)
            {

                var deM = Multiplication(b, Exponentiation(a, p - 1 - x, p),
                    p);
                var m = (char)deM;
                result += m;
            }
        }
        return result;
    }
}