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
const https = require('https');
const fs = require('fs');
app.use(staticMiddleware);
app.use(express.json());
app.use(userRouter);
app.use(gramRouter);
app.use(likeRouter);
app.use(commentRouter);
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
  app.listen(process.env.PORT, () => {
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
