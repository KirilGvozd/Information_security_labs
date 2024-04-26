const fs = require('fs');
const express = require('express');
const {response} = require("express");

const app = express();
app.use(express.json());

function zigZagEncrypt(inputFile, encryptedFile, rows) {
    const plainText = fs.readFileSync(inputFile, 'utf8');
    let encryptedText = "";

    const cols = Math.ceil(plainText.length / rows);

    const permutation = [];

    let k = 0;
    for (let i = 0; i < rows; i++) {
        permutation[i] = [];
        for (let j = 0; j < cols; j++) {
            if (k < plainText.length) {
                permutation[i][j] = plainText[k++];
            } else {
                permutation[i][j] = '!';
            }
        }
    }

    for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
            encryptedText += permutation[i][j];
        }
    }
    console.log("\nEncrypted (Зиг загом):\n----------------------\n" + encryptedText);
    fs.writeFileSync(encryptedFile, encryptedText);
    countCharacterFrequency(encryptedText);
    return encryptedText;
}

function zigZagDecrypt(encryptedFile, decryptedFile, rows) {
    const encryptedText = fs.readFileSync(encryptedFile, 'utf8');
    let decryptedText = "";

    const cols = Math.ceil(encryptedText.length / rows);

    const permutation = [];

    let k = 0;
    for (let j = 0; j < cols; j++) {
        permutation[j] = [];
        for (let i = 0; i < rows; i++) {
            permutation[j][i] = encryptedText[k++];
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (permutation[j][i] !== '!') {
                decryptedText += permutation[j][i];
            }
        }
    }
    console.log("\nDecrypted text (Зиг загом):\n------------------------------\n" + decryptedText);
    countCharacterFrequency(decryptedText);
    fs.writeFileSync(decryptedFile, decryptedText);
    return decryptedText;
}

function multiplePermutationEncrypt(text) {
    const firstKey = 'kirill';
    const secondKey = 'gvozdovskiy';
    let columns = 5;
    let rows = Math.ceil(text.length / columns);
    let grid = new Array(rows).fill(null).map(() => new Array(columns).fill(''));
    let encryptedText = '';
    let index = 0;

    for (let j = 0; j < columns && index < text.length; j++) {
        for (let i = 0; i < rows && index < text.length; i++) {
            grid[i][j] = text[index++];
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            encryptedText += grid[i][j];
        }
    }
    fs.writeFileSync('permutationEncryptedText.txt', encryptedText);
    countCharacterFrequency(encryptedText);
    return encryptedText;
}

function multiplePermutationDecrypt(encryptedText) {
    const firstKey = 'kirill';
    const secondKey = 'gvozdovskiy';
    let columns = 5; // Количество столбцов, использованных при шифровании
    let rows = Math.ceil(encryptedText.length / columns);
    let grid = new Array(rows).fill(null).map(() => new Array(columns).fill(''));
    let decryptedText = '';
    let index = 0;
    for (let i = 0; i < rows && index < encryptedText.length; i++) {
        for (let j = 0; j < columns && index < encryptedText.length; j++) {
            grid[i][j] = encryptedText[index++];
        }
    }
    for (let j = 0; j < columns; j++) {
        for (let i = 0; i < rows; i++) {
            decryptedText += grid[i][j];
        }
    }
    fs.writeFileSync('permutationDecryptedText.txt', decryptedText);
    countCharacterFrequency(decryptedText);
    return decryptedText.trim();
}


function countCharacterFrequency(text) {
    text = text.toLowerCase();
    const characterFrequency = {};
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let totalCharacters = 0;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (alphabet.includes(c)) {
            characterFrequency[c] = (characterFrequency[c] || 0) + 1;
            totalCharacters++;
        }
    }

    for (const [key, value] of Object.entries(characterFrequency).sort((a, b) => b[1] - a[1])) {
        const frequencyPercentage = (value / totalCharacters) * 100;
        console.log(`${key} - ${frequencyPercentage.toFixed(2)}%`);
    }
}


app.get("/", (req, res) => {
    let startTime = Date.now();
    const encryptedInZigZag = zigZagEncrypt('text.txt', 'encryptedText.txt', 10);
    let endTime = Date.now();
    const zigZagEncryptionTime = endTime - startTime;

    startTime = Date.now();
    const decryptedFromZigZag = zigZagDecrypt('encryptedText.txt', 'decryptedText.txt', 10);
    endTime = Date.now();
    const zigZagDecryptionTime = endTime - startTime;

    startTime = Date.now();
    const encryptedPermutationCypher = multiplePermutationEncrypt(fs.readFileSync('text.txt', 'utf8'));
    endTime = Date.now();
    const permutationCypherTime = endTime - startTime;

    startTime = Date.now();
    const decryptedPermutationCypher = multiplePermutationDecrypt(fs.readFileSync('permutationEncryptedText.txt', 'utf8'));
    endTime = Date.now();
    const permutationDecipherTime = endTime - startTime;

    res.end(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lab5</title>
</head>
<body>
<h1>Зашифрованный текст (Зиг загом):</h1>
<p>${encryptedInZigZag}</p>
<h2>Время на зашифрование: ${zigZagEncryptionTime} мс</h2>
<h1>Расшифрованный текст (Зиг загом):</h1>
<p>${decryptedFromZigZag}</p>
<h2>Время на дешифровку: ${zigZagDecryptionTime} мс</h2>
</br>
<h1>Зашифрованный текст (Перестановочный шифр)</h1>
<p>${encryptedPermutationCypher}</p>
<h2>Время на зашифрование: ${permutationCypherTime} мс</h2>
<h1>Расшифрованный текст (Перестановочный шифр)</h1>
<p>${decryptedPermutationCypher}</p>
<h2>Время на дешифровку: ${permutationDecipherTime} мс</h2>
</body>
</html>
    `)
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})