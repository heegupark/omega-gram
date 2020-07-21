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
app.use(staticMiddleware);
app.use(express.json());
// for socket communication
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});
io.on('connection', socket => {
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  });
});
// routing
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
server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('[http] Server listening on port', process.env.PORT);
});
