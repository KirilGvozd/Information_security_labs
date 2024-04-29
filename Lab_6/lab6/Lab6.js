const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/Lab6.html') {
        fs.readFile('Lab6.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading Lab6.html');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.url === '/enigma-results') {
        // Perform your enigma calculations here...
        const str = "GVOZDOVSKIYKIRILLVLADIMIROVICH";
        const encoded = enigma(str, 1, 0, 1);
        const decoded = enigma(encoded, 1, 0, 1);
        const setting = "2, 3, 4";

        // Send the results as JSON
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({encoded, decoded, setting}));
    }
});

server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});