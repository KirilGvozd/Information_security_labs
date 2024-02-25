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

        else if (request.url === '/api/transaction') {
            prismaClient.$transaction(async prisma => {
                await prisma.aUDITORIUM.updateMany({
                    data: {
                        AUDITORIUM_CAPACITY: {
                            increment: 100
                        }
                    }
                });
                console.log(await prisma.aUDITORIUM.findMany());
                throw new Error('Transaction rolled back')
            }).catch(error => {
                prismaClient.aUDITORIUM.findMany().then(auditoriums => {
                    console.log(JSON.stringify(auditoriums, null, 2));
                });
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(`<h1>${error}</h1>`);
            });
        }

        else if (request.url === '/api/auditoriumsWithComp1') {
            prismaClient.aUDITORIUM.findMany({
                where: {
                    AUDITORIUM_TYPE: {
                        equals: 'ЛБ-К'
                    },
                    AUDITORIUM_NAME: {
                        endsWith: '-1'
                    }
                }
            }).then(auditoriums => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(auditoriums, null, 2));
            });
        }

        else if (request.url === '/api/puplitsWithoutTeachers') {
            prismaClient.pULPIT.findMany({
                where: {
                    TEACHER_TEACHER_PULPITToPULPIT: {
                        none: {}
                    }
                }
            }).then(pulpits => {
                if (pulpits.length === 0) {
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end('<h1>Pulpits not found</h1>');
                } else {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(pulpits, null, 2));
                }
            });
        }

        else if (request.url === '/api/pulpitsWithVladimir') {
            prismaClient.pULPIT.findMany({
                where: {
                    TEACHER_TEACHER_PULPITToPULPIT: {
                        some: {
                            TEACHER_NAME: {
                                contains: 'Владимир'
                            }
                        }
                    }
                },
                select: {
                    PULPIT: true,
                    PULPIT_NAME: true,
                    TEACHER_TEACHER_PULPITToPULPIT: {
                        select: {
                            TEACHER_NAME: true
                        }
                    }
                }
            }).then(teachers => {
                if (teachers.length === 0) {
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end('<h1>Teacher with Vladimir not found</h1>');
                } else {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(teachers, null, 2));
                }
            });
        }

        else if (request.url === '/api/auditoriumsSameCount') {
            prismaClient.aUDITORIUM.groupBy({
                by: ['AUDITORIUM_CAPACITY', 'AUDITORIUM_TYPE'],
                _count: {
                    AUDITORIUM: true
                },
                having: {
                    AUDITORIUM: {
                        _count: {
                            gt: 1
                        }
                    }
                }
            }).then(auditoriums => {
                if (auditoriums.length === 0) {
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end('<h1>There is no auditoriums</h1>');
                } else {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(auditoriums, null, 2));
                }
            });
        }

        else if (request.url === '/fluentapi') {
            prismaClient.pULPIT.findUnique({
                where: {
                    PULPIT: 'ИСиТ'
                }
            }).SUBJECT_SUBJECT_PULPITToPULPIT().then((subjects) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(subjects, null, 2));
            });
        }

        else if (request.url === '/api/faculties') {
            prismaClient.fACULTY.findMany().then((faculties) => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(faculties, null, 2));
            });
        }

        else if (request.url === '/api/pulpits') {
            prismaClient.pULPIT.findMany({
                include: {
                    TEACHER_TEACHER_PULPITToPULPIT: true
                }
            }).then((pulpits) => {
                const formattedPulpits = pulpits.map(pulpit => ({
                    PULPIT: pulpit.PULPIT,
                    PULPIT_NAME: pulpit.PULPIT_NAME,
                    FACULTY: pulpit.FACULTY,
                    _count: {
                        TEACHER_TEACHER_PULPITToPULPIT: pulpit.TEACHER_TEACHER_PULPITToPULPIT.length
                    }
                }))
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(formattedPulpits));
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

        else if (request.url.startsWith('/api/auditoriumtypes/') && request.url.endsWith('/auditoriums')) {
            const auditoriumType = request.url.split('/')[3];
            prismaClient.aUDITORIUM_TYPE.findMany({
                where: {
                    AUDITORIUM_TYPE: auditoriumType
                },
                select: {
                    AUDITORIUM_TYPE: true,
                    AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: {
                        select: {
                            AUDITORIUM: true
                        }
                    }
                }
            }).then(auditoriums => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(auditoriums, null, 2));
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }
    }

    else if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });

        if (request.url === '/api/faculties') {
            request.on('end', () => {
                let o = JSON.parse(body);
                if (!o.pulpit) {
                    prismaClient.fACULTY.create({
                        data: {
                            FACULTY: o.faculty,
                            FACULTY_NAME: o.faculty_name
                        }
                    }).then(() => {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(`Added successfully: ${o.faculty}, ${o.faculty_name}`);
                    }).catch(error => {
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(`Error: ${error}`);
                    })
                } else {
                    prismaClient.fACULTY.create({
                        data: {
                            FACULTY: o.faculty,
                            FACULTY_NAME: o.faculty_name,
                            PULPIT_PULPIT_FACULTYToFACULTY: {
                                createMany: {
                                    data: o.pulpit
                                }
                            }
                        }
                    }).then(() => {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(`Added successfully: ${o.faculty}, ${o.faculty_name}`);
                    }).catch(error => {
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(`Error: ${error}`);
                    });
                }
            });
        }

        else if (request.url === '/api/pulpits') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.pULPIT.create({
                    data: {
                        PULPIT: o.pulpit,
                        PULPIT_NAME: o.pulpit_name,
                        FACULTY_PULPIT_FACULTYToFACULTY: {
                            connectOrCreate: {
                                where: {
                                    FACULTY: o.faculty
                                },
                                create: {
                                    FACULTY: o.faculty.split(',')[0],
                                    FACULTY_NAME: o.faculty.split(',')[1]
                                }
                            }
                        }
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Added successfully: ${o.pulpit}, ${o.pulpit_name}, ${o.faculty}`);
                }).catch((error) => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/subjects') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.sUBJECT.create({
                    data: {
                    SUBJECT: o.subject,
                    SUBJECT_NAME: o.subject_name,
                    PULPIT: o.pulpit
                }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Added successfully: ${o.subject}, ${o.subject_name}, ${o.pulpit}`);
                }).catch((error) => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/teachers') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.tEACHER.create({
                    data: {
                        TEACHER: o.teacher,
                        TEACHER_NAME: o.teacher_name,
                        PULPIT: o.pulpit
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Added successfully: ${o.teacher}, ${o.teacher_name}, ${o.pulpit}`);
                }).catch((error) => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(`Error: ${error.message}`));
                });
            });
        }

        else if (request.url === '/api/auditoriumstypes') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.aUDITORIUM_TYPE.create({
                    data: {
                        AUDITORIUM_TYPE: o.auditorium_type,
                        AUDITORIUM_TYPENAME: o.auditorium_typename
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Added successfully: ${o.auditorium_type}, ${o.auditorium_typename}`);
                }).catch((error) => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/auditoriums') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.aUDITORIUM.create({
                    data: {
                        AUDITORIUM: o.auditorium,
                        AUDITORIUM_NAME: o.auditorium_name,
                        AUDITORIUM_CAPACITY: parseInt(o.auditorium_capacity),
                        AUDITORIUM_TYPE: o.auditorium_type
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Added successfully: ${o.auditorium}, ${o.auditorium_name}, ${o.auditorium_capacity}, ${o.auditorium_type}`);
                }).catch((error) => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }
    }

    else if (request.method === 'PUT') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });

        if (request.url === '/api/faculties') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.fACULTY.update({
                    where: {
                        FACULTY: o.faculty
                    },
                    data: {
                        FACULTY: o.faculty,
                        FACULTY_NAME: o.faculty_name
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Updated successfully: ${o.faculty}, ${o.faculty_name}`);
                }).catch(error => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/pulpits') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.pULPIT.update({
                    where: {
                        PULPIT: o.pulpit
                    },
                    data: {
                        PULPIT: o.pulpit,
                        PULPIT_NAME: o.pulpit_name
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Updated successfully: ${o.pulpit}, ${o.pulpit_name}, ${o.faculty}`);
                }).catch(error => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/subjects') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.sUBJECT.update({
                    where: {
                        SUBJECT: o.subject
                    },
                    data: {
                        SUBJECT_NAME: o.subject_name,
                        PULPIT: o.pulpit
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Updated successfully: ${o.subject}, ${o.subject_name}, ${o.pulpit}`);
                }).catch(error => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/teachers') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.tEACHER.update({
                    where: {
                        TEACHER: o.teacher
                    },
                    data: {
                        TEACHER_NAME: o.teacher_name,
                        PULPIT: o.pulpit
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Updated successfully: ${o.teacher}, ${o.teacher_name}, ${o.pulpit}`);
                }).catch(error => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/auditoriumstypes') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.aUDITORIUM_TYPE.update({
                    where: {
                        AUDITORIUM_TYPE: o.auditorium_type
                    },
                    data: {
                        AUDITORIUM_TYPENAME: o.auditorium_typename
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Updated successfully: ${o.auditorium_type}, ${o.auditorium_typename}`);
                }).catch(error => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }

        else if (request.url === '/api/auditoriums') {
            request.on('end', () => {
                let o = JSON.parse(body);
                prismaClient.aUDITORIUM.update({
                    where: {
                        AUDITORIUM: o.auditorium
                    },
                    data: {
                        AUDITORIUM_NAME: o.auditorium_name,
                        AUDITORIUM_CAPACITY: parseInt(o.auditorium_capacity),
                        AUDITORIUM_TYPE: o.auditorium_type
                    }
                }).then(() => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(`Updated successfully: ${o.auditorium}, ${o.auditorium_name}, ${o.auditorium_capacity}, ${o.auditorium_type}`);
                }).catch(error => {
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(`Error: ${error}`);
                });
            });
        }
    }

    else if (request.method === 'DELETE') {
        if (request.url.startsWith('/api/faculties/')) {
            const facultyCode = request.url.split('/')[3];
            prismaClient.fACULTY.delete({
                where: {
                    FACULTY: facultyCode
                }
            }).then(() => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(`Deleted successfully: ${facultyCode}`);
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            })
        }

        else if (request.url.startsWith('/api/pulpits/')) {
            const pulpitCode = request.url.split('/')[3];
            prismaClient.pULPIT.delete({
                where: {
                    PULPIT: pulpitCode
                }
            }).then(() => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(`Deleted successfully: ${pulpitCode}`);
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }

        else if (request.url.startsWith('/api/subjects/')) {
            const subjectCode = request.url.split('/')[3];
            prismaClient.sUBJECT.delete({
                where: {
                    SUBJECT: subjectCode
                }
            }).then(() => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(`Deleted successfully: ${subjectCode}`);
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }

        else if (request.url.startsWith('/api/teachers/')) {
            const teacherCode = request.url.split('/')[3];
            prismaClient.tEACHER.delete({
                where: {
                    TEACHER: teacherCode
                }
            }).then(() => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(`Deleted successfully: ${teacherCode}`);
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }

        else if (request.url.startsWith('/api/auditoriumstypes/')) {
            const typeCode = request.url.split('/')[3];
            prismaClient.aUDITORIUM_TYPE.delete({
                where: {
                    AUDITORIUM_TYPE: typeCode
                }
            }).then(() => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(`Deleted successfully: ${typeCode}`);
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }

        else if (request.url.startsWith('/api/auditoriums/')) {
            const auditoriumCode = request.url.split('/')[3];
            prismaClient.aUDITORIUM.delete({
                where: {
                    AUDITORIUM: auditoriumCode
                }
            }).then(() => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(`Deleted successfully: ${auditoriumCode}`);
            }).catch(error => {
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(`Error: ${error}`);
            });
        }
    }
});

server.listen(3000);

console.log('Server is http://localhost:3000');