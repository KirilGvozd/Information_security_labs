const {PrismaClient} = require("@prisma/client");
const http = require('http');
const fs = require('fs');

const prismaClient = new PrismaClient();

const server = http.createServer( (request, response) => {
    if (request.method === 'GET') {
        if (request.url === '/') {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(fs.readFileSync('Lab3.html'));
        }

        else if (request.url === '/api/faculties') {
            prismaClient.fACULTY.findMany().then((faculties) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(faculties, null, 2));
            });
        }

        else if (request.url === '/api/pulpits') {
            prismaClient.pULPIT.findMany().then((pulpits) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(pulpits, null, 2));
            });
        }

        else if (request.url === '/api/subjects') {
            prismaClient.sUBJECT.findMany().then((subjects) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(subjects, null, 2));
            });
        }

        else if (request.url === '/api/teachers') {
            prismaClient.tEACHER.findMany().then((teachers) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(teachers, null, 2));
            });
        }

        else if (request.url === '/api/auditoriumstypes') {
            prismaClient.aUDITORIUM_TYPE.findMany().then((auditoriumTypes) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(auditoriumTypes, null, 2));
            });
        }

        else if (request.url === '/api/auditoriums') {
            prismaClient.aUDITORIUM.findMany().then((auditroiums) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(auditroiums, null, 2));
            });
        }

        else if (request.url.startsWith('/api/faculties/') && request.url.endsWith('/subjects')) {
            const facultyCode = request.url.split('/')[3];
            prismaClient.fACULTY.findMany({
                where: {
                    FACULTY: facultyCode
                },
                select: {
                    FACULTY_NAME: true,
                    PULPIT_PULPIT_FACULTYToFACULTY: {
                        select: {
                            PULPIT_NAME: true,
                            SUBJECT_SUBJECT_PULPITToPULPIT: {
                                select: {
                                    SUBJECT_NAME: true
                                }
                            }
                        }
                    }
                }
            }).then(faculty => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(faculty, null, 2));
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }
    }
});

server.listen(3000);

console.log('Server is http://localhost:3000');