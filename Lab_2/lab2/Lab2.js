const http = require('http');
const url = require('url');

// Функция для вычисления НОД двух чисел
function gcd(a, b) {
    if (b === 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

// Функция для вычисления НОД трех чисел
function gcdThree(a, b, c) {
    return gcd(a, gcd(b, c));
}

// Функция для проверки, является ли число простым
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
    }

    return true;
}

// Создание HTTP сервера
const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    const numbers = path.split('/').slice(1).map(Number);

    // Вычисление НОД
    let result;
    if (numbers.length === 2) {
        result = gcd(numbers[0], numbers[1]);
    } else if (numbers.length === 3) {
        result = gcdThree(numbers[0], numbers[1], numbers[2]);
    }

    // Поиск простых чисел
    const primes = numbers.filter(isPrime);

    // Отправляем ответ
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<h1>NOD: ${result}<br/>Simple numbers: ${primes.join(', ')}</h1>`);
});

const PORT = 3000;
const HOST = 'localhost';

// Слушаем порт
server.listen(PORT, HOST, () => {
    console.log(`Server is running at http://localhost:3000`);
});
