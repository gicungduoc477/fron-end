// server.js
const jsonServer = require('json-server'); // ✅ Giữ nguyên


const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Đường dẫn đến db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Ghi lại file db.json mỗi khi POST, PUT, DELETE
server.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.on('finish', () => {
      const dbFile = path.join(__dirname, 'db.json');
      fs.writeFileSync(dbFile, JSON.stringify(router.db.getState(), null, 2));
    });
  }
  next();
});

server.use(router);

server.listen(3000, () => {
  console.log('✅ JSON Server is running at http://localhost:3000');
});
