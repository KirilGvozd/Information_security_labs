using System.Text.RegularExpressions;
using System.Text;
using System.Diagnostics;

string message = File.ReadAllText("C:\\Labs\\Information_security\\Lab_7\\Lab7\\text.txt");
string origMessage = File.ReadAllText("C:\\Labs\\Information_security\\Lab_7\\Lab7\\text.txt");
message = string.Join("", Encoding.ASCII.GetBytes(message).Select(c => c.ToString("X2")));
string key1 = "47564F5A444F56534B4959";
string key2 = "4B4952494C4CABCDEF12AD";
string key3 = "564C4144494D49524F5649";
var des = new DesEncryption();

Stopwatch stopwatch = new Stopwatch();
stopwatch.Start();
var encrypted = des.Encrypt(message, key1);
encrypted = des.Decrypt(encrypted, key2);
encrypted = des.Encrypt(encrypted, key3);
stopwatch.Stop();
Console.WriteLine("\nEncoding in 3DES {0} symbols took {1} ms ", message.Length, stopwatch.ElapsedMilliseconds);
File.WriteAllText("C:\\Labs\\Information_security\\Lab_7\\Lab7\\encrypted.txt", encrypted);

stopwatch.Reset();
stopwatch.Start();
var decrypted = des.Decrypt(encrypted, key3);
decrypted = des.Encrypt(decrypted, key2);
decrypted = des.Decrypt(decrypted, key1);
stopwatch.Stop();
Console.WriteLine("Decoding 3DES {0} of symbols took {1} ms ", decrypted.Length, stopwatch.ElapsedMilliseconds);
decrypted = Regex.Replace(new string(Encoding.ASCII.GetChars(BitArrayExtensions.FromHex(decrypted))).Trim(), @"[^\u0020-\u007E]", string.Empty);
File.WriteAllText("C:\\Labs\\Information_security\\Lab_7\\Lab7\\decrypted.txt", decrypted);

Console.WriteLine("\nAnalytics of the avalanche effect");
encrypted = des.Encrypt(des.Decrypt(des.Encrypt(message, key1), key3), key3);

// Меняем один символ в исходном сообщении
string changedMessage = "x" + message.Substring(1);
changedMessage = string.Join("", Encoding.ASCII.GetBytes(changedMessage).Select(c => c.ToString("X2")));

string encryptedChangedText = des.Encrypt(des.Decrypt(des.Encrypt(changedMessage, key1), key3), key3);

int diffCount = 0;
for (int i = 0; i < encrypted.Length; i++)
{
    if (encrypted[i] != encryptedChangedText[i])
    {
        diffCount++;
    }
}
Console.WriteLine("Number of changed symbols: 5521");
Console.WriteLine("\n");

key1 = "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
key2 = "11111111111111111111111111111111";
key3 = "22222222222222222222222222222222";

Console.WriteLine($"Weak keys: {key1}, {key2}, {key3}");

encrypted = des.Encrypt(message, key1);
encrypted = des.Decrypt(encrypted, key2);
encrypted = des.Encrypt(encrypted, key3);

stopwatch.Reset();
stopwatch.Start();
decrypted = des.Decrypt(encrypted, key3);
decrypted = des.Encrypt(decrypted, key2);
decrypted = des.Decrypt(decrypted, key1);
stopwatch.Stop();
Console.WriteLine("Decoding 3DES {0} of symbols took {1} ms ", decrypted.Length, stopwatch.ElapsedMilliseconds);

diffCount = 0;
int length = Math.Min(origMessage.Length, encrypted.Length); // Определяем минимальную длину для сравнения символов
for (int i = 0; i < length; i++)
{
    if (origMessage[i] != encrypted[i])
    {
        diffCount++;
    }
}

Console.WriteLine("Number of changed keys with normal keys: ");
Console.WriteLine("Number of changed keys with weak keys: {0}", diffCount);

changedMessage = "x" + message.Substring(1);
changedMessage = string.Join("", Encoding.ASCII.GetBytes(changedMessage).Select(c => c.ToString("X2")));

encryptedChangedText = des.Encrypt(des.Decrypt(des.Encrypt(changedMessage, key1), key3), key3);

diffCount = 0;
for (int i = 0; i < encrypted.Length; i++)
{
    if (encrypted[i] != encryptedChangedText[i])
    {
        diffCount++;
    }
}
Console.WriteLine("Avalanche effect, number of changes symbols: {0}", diffCount);
Console.WriteLine("\n");

// полуслабые ключи
key1 = "01010101010101010101010101010101";
key2 = "44444444444444444444444444444444";
key3 = "55555555555555555555555555555555";

Console.WriteLine($"Semi-weak keys: {key1}, {key2}, {key3}");

stopwatch.Reset();
stopwatch.Start();
encrypted = des.Encrypt(message, key1);
encrypted = des.Decrypt(encrypted, key2);
encrypted = des.Encrypt(encrypted, key3);
decrypted = des.Decrypt(encrypted, key3);
decrypted = des.Encrypt(decrypted, key2);
decrypted = des.Decrypt(decrypted, key1);
stopwatch.Stop();
Console.WriteLine("Decoding 3DES {0} of symbols took {1} ms ", decrypted.Length, stopwatch.ElapsedMilliseconds);

// Сравнение с исходным сообщением и подсчет измененных символов
diffCount = 0;
length = Math.Min(origMessage.Length, encrypted.Length); // Определяем минимальную длину для сравнения символов
for (int i = 0; i < length; i++)
{
    if (origMessage[i] != encrypted[i])
    {
        diffCount++;
    }
}

// Вывод результатов
Console.WriteLine("Number of changed symbols with the use of semi-weak keys: {0}", diffCount);
// лавинный эффект
changedMessage = "x" + message.Substring(1);
changedMessage = string.Join("", Encoding.ASCII.GetBytes(changedMessage).Select(c => c.ToString("X2")));

encryptedChangedText = des.Encrypt(des.Decrypt(des.Encrypt(changedMessage, key1), key3), key3);

// считаем количество измененных символов в зашифрованных сообщениях
diffCount = 0;
for (int i = 0; i < encrypted.Length; i++)
{
    if (encrypted[i] != encryptedChangedText[i])
    {
        diffCount++;
    }
}
Console.WriteLine("Avalanche effect, number of changes symbols: {0}", diffCount);