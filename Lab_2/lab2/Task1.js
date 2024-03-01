const http = require('http');
const url = require('url');

function gcd(a, b) {
    if (b === 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}

function gcdThree(a, b, c) {
    return gcd(a, gcd(b, c));
}

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

const server = http.createServer((request, response) => {
    const path = url.parse(request.url, true).pathname;
    const numbers = path.split('/').slice(1).map(Number);


    let result;
    if (numbers.length === 2) {
        result = gcd(numbers[0], numbers[1]);
    } else if (numbers.length === 3) {
        result = gcdThree(numbers[0], numbers[1], numbers[2]);
    }

    const primes = numbers.filter(isPrime);

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<h1>NOD: ${result}<br/>Simple numbers: ${primes.join(', ')}</h1>`);
});

const PORT = 3000;
const HOST = 'localhost';

server.listen(PORT, HOST, () => {
    console.log(`Server is running at http://localhost:3000`);
});

module.exports.isPrime = isPrime;