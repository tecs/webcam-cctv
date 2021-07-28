const SocketHandler = require('./SocketHandler');
const { readFileSync } = require('fs');
const path = require('path');

const config = require('./config');
const { tree } = require('./utils');

// Serve existing static files in `public/` or fallback to `index.html`
const pubDir = path.resolve(`${__dirname}/../../public`);
const files = tree(pubDir).map(filePath => `/${filePath}`);
const app = ({ url }, res) => res.end(readFileSync(`${pubDir}${files.includes(url) ? url : '/index.html'}`));

// Setup server
const httpLib = config.https.cert && config.https.key ? 'https' : 'http';
const server = require(httpLib).createServer(config.https, app);

// Setup sockets
const io = require('socket.io')(server);
new SocketHandler(io);

server.listen(config.port, () => console.log(`Listening on port ${config.port}`));
