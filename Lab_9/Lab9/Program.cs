using System.Text;
using Lab9;

int baseMultiplier = 8;
int privateKeyMultiplier = 31; // Множитель, используемый для вычисления открытого ключа из закрытого ключа. mod(privateKeyMultiplier, n) = 1
string originalMessage = "Gvozdovskiy Kirill Vladimirovich";

var ranceCipher = new RanceCipher();
int[] privateKey = ranceCipher.GenerateSequence(baseMultiplier);
Console.WriteLine($"Закрытый ключ: {ranceCipher.ConvertToString(privateKey)}");

int modulus = 0;
foreach (var t in privateKey)
{
    modulus += t; // Должен быть больше суммы всех элементов в закрытом ключе privateKey
}
modulus += 25;
Console.WriteLine("Сумма элементов + 25: " + modulus);

int[] publicKey = ranceCipher.ComputeSequence(privateKey, privateKeyMultiplier, modulus, baseMultiplier);
Console.WriteLine($"Открытый ключ: {ranceCipher.ConvertToString(publicKey)}");

DateTime startTime = DateTime.Now;
int[] encryptedMessage = ranceCipher.Encrypt(publicKey, originalMessage, baseMultiplier);
DateTime endTime = DateTime.Now;
Console.WriteLine($"\nЗашифрованное сообщение: {ranceCipher.ConvertToString(encryptedMessage)}");
Console.WriteLine("Шифрование {0} символов заняло {1} мс", originalMessage.Length, (endTime - startTime).TotalMilliseconds);

int inversePrivateKeyMultiplier = ranceCipher.GetInverse(privateKeyMultiplier, modulus);

int[] decryptedMessage = new int[encryptedMessage.Length];
string decryptedText = "";

for (int i = 0; i < encryptedMessage.Length; i++)
{
    decryptedMessage[i] = (encryptedMessage[i] * inversePrivateKeyMultiplier) % modulus;
}
Console.WriteLine($"Расшифрованное сообщение: {ranceCipher.ConvertToString(decryptedMessage)}");

Console.Write("Расшифрованное сообщение:");
startTime = DateTime.Now;
foreach (int decryptedSymbol in decryptedMessage)
{
    string decryptedSymbolText = ranceCipher.Decrypt(privateKey, decryptedSymbol, baseMultiplier);
    decryptedText += decryptedSymbolText + " ";
}
endTime = DateTime.Now;
Console.WriteLine("\nРасшифрование {0} символов заняло {1} мс", originalMessage.Length, (endTime - startTime).TotalMilliseconds);

decryptedText = decryptedText.Replace(" ", "");
var stringArray = Enumerable.Range(0, decryptedText.Length / 8).Select(i => Convert.ToByte(decryptedText.Substring(i * 8, 8), 2)).ToArray();
var finalText = Encoding.UTF8.GetString(stringArray);
finalText = finalText.Replace("@", " ");
Console.WriteLine("Расшифрованное сообщение: " + finalText);