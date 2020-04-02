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
    case '/old-url' :
        handleMovedPermanently(req, res);
        break;
    case '/logout' :
        handleUnauthorized(req, res);
        break;
    default:
        handleNotFound(req, res);
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

function handleMovedPermanently(req, res) {    
    res.writeHead(301, {
        'Content-Type': 'text/html; charset=utf-8',
        'Location' : '/top'
    });
    res.end('<!DOCTYPE html><html lang="jp"><body>' +
            '<h1>新しいURLに移動しました</h1>' +
            '<a href="/top">新しいほう</h1>' +
            '</body></html>');
}

function handleUnauthorized(req, res) {
    res.writeHead(401, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.end('<!DOCTYPE html><html lang="jp"><body>' +
            '<h1>ログアウトしました</h1>' +
            '<a href="/top">ログイン</h1>' +
            '</body></html>');
}

function handleNotFound(req, res){
    res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    const message = "指定したURLが見つかりません。";
    res.end('status code :' + res.statusCode + " " +message);
}

const port = 8000;
server.listen(port, () => {
    console.info('Listening on ' + port);
});
