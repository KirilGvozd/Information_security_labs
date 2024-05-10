using System;
using System.Collections;
using System.Linq;
using System.Text;

public class DesEncryption
{
    private readonly DesProvider _des = new DesProvider();
    private readonly KeyGenerator _key = new KeyGenerator();
    private BitArray? _leftHalf;
    private BitArray? _rightHalf;
    private BitArray? _tempLeftHalf;

    public string Encrypt(string text, string key)
    {
        text = HexToBinaryString(text);
        key = HexToBinaryString(key);
        var keyBits = new BitArray(key.Select(c => c == '1').ToArray());
        var result = "";
        // Разбиваем текст на блоки по 64 бит
        var output = Enumerable.Range(0, text.Length / 64).Select(x => text.Substring(x * 64, 64)).ToList();
        if (text.Length % 64 != 0)
        {
            var missing = text.Skip(output.Count * 64).Take(64).ToList();
            while (missing.Count() != 64)
            {
                missing.Add('0');
            }
            output.Add(string.Join("", missing));
        }
        var newInput = output.ToArray();
        var subKeys = _key.GenerateKeys(keyBits);
        for (var i = 0; i < newInput.Length; i++)
        {
            var bits = new BitArray(newInput[i].Select(c => c == '1').ToArray());
            // начальная перестановка
            var chunk = _des.InitialPermutation(bits);
            // Разделяем чанк на две части по 32 бита каждая
            var sides = chunk.SplitInHalf();
            _leftHalf = sides[0];
            _rightHalf = sides[1];
            _leftHalf = sides[1];
            _tempLeftHalf = sides[0];
            for (var j = 0; j < 16; j++)
            {
                _rightHalf = _des.Round(_rightHalf, subKeys[j]); // rn = f(rn-1, kn)
                _rightHalf = _tempLeftHalf.Xor(_rightHalf); // rn = ln-1 xor rn
                _tempLeftHalf = _leftHalf;
                _leftHalf = _rightHalf;
            }
            var finalPerm = _rightHalf.Concatenate(_tempLeftHalf);
            finalPerm = _des.FinalPermutation(finalPerm);
            result += BinaryStringToHexString(finalPerm);
        }
        return result;
    }

    public string Decrypt(string cipher, string key)
    {
        cipher = HexToBinaryString(cipher);
        key = HexToBinaryString(key);
        var keyBits = new BitArray(key.Select(c => c == '1').ToArray());
        var result = "";
        // Разбиваем текст на блоки по 64 бит
        var output = Enumerable.Range(0, cipher.Length / 64).Select(x => cipher.Substring(x * 64, 64)).ToList();
        var newInput = output.ToArray();
        var subKeys = _key.GenerateKeys(keyBits).Reverse().ToArray();
        for (var i = 0; i < newInput.Length; i++)
        {
            var bits = new BitArray(newInput[i].Select(c => c == '1').ToArray());
            var chunk = _des.InitialPermutation(bits);
            var sides = chunk.SplitInHalf();
            _leftHalf = sides[0];
            _rightHalf = sides[1];
            _leftHalf = sides[1];
            _tempLeftHalf = sides[0];
            for (var j = 0; j < 16; j++)
            {
                _rightHalf = _des.Round(_rightHalf, subKeys[j]); // rn = f(rn-1, kn)
                _rightHalf = _tempLeftHalf.Xor(_rightHalf); // rn = ln-1 xor rn

                _tempLeftHalf = _leftHalf;
                _leftHalf = _rightHalf;
            }
            var finalPerm = _rightHalf.Concatenate(_tempLeftHalf);
            finalPerm = _des.FinalPermutation(finalPerm);
            result += BinaryStringToHexString(finalPerm);
        }
        return result;
    }

    private string HexToBinaryString(string hex)
    {
        hex = hex.Replace(" ", "").ToUpper();
        var binary = new StringBuilder(hex.Length * 4);
        foreach (var c in hex)
        {
            var value = Convert.ToInt32(c.ToString(), 16);
            binary.Append(Convert.ToString(value, 2).PadLeft(4, '0'));
        }
        return binary.ToString();
    }

    private string BinaryStringToHexString(BitArray bits)
    {
        var sb = new StringBuilder(bits.Length / 4);
        for (var i = 0; i < bits.Length; i += 4)
        {
            var v = (bits[i] ? 8 : 0) |
                    (bits[i + 1] ? 4 : 0) |
                    (bits[i + 2] ? 2 : 0) |
                    (bits[i + 3] ? 1 : 0);

            sb.Append(v.ToString("X1")); // Or "X1"
        }
        return sb.ToString();
    }
}