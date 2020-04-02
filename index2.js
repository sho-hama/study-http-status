'use strict';
const http = require('http');
const auth = require('http-auth');
const pug = require('pug');
const basic = auth.basic({
    realm: 'Enter username and password',
    file: './password'
});

//勤怠履歴
var history = [];

const server = http.createServer(basic.check((req, res) => {
    switch (req.url) {
    case '/top':
        if(req.method === 'GET'){
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.end(pug.renderFile('./views/index2.pug', {
                history: history,
                user: req.user
            }));            
        }
        else{
            handleBadRequest(req, res);
        }
        break;
    default:
        break;
    }
}));

function handleBadRequest(req, res) {
    res.writeHead(400, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    const message = "未対応のリクエストです。";
    res.end('status code :' + res.statusCode + " " + message);
}

const port = 8000;
server.listen(port, () => {
    console.info('Listening on ' + port);
});
