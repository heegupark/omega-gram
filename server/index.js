require('dotenv/config');
require('./db/mongoose');
const userRouter = require('./routers/user');
const gramRouter = require('./routers/gram');
const likeRouter = require('./routers/like');
const commentRouter = require('./routers/comment');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
app.use(staticMiddleware);
app.use(express.json());
// for socket communication
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
io.on('connection', socket => {
  // eslint-disable-next-line no-console
  console.log('New client connected');
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  });
});
app.use(function (req, res, next) {
  req.io = io;
  next();
});
// Routing
app.use(userRouter);
app.use(gramRouter);
app.use(likeRouter);
app.use(commentRouter);
// for error handling
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});
if (process.env.ENV === 'DEV') {
  server.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log('[http] Server listening on port', process.env.PORT);
  });
} else if (process.env.ENV === 'LIVE') {
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/city.heegu.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/city.heegu.net/fullchain.pem')
  },
  app).listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
    console.log(`[https] Server listening on port ${process.env.PORT}`);
  });
}
