'use strict';
const http = require('http');
const auth = require('http-auth');
const pug = require('pug');
const basic = auth.basic({
    realm: 'Enter username and password',
    file: './password'
});

var history = [];
const server = http.createServer(basic.check((req, res) => {
    switch (req.url) {
    case '/top':
        if(req.method === 'GET'){
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            });
            res.end(pug.renderFile('./views/index.pug', {
                history: history,
                user: req.user
            }));            
        }
        else{
            handleBadRequest(req, res);
        }
        break;
    case '/top/kintai':
        let data = [];
        if(req.method === 'POST'){
            req.on('data', (chunk) => {
                res.writeHead(303, {
                    'Location': '/top'
                });
                data.push(chunk);
            }).on('end', () => {
                data = data.toString();
                const decoded = decodeURIComponent(data);
                let kintai = decoded ? decoded.split('kintai-button=')[1] : '';
                kintai = req.user + ':' + kintai
                history.unshift(kintai);
                res.end();
            })
        }
        else{
            handleBadRequest(req, res);
        }
        break;
    case '/logout':
        res.writeHead(401, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end('<!DOCTYPE html><html lang="jp"><body>' +
                '<h1>ログアウトしました</h1>' +
                '<a href="/top">ログイン</h1>' +
                '</body></html>');
    case '/old-url':
          res.writeHead(301, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end('<!DOCTYPE html><html lang="jp"><body>' +
                '<h1>新しいURLに移動しました</h1>' +
                '<a href="/top">新しいほう</h1>' +
                '</body></html>');
    default:
        res.writeHead(404, {
            'Content-Type': 'text/plain; charset=utf-8'
        });
        const message = "指定したURLが見つかりません。";
        res.end('status code :' + res.statusCode + " " +message);
        break;
    }
}));


function handleBadRequest(req, res) {
    res.writeHead(400, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    const message = "未対応のリクエストです。";
    res.end('status code :' + res.statusCode + " " +message);
}

const port = 8000;
server.listen(port, () => {
    console.info('Listening on ' + port);
});

