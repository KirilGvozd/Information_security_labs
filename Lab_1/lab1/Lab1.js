const http = require('http');
const fs = require('fs');

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
            const P = numberOfOccurrences[ch] / filteredText.length * (1 - errorProbability);
            entropy += P * Math.log2(P);
        }
    }
    return -entropy;
}



const server = http.createServer((request, response) => {
    if (request.url === '/entropy') {
        const latinEntropy = alphabetEntropy("abcdefghilmnopqrstuvz", 'Italian.txt');
        const cyrillicEntropy = alphabetEntropy("абвгдеёжзийклмноөпрстуүфхцчшщъыьэюя", 'Mongolian.txt');
        const italianBinaryEntropy = alphabetEntropy("01", 'Italian_binary.txt');
        const mongolianBinaryEntropy = alphabetEntropy("01", 'Mongolian_binary.txt');
        response.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync('entropy.html', 'utf8');
        const replacedContent = htmlContent
            .replace('{{latin_entropy}}', latinEntropy)
            .replace('{{cyrillic_entropy}}', cyrillicEntropy)
            .replace('{{italian_binary_entropy}}', italianBinaryEntropy)
            .replace('{{mongolian_binary_entropy}}', mongolianBinaryEntropy);
        response.end(replacedContent);
    } else if (request.url === '/information') {
        const italianInformation = alphabetEntropy("abcdefghilmnopqrstuvz", 'Italian.txt') *
            "Kirill Vladimirovich Gvozdovsky".length;
        const mongolianInformation = alphabetEntropy("абвгдеёжзийклмноөпрстуүфхцчшщъыьэюя", 'Mongolian.txt') *
            "Гвоздовский Кирилл Владимирович".length;
        const binaryItalian = alphabetEntropy("01", 'Italian_binary.txt') * "Kirill Vladimirovich Gvozdovsky".length;
        const binaryMongolian = alphabetEntropy("01", 'Mongolian_binary.txt') * "Гвоздовский Кирилл Владимирович".length;
        response.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync('information.html', 'utf-8');
        const replacedContent = htmlContent
            .replace('{{latin_information}}', italianInformation)
                .replace('{{cyrillic_information}}', mongolianInformation)
            .replace('{{italian_binary_information}}', binaryItalian)
            .replace('{{mongolian_binary_information}}', binaryMongolian);
        response.end(replacedContent);
    } else if (request.url === '/task4_1') {
        const italianInformation = alphabetEntropy("abcdefghilmnopqrstuvz", 'Italian.txt', 0.1) *
            "Kirill Vladimirovich Gvozdovsky".length;
        const mongolianInformation = alphabetEntropy("абвгдеёжзийклмноөпрстуүфхцчшщъыьэюя", 'Mongolian.txt', 0.1) *
            "Гвоздовский Кирилл Владимирович".length;
        const binaryItalian = alphabetEntropy("01", 'Italian_binary.txt', 0.1) * "Kirill Vladimirovich Gvozdovsky".length;
        const binaryMongolian = alphabetEntropy("01", 'Mongolian_binary.txt', 0.1) * "Гвоздовский Кирилл Владимирович".length;
        response.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync('task4_1.html', 'utf-8');
        const replacedContent = htmlContent
            .replace('{{latin_information}}', italianInformation)
            .replace('{{cyrillic_information}}', mongolianInformation)
            .replace('{{italian_binary_information}}', binaryItalian)
            .replace('{{mongolian_binary_information}}', binaryMongolian);
        response.end(replacedContent);
    } else if (request.url === '/task4_2') {
        const italianInformation = alphabetEntropy("abcdefghilmnopqrstuvz", 'Italian.txt', 0.5) *
            "Kirill Vladimirovich Gvozdovsky".length;
        const mongolianInformation = alphabetEntropy("абвгдеёжзийклмноөпрстуүфхцчшщъыьэюя", 'Mongolian.txt', 0.5) *
            "Гвоздовский Кирилл Владимирович".length;
        const binaryItalian = alphabetEntropy("01", 'Italian_binary.txt', 0.5) * "Kirill Vladimirovich Gvozdovsky".length;
        const binaryMongolian = alphabetEntropy("01", 'Mongolian_binary.txt', 0.5) * "Гвоздовский Кирилл Владимирович".length;
        response.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync('task4_2.html', 'utf-8');
        const replacedContent = htmlContent
            .replace('{{latin_information}}', italianInformation)
            .replace('{{cyrillic_information}}', mongolianInformation)
            .replace('{{italian_binary_information}}', binaryItalian)
            .replace('{{mongolian_binary_information}}', binaryMongolian);
        response.end(replacedContent);
    } else if (request.url === '/task4_3') {
        const italianInformation = alphabetEntropy("abcdefghilmnopqrstuvz", 'Italian.txt', 1) *
            "Kirill Vladimirovich Gvozdovsky".length;
        const mongolianInformation = alphabetEntropy("абвгдеёжзийклмноөпрстуүфхцчшщъыьэюя", 'Mongolian.txt', 1) *
            "Гвоздовский Кирилл Владимирович".length;
        const binaryItalian = alphabetEntropy("01", 'Italian_binary.txt', 1) * "Kirill Vladimirovich Gvozdovsky".length;
        const binaryMongolian = alphabetEntropy("01", 'Mongolian_binary.txt', 1) * "Гвоздовский Кирилл Владимирович".length;
        response.setHeader('Content-Type', 'text/html');
        const htmlContent = fs.readFileSync('task4_3.html', 'utf-8');
        const replacedContent = htmlContent
            .replace('{{latin_information}}', italianInformation)
            .replace('{{cyrillic_information}}', mongolianInformation)
            .replace('{{italian_binary_information}}', binaryItalian)
            .replace('{{mongolian_binary_information}}', binaryMongolian);
        response.end(replacedContent);
    }
    else if (request.url === '/style_for_entropy.css') {
        response.setHeader('Content-Type', 'text/css');
        response.write(fs.readFileSync('./style_for_entropy.css'));
        response.end();
    }

    else {
        response.statusCode = 404;
        response.end('<h1>Not Found</h1>');
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
