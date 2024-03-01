const http = require('http');
const {isPrime} = require("./Task1");

const server = http.createServer((request, response) => {
    if (request.url === '/task2' && request.method === 'GET') {
        const n = 401;
        const m  = 367;
        let primes = [];
        let secondPrimes = [];
        for (let i = 2; i <= n; i++) {
            if (isPrime(i)) {
                primes.push(i);
            }
        }

        for (let i = m; i <= n; i++) {
            if (isPrime(i)) {
                secondPrimes.push(i);
            }
        }
        const theoreticalSimpleNumbers = n / Math.log(n);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(`<h1>${primes.join(', ')}</h1>` + `<h1>Number of simple numbers: ${primes.length}</h1>`
            + `<h1>Theoretical count of simple numbers: ${Math.round(theoreticalSimpleNumbers)}</h1>`
            + `<h1>Task 3:</h1>`
            + `<h1>${secondPrimes.join(', ')}</h1>`);
    }
});

server.listen(4000);
console.log('Server is listening on http://localhost:4000');