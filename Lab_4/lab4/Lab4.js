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

        const key = 'GVOZDOVSKIY'; // ваш ключ шифрования
        const encryptedText = encryptCaesar(data, key);
        const decryptedText = decryptCaesar(encryptedText, key);
        fs.writeFileSync('EncryptedEnglishText.txt', encryptedText, 'utf8');
        fs.writeFileSync('DecryptedEnglishText.txt', decryptedText, 'utf8');
        response.send(`<p>Зашифрованный текст:</p><p>${encryptedText}</p>` + `<p>Расшифрованный текст: </br>${decryptedText}</p>`);
    });
});

app.get('/trisemus', (request, response) => {
    const inputFile = 'EnglishText.txt';
    const keyword = 'Kirill';
    const table = trisemusTable(keyword);

    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file: ", err);
            response.status(500).send("Error reading file");
            return;
        }

        const encryptedText = encryptTrisemus(data, table);

        response.send(`
            <h2>Зашифрованный текст:</h2>
            <p>${encryptedText}</p>
            <h2>Расшифрованный текст:</h2>
            <p>${data}</p>
        `);
    });
});

function encryptCaesar(inputText, key) {
    let encryptedText = "";

    for (let i = 0; i < inputText.length; i++) {
        const shift = key[i % key.length].charCodeAt(0) - 'A'.charCodeAt(0);
        let c = inputText[i];

        if (/[a-zA-Z]/.test(c)) {
            const baseCharCode = c === c.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            const encryptedCharCode = (c.charCodeAt(0) - baseCharCode + shift) % 26 + baseCharCode;
            c = String.fromCharCode(encryptedCharCode);
        }

        encryptedText += c;
    }
    return encryptedText;
}

function decryptCaesar(encryptedText, key) {
    let decryptedText = "";

    for (let i = 0; i < encryptedText.length; i++) {
        const shift = key[i % key.length].charCodeAt(0) - 'A'.charCodeAt(0);
        let c = encryptedText[i];

        if (/[a-zA-Z]/.test(c)) {
            const baseCharCode = c === c.toUpperCase() ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            const decryptedCharCode = (c.charCodeAt(0) - shift - baseCharCode + 26) % 26 + baseCharCode;
            c = String.fromCharCode(decryptedCharCode);
        }

        decryptedText += c;
    }

    return decryptedText;
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

function decryptTrisemus(encryptedFile, decryptedFile, table) {
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

        console.log("Расшифрованный текст:\n---------------\n" + decryptedText.join(''));
        fs.writeFileSync(decryptedFile, decryptedText.join(''));
    } catch (error) {
        console.error("Error: " + error.message);
    }
}

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
})