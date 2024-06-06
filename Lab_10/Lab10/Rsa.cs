using System.Security.Cryptography;
using System.Text;

namespace Lab10;

public static class RsaAscii
{
    public static string Encrypt(string str, string publicKeyXml)
    {
        var testData = Encoding.ASCII.GetBytes(str);

        using var rsa = RSA.Create();
        rsa.FromXmlString(publicKeyXml);
        var encryptedData = rsa.Encrypt(testData, RSAEncryptionPadding.Pkcs1);
        var base64Encrypted = Convert.ToBase64String(encryptedData);
        return base64Encrypted;
    }

    public static string Decrypt(string str, string privateKeyXml)
    {
        var resultBytes = Convert.FromBase64String(str);

        using var rsa = RSA.Create();
        rsa.FromXmlString(privateKeyXml);

        var decryptedBytes = rsa.Decrypt(resultBytes, RSAEncryptionPadding.Pkcs1);
        var decryptedData = Encoding.ASCII.GetString(decryptedBytes);
        return decryptedData;
    }
}

public static class Rsa
{
    public static string GenerateKey()
    {
        using var rsa = RSA.Create();
        rsa.KeySize = 1024;
        return rsa.ToXmlString(true);
    }

    public static string Encrypt(string str, string publicKeyXml)
    {
        var testData = Encoding.UTF8.GetBytes(str);

        using var rsa = RSA.Create();
        rsa.FromXmlString(publicKeyXml);
        var encryptedData = rsa.Encrypt(testData, RSAEncryptionPadding.Pkcs1);
        var base64Encrypted = Convert.ToBase64String(encryptedData);
        return base64Encrypted;
    }

    public static string Decrypt(string str, string privateKeyXml)
    {
        using var rsa = RSA.Create();
        rsa.FromXmlString(privateKeyXml);
        var resultBytes = Convert.FromBase64String(str);
        var decryptedBytes = rsa.Decrypt(resultBytes, RSAEncryptionPadding.Pkcs1);
        var decryptedData = Encoding.UTF8.GetString(decryptedBytes);
        return decryptedData;
    }
}