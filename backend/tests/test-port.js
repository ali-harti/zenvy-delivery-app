const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3005, () => {
    console.log('Server running on 3005');
});
