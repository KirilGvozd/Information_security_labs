const express = require('express');
const fs = require('fs');
const app = express();
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const rows = 5;
const cols = 5;

app.get('/caesar', (request, response) => {
    fs.readFile('./EnglishText.txt', 'utf8', (err, data) => {
        if (err) {
            return response.status(500).send('Error reading input file');
        }

        const encryptionAlphabet = formAlphabet(2);
        let startTime = Date.now();
        const encryptedText = encryptCaesar(data, encryptionAlphabet);
        let finishTime = Date.now();
        const encryptionTime = finishTime - startTime;
        startTime = Date.now();
        const decryptedText = decryptCaesar(encryptedText, encryptionAlphabet);
        finishTime = Date.now();
        const decryptionTime = finishTime - startTime;
        fs.writeFileSync('EncryptedEnglishText.txt', encryptedText, 'utf8');
        fs.writeFileSync('DecryptedEnglishText.txt', decryptedText, 'utf8');
        const numberOfOccurenciesEncrypted = CountCharacterFrequency(encryptedText.toLowerCase());
        const numberOfOccurenciesDecrypted = CountCharacterFrequency(decryptedText.toLowerCase());
        response.send(`<h2>Зашифрованный текст:</h2>
            <p>${encryptedText}</p>
            <h2>Расшифрованный текст:</h2>
            <p>${decryptedText}</p>
            <h2>Частота появления символов в зашифрованном тексте:</h2>
            <p>${Object.entries(numberOfOccurenciesEncrypted).map(([symbol, count]) => `<li>${symbol}: ${count}</li>`).join('')}</p>
            <h2>Частота появления символов в расшифрованном тексте:</h2>
            <p>${Object.entries(numberOfOccurenciesDecrypted).map(([symbol, count]) => `<li>${symbol}: ${count}</li>`).join('')}</p>
            <h2>Время выполнения шифрования текста: ${encryptionTime} мс</h2>
            <h2>Время выполнения расшифрования текста: ${decryptionTime} мс</h2>
`);
    });
});

app.get('/trisemus', (request, response) => {
    const inputFile = 'EnglishText.txt';
    const table = [
        ['k', 'i', 'r', 'l'],
        ['a', 'b', 'c', 'd'],
        ['e', 'f', 'g', 'h'],
        ['j', 'm', 'n', 'o'],
        ['p', 'q', 's', 't'],
        ['u', 'v', 'w', 'x'],
        ['y', 'z', '_', '+']
    ];

    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            response.status(500).send("Error reading file");
            return;
        }

        let startTime = Date.now();
        const encryptedText = encryptTrisemus(data.toLowerCase(), table);
        let finishTime = Date.now();
        const encryptionTime = finishTime - startTime;
        fs.writeFileSync('EncryptedTrisemus.txt', encryptedText, 'utf8');
        startTime = Date.now();
        const decryptedText = decryptTrisemus('EncryptedTrisemus.txt', table);
        finishTime = Date.now();
        const decryptionTime = finishTime - startTime;
        fs.writeFileSync('DecryptedTrisemus.txt', decryptedText, 'utf8');
        const numberOfOccurenciesEncrypted = CountCharacterFrequency(encryptedText);
        const numberOfOccurenciesDecrypted = CountCharacterFrequency(decryptedText);

        response.send(`
            <h2>Зашифрованный текст:</h2>
            <p>${encryptedText}</p>
            <h2>Расшифрованный текст:</h2>
            <p>${decryptedText}</p>
            <h2>Частота появления символов в зашифрованном тексте:</h2>
            <p>${Object.entries(numberOfOccurenciesEncrypted).map(([symbol, count]) => `<li>${symbol}: ${count}</li>`).join('')}</p>
            <h2>Частота появления символов в расшифрованном тексте:</h2>
            <p>${Object.entries(numberOfOccurenciesDecrypted).map(([symbol, count]) => `<li>${symbol}: ${count}</li>`).join('')}</p>
            <h2>Время выполнения зашифрования текста: ${encryptionTime} мс</h2>
            <h2>Время выполнения расшифрования текста: ${decryptionTime} мс</h2>
        `);
    });
});

function encryptCaesar(inputText, cipherAlphabet) {
    let resultCipher = "";
    inputText = inputText.toLowerCase();

    for (let i = 0; i < inputText.length; i++) {
        if (alphabet.includes(inputText[i])) {
            let originalIndex = alphabet.indexOf(inputText[i]);
            resultCipher += cipherAlphabet[originalIndex];
        }
    }

    return resultCipher;
}

function decryptCaesar(encryptedText, cipherAlphabet) {
    let originalText = "";

    for (let i = 0; i < encryptedText.length; i++) {
        let originalIndex = cipherAlphabet.indexOf(encryptedText[i]);
        originalText += alphabet[originalIndex];
    }

    return originalText
}

function formAlphabet(a) {
    let result = "";
    let buffer = "";
    let processedKeyword = Array.from(new Set('gvozdovskiy')).join('');
    let separatorIndex = alphabet.length - a;


    for (let i = 0; i < alphabet.length; i++) {
        if (i < separatorIndex) {
            if (!processedKeyword.includes(alphabet[i])) {
                result += alphabet[i];
            }
        } else if (i === separatorIndex) {
            result = processedKeyword + result;
            buffer += alphabet[i];
        } else {
            buffer += alphabet[i];
        }
    }
    result = buffer + result;
    return result;
}

function trisemusTable(keyword) {
    const table = [];
    let index = 0;

    for (let row = 0; row < rows; row++) {
        table[row] = [];
        for (let col = 0; col < cols; col++) {
            if (index < keyword.length) {
                table[row][col] = keyword[index++];
            } else {
                let found = false;
                for (const c of alphabet) {
                    if (!keyword.includes(c) && !table.flat().includes(c)) {
                        table[row][col] = c;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    for (const c of alphabet) {
                        if (!table.flat().includes(c)) {
                            table[row][col] = c;
                            break;
                        }
                    }
                }
            }
        }
    }
    return table;
}

function encryptTrisemus(text, table) {
    const encryptedText = [];

    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i].toLowerCase();
        if (currentChar === ' ') {
            encryptedText.push(' ');
            continue;
        }

        let isFound = false;

        for (let row = 0; row < table.length; row++) {
            for (let col = 0; col < table[row].length; col++) {
                if (table[row][col] === currentChar) {
                    const newRow = (row + 1) % table.length;
                    encryptedText.push(table[newRow][col]);
                    isFound = true;
                    break;
                }
            }

            if (isFound) {
                break;
            }
        }

        if (!isFound) {
            encryptedText.push(currentChar);
        }
    }

    return encryptedText.join('');
}

function decryptTrisemus(encryptedFile, table) {
    try {
        const text = fs.readFileSync(encryptedFile, 'utf8');
        const decryptedText = [];

        for (let i = 0; i < text.length; i++) {
            let isReplaced = false;

            for (let row = 0; row < table.length && !isReplaced; row++) {
                for (let column = 0; column < table[row].length; column++) {
                    if (text[i] === table[row][column]) {
                        const newRow = (row === 0) ? table.length - 1 : row - 1;
                        decryptedText.push(table[newRow][column]);
                        isReplaced = true;
                        break;
                    }
                }
            }

            if (!isReplaced) {
                decryptedText.push(text[i]);
            }
        }

        return decryptedText.join('');
    } catch (error) {
        console.error("Error: " + error.message);
    }
}

function CountCharacterFrequency(text) {
        let arrayOfSymbols = {};
        [...alphabet].forEach(ch => arrayOfSymbols[ch] = 0);

        const filteredText = text.split('').filter(ch => alphabet.includes(ch)).join('');

        for (let ch of filteredText) {
            arrayOfSymbols[ch]++;
        }
        return arrayOfSymbols;
}
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});