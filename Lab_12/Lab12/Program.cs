using System.Numerics;
using Lab12;

bool yes = true;
while (yes)
{
    Console.WriteLine("Выберите алгоритм для ЭЦП:");
    Console.WriteLine("1. RSA");
    Console.WriteLine("2. Эль-Гамаля");
    Console.WriteLine("3. Шнорра");
    Console.WriteLine("4. Выход");

    int choice = int.Parse(Console.ReadLine() ?? string.Empty);

    switch (choice)
    {
        case 1:
            Console.Write("Введите исходный текст: ");
            string sourceText = Console.ReadLine() ?? string.Empty;
            Rsa rsa = new Rsa();
            BigInteger[] digitalSignRsa = rsa.CreateDigitalSignature(sourceText);
            Console.Write("\nВведите текст для проверки: ");
            string checkingText = Console.ReadLine() ?? string.Empty;
            rsa.VerifyDigitalSignature(checkingText, digitalSignRsa);
            break;
        case 2:
            Console.Write("Введите исходный текст: ");
            sourceText = Console.ReadLine() ?? string.Empty;
            ElGamal elGamal = new ElGamal();
            BigInteger[,] digitalSignElGamal = elGamal.CreateDigitalSignature(sourceText);
            Console.Write("\nВведите текст для проверки: ");
            checkingText = Console.ReadLine() ?? string.Empty;
            elGamal.VerifyDigitalSignature(checkingText, digitalSignElGamal);
            break;
        case 3:
            Console.WriteLine();
            Console.Write("Введите исходный текст: ");
            sourceText = Console.ReadLine() ?? string.Empty;
            Schnorr schnorr = new Schnorr();
            BigInteger[,] digitalSignSchnorr = schnorr.GenerateDigitalSignature(sourceText);
            Console.Write("\nВведите текст для проверки: ");
            checkingText = Console.ReadLine() ?? string.Empty;
            schnorr.VerifyDigitalSignature(checkingText, digitalSignSchnorr);
            break;
        case 4:
            yes = false;
            break;
    }
}