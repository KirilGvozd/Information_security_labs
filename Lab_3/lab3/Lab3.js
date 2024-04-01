const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

function toBase64(input) {
    let base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + base64Chars.charAt(enc3) + base64Chars.charAt(enc4);
    }

    return output;
}
function xorBuffers(a, b) {
    let result = '';
    let length = Math.max(a.length, b.length);

    for (let i = 0; i < length; i++) {
        let xorValue = (a[i] ^ 0) ^ (b[i] ^ 0);
        result += xorValue.toString(2);
    }

    return result;
}

function asciiToBuffer(str) {
    let binaryString = '';
    for (let i = 0; i < str.length; i++) {
        // Получаем ASCII код символа
        const asciiCode = str.charCodeAt(i);
        // Преобразуем ASCII код в двоичную строку и добавляем в результат
        binaryString += asciiCode.toString(2).padStart(8, '0');

    }
    return binaryString;
}

function base64ToBuffer(str) {
    let binary = atob(str);
    let buffer = new Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i).toString(2) + ' ';
    }
    return buffer;
}

function hartleyEnrtopy(alphabet) {
    const lengthOfAlphabet = alphabet.length;
    return Math.log2(lengthOfAlphabet);
}

function alphabetEntropy(alphabet, filePath, errorProbability = 0) {
    let numberOfOccurrences = {};
    [...alphabet].forEach(ch => numberOfOccurrences[ch] = 0);

    const text = fs.readFileSync(filePath, 'utf8').toLowerCase();
    const filteredText = text.split('').filter(ch => alphabet.includes(ch)).join('');

    for (let ch of filteredText) {
        numberOfOccurrences[ch]++;
    }

    let entropy = 0;
    for (let ch of alphabet) {
        if (numberOfOccurrences[ch] !== 0) {
            const P = numberOfOccurrences[ch] / filteredText.length;
            if (errorProbability > 0) {
                entropy = -(1 - (-errorProbability * Math.log2(errorProbability) - (1 - errorProbability) * Math.log2((1- errorProbability))));
                if (isNaN(entropy)) {
                    entropy = 0;
                }
            } else {
                entropy += P * Math.log2(P);
            }
        }
    }
    return -entropy;
}

function numberOfOccurrences(alphabet, filePath) {
    let arrayOfSymbols = {};
    [...alphabet].forEach(ch => arrayOfSymbols[ch] = 0);

    const text = fs.readFileSync(filePath, 'utf8').toLowerCase();
    const filteredText = text.split('').filter(ch => alphabet.includes(ch)).join('');

    for (let ch of filteredText) {
        arrayOfSymbols[ch]++;
    }
    return arrayOfSymbols;
}

const nameAscii = asciiToBuffer('Kirill00000');
const surnameAscii = asciiToBuffer('Gvozdovskiy');
const nameBase64 = asciiToBuffer(toBase64('Kirill00000'));
const surnameBase64 = asciiToBuffer(toBase64('Gvozdovskiy'));
const result = numberOfOccurrences('abcdefghilmnopqrstuvz', 'random.txt');
const resultBase64 = numberOfOccurrences('abcdefghijklmnopqrstuvwxyz0123456789+/', 'base64.txt');

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }

        const base64Data = data.toString('base64');

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(err);
            }
        });
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>File Upload Result</title>
            </head>
            <body>
                <h1>File Upload Result</h1>
                <h2>Base64 Encoded Content:</h2>
                <h2>${base64Data}</h2>
                <h1>Surname in ASCII:</br> ${surnameAscii}</h1>
                <h1>Name in ASCII: </br>${nameAscii}</h1>
                <h1>XOR (ASCII):</br> ${xorBuffers(surnameAscii, nameAscii)}</h1>
                </br>
                <h1>Surname in Base64:</br> ${surnameBase64}</h1>
                <h1>Name in Base64:</br> ${nameBase64}</h1>
                <h1>XOR (Base64):</br> ${xorBuffers(surnameBase64, nameBase64)}</h1>
                <h1>Informational specifications (basic text):</h1>
                <h2>Hartley's entropy for Italian alphabet: ${hartleyEnrtopy('abcdefghilmnopqrstuvz')}</h2>
                <h2>Shannon's entropy for Italian alphabet: ${alphabetEntropy('abcdefghilmnopqrstuvz', 'random.txt')}</h2>
                <h2>Number of occurencies: </h2>
                <ul>
                ${Object.entries(result).map(([symbol, count]) => `<li>${symbol}: ${count}</li>`).join('')}
                </ul>
                <h2>Избыточность: ${((hartleyEnrtopy('abcdefghilmnopqrstuvz') - alphabetEntropy('abcdefghilmnopqrstuvz', 'random.txt')) / hartleyEnrtopy('abcdefghilmnopqrstuvz')) * 100}</h2>
                <h1>Informational specifications (Base64 text):</h1>
                <h1>Hartley's entropy for Base64 alphabet: ${hartleyEnrtopy('abcdefghijklmnopqrstuvwxyz0123456789+/')}</h1>
                <h1>Shannon's entropy for Base64 alphabet: ${alphabetEntropy('abcdefghilmnopqrstuvz', 'base64.txt')}</h1>
                <h2>Number of occurencies: </h2>
                <ul>
                ${Object.entries(resultBase64).map(([symbol, count]) => `<li>${symbol}: ${count}</li>`).join('')}
                </ul>
                <h2>Избыточность: ${((hartleyEnrtopy('abcdefghijklmnopqrstuvwxyz0123456789+/') - alphabetEntropy('abcdefghijklmnopqrstuvwxyz0123456789+/', 'base64.txt')) / hartleyEnrtopy('abcdefghijklmnopqrstuvwxyz0123456789+/')) * 100}</h2>
            </body>
            </html>
        `);
    });
});
app.get('/', (req, res) => {
    // Отправляем HTML форму для загрузки файла
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File Upload</title>
        </head>
        <body>
            <h1>Upload a File</h1>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="file" id="file">
                <button type="submit">Upload</button>
            </form>
        </body>
        </html>
    `);
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});