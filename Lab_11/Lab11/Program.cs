using System.Diagnostics;
using Lab11;

string input = "Gvozdovskiy Kirill Vladimirovich";

Stopwatch stopwatch = new Stopwatch();
stopwatch.Start();

#pragma warning disable CS0618 // Type or member is obsolete
string md5Hash = Md5Hash.CalculateMd5Hash(input);
#pragma warning restore CS0618 // Type or member is obsolete

stopwatch.Stop();

Console.WriteLine("Входные данные: " + input);
Console.WriteLine("MD5 Hash: " + md5Hash);
Console.WriteLine("Время хэширования {0} символов составило {1} мс ", input.Length ,stopwatch.ElapsedMilliseconds);