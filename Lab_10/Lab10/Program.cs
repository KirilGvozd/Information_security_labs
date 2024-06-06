using System.Diagnostics;
using System.Numerics;
using System.Text;
using Lab10;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

bool flag = true;

do
{
    Console.WriteLine("\nВыберите задание (1, 2 или 3):");
    int choice = Convert.ToInt32(Console.ReadLine());

    switch (choice)
    {
        case 1:
            Task1();
            break;
        case 2:
            Task2();
            break;
        case 3:
            Task3();
            break;
        default:
            flag = false;
            break;
    }
} while (flag);

static void Task1()
{
    var aValues = new int[] { 5, 15 }; // Значения параметра 'а'
    var xValues = new BigInteger[] // Значения параметра 'х'
    {
        new BigInteger(1000),
        new BigInteger(3000),
        new BigInteger(5000),
        new BigInteger(10000),
        new BigInteger(15000)
    };
    var nValues = new BigInteger[] // Значения параметра 'n'
    {
        BigInteger.Pow(2, 1024),
        BigInteger.Pow(2, 2048)
    };

    Console.WriteLine("Время вычисления у:");

    foreach (var a in aValues)
    {
        foreach (var x in xValues)
        {
            foreach (var n in nValues)
            {
                var timer = new Stopwatch();
                timer.Start();
                var y = BigInteger.ModPow(a, x, n);
                timer.Stop();
                var elapsedMilliseconds = (timer.ElapsedTicks * 1000.0) / Stopwatch.Frequency;
                Console.WriteLine($"a: {a} x:{x} n:{n} \nвремя шифрования: {elapsedMilliseconds}");
            }
        }
    }
}

static void Task2()
{
    Console.WriteLine("RSA");
    // Генерация ключей
    string publicKey = Rsa.GenerateKey();
    string privateKey = publicKey;

    string message = "Gvozdovskiy Kirill Vladimirovich";

    Stopwatch encryptionTimer = Stopwatch.StartNew();
    var rsaCrypted = Rsa.Encrypt(message, publicKey);
    encryptionTimer.Stop();
    TimeSpan encryptionTime = encryptionTimer.Elapsed;
    Console.WriteLine("Зашифрованное сообщение: " + rsaCrypted);
    Console.WriteLine("Время шифрования: " + encryptionTime.TotalSeconds.ToString() + " sec");

    Stopwatch decryptionTimer = Stopwatch.StartNew();
    var rsaDecrypted = Rsa.Decrypt(rsaCrypted, privateKey);
    decryptionTimer.Stop();
    TimeSpan decryptionTime = decryptionTimer.Elapsed;
    Console.WriteLine("Расшифрованное сообщение: " + rsaDecrypted);
    Console.WriteLine("Время дешифрования: " + decryptionTime.TotalSeconds.ToString() + " sec");

    // Вычисление относительного изменения объемов криптотекстов
    double plaintextSize = message.Length * sizeof(char); // Размер открытого текста в байтах
    double ciphertextSize = rsaCrypted.Length * sizeof(char); // Размер криптотекста в байтах
    double relativeChange = (ciphertextSize - plaintextSize) / (double)plaintextSize;

    Console.WriteLine("Исходный размер: " + plaintextSize);
    Console.WriteLine("Размер криптотекста: " + ciphertextSize);
    Console.WriteLine("Относительное изменение: " + (relativeChange * 100) + "%");

    Console.WriteLine("\nЭль-Гамаль");
    var plaintext = "Gvozdovskiy Kirill Vladimirovich";

    Stopwatch stopwatch1 = Stopwatch.StartNew();
    var elgamalCrypted = ElGamal.Encrypt(plaintext);
    stopwatch1.Stop();
    TimeSpan procTime1 = stopwatch1.Elapsed;
    Console.WriteLine("Зашифрованный текст: " + elgamalCrypted);
    Console.WriteLine("Время зашифрования: " + procTime1.TotalSeconds + " sec");
    Console.WriteLine();

    Stopwatch stopwatch2 = Stopwatch.StartNew();
    var elgamalDecrypted = ElGamal.Decrypt(elgamalCrypted);
    stopwatch2.Stop();
    TimeSpan procTime2 = stopwatch2.Elapsed;
    Console.WriteLine("Расшифрованный текст: " + elgamalDecrypted);
    Console.WriteLine("Время расшифрования: " + procTime2.TotalSeconds + " sec");
    Console.WriteLine();

    double originalSize = plaintext.Length;
    ciphertextSize = elgamalCrypted.Length;
    relativeChange = (ciphertextSize - originalSize) / (double)originalSize;
    Console.WriteLine("Исходный размер: " + originalSize);
    Console.WriteLine("Размер криптотекста: " + ciphertextSize);
    Console.WriteLine("Относительное изменение: " + (relativeChange * 100) + "%");
}

static void Task3()
{
    Console.WriteLine("RSA в ASCII");

    // Генерация ключей
    string publicKey = Rsa.GenerateKey();
    string privateKey = publicKey;

    string message = "Gvozdovskiy Kirill Vladimirovich";

    Stopwatch encryptionTimer = Stopwatch.StartNew();
    var rsaCrypted = RsaAscii.Encrypt(message, publicKey);
    encryptionTimer.Stop();
    TimeSpan encryptionTime = encryptionTimer.Elapsed;
    Console.WriteLine("Зашифрованное сообщение: " + rsaCrypted);
    Console.WriteLine("Время шифрования: " + encryptionTime.TotalSeconds.ToString() + " sec");

    Stopwatch decryptionTimer = Stopwatch.StartNew();
    var rsaDecrypted = RsaAscii.Decrypt(rsaCrypted, privateKey);
    decryptionTimer.Stop();
    TimeSpan decryptionTime = decryptionTimer.Elapsed;
    Console.WriteLine("Расшифрованное сообщение: " + rsaDecrypted);
    Console.WriteLine("Время дешифрования: " + decryptionTime.TotalSeconds.ToString() + " sec");

    // Вычисление относительного изменения объемов криптотекстов
    double plaintextSize = message.Length * sizeof(char); // Размер открытого текста в байтах
    double ciphertextSize = rsaCrypted.Length * sizeof(char); // Размер криптотекста в байтах
    double relativeChange = (ciphertextSize - plaintextSize) / (double)plaintextSize;

    Console.WriteLine("Исходный размер: " + plaintextSize);
    Console.WriteLine("Размер криптотекста: " + ciphertextSize);
    Console.WriteLine("Относительное изменение: " + (relativeChange * 100) + "%");

    Console.WriteLine("\nЭль-Гамаль в ASCII");
    var plaintext = "Gvozdovskiy Kirill Vladimirovich";

    Stopwatch stopwatch1 = Stopwatch.StartNew();
    var elgamalCrypted = ElGamalAscii.Encrypt(plaintext);
    stopwatch1.Stop();
    TimeSpan procTime1 = stopwatch1.Elapsed;
    Console.WriteLine("Зашифрованный текст: " + elgamalCrypted);
    Console.WriteLine("Время зашифрования: " + procTime1.TotalSeconds + " sec");
    Console.WriteLine();

    Stopwatch stopwatch2 = Stopwatch.StartNew();
    var elgamalDecrypted = ElGamalAscii.Decrypt(elgamalCrypted);
    stopwatch2.Stop();
    TimeSpan procTime2 = stopwatch2.Elapsed;
    Console.WriteLine("Расшифрованный текст: " + elgamalDecrypted);
    Console.WriteLine("Время расшифрования: " + procTime2.TotalSeconds + " sec");
    Console.WriteLine();

    double originalSize = plaintext.Length;
    ciphertextSize = elgamalCrypted.Length;
    relativeChange = (ciphertextSize - originalSize) / (double)originalSize;
    Console.WriteLine("Исходный размер: " + originalSize);
    Console.WriteLine("Размер криптотекста: " + ciphertextSize);
    Console.WriteLine("Относительное изменение: " + (relativeChange * 100) + "%");
}