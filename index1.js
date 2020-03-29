'use strict';
const http = require('http');
const auth = require('http-auth');
const pug = require('pug');
const basic = auth.basic({
    realm: 'Enter username and password',
    file: './password'
});

const server = http.createServer(basic.check((req, res) => {
    switch (req.url) {
    case '/top':
        break;
    default:
        break;
    }
}));

const port = 8000;
server.listen(port, () => {
    console.info('Listening on ' + port);
});
