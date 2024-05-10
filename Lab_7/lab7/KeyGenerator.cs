using System;
using System.Collections;
using System.Diagnostics;

public class KeyGenerator
{
    private BitArray? _leftHalf;
    private BitArray? _rightHalf;
    private static readonly int[] PermutedChoice1Vector = new int[56]
    {
        57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
        63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
    };
    private static readonly int[] PermutedChoice2Vector = new int[48]
    {
        14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47,
        55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
    };
    private BitArray Permute(BitArray bitArray, int[] permutationVector)
    {
        var output = new BitArray(permutationVector.Length);
        for (var i = 0; i < permutationVector.Length; i++)
        {
            output[i] = bitArray[permutationVector[i] - 1];
        }
        return output;
    }
    private BitArray ShiftLeft(BitArray key, int shift)
    {
        var output = new BitArray(key.Length);
        for (var i = 0; i < key.Length; i++)
        {
            output[i] = key[(i + shift) % key.Length];
        }
        return output;
    }
    public BitArray[] GenerateKeys(BitArray primaryKey)
    {
        var output = new BitArray[16];
        var noParityBits = Permute(primaryKey, PermutedChoice1Vector);
        var halves = noParityBits.SplitInHalf();
        _leftHalf = halves[0];
        _rightHalf = halves[1];
        for (var round = 0; round < 16; round++)
        {
            output[round] = GenerateRoundKey(_leftHalf, _rightHalf, round);
            Debug.WriteLine(round);
            output[round].ToBinaryString();
        }
        return output;
    }
    private BitArray GenerateRoundKey(BitArray left, BitArray right, int round)
    {
        int shift;
        if (round == 0 || round == 1 || round == 8 || round == 15)
            shift = 1;
        else
            shift = 2;

        _leftHalf = ShiftLeft(left, shift);
        _rightHalf = ShiftLeft(right, shift);

        var key = _leftHalf.Concatenate(_rightHalf);
        key = Permute(key, PermutedChoice2Vector);
        return key;
    }
}
