require('dotenv/config');
require('./db/mongoose');
const userRouter = require('./routers/user');
const noteRouter = require('./routers/note');

const express = require('express');
const cors = require('cors');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const https = require('https');
const fs = require('fs');

const app = express();
app.use(userRouter);
app.use(noteRouter);
app.use(cors());
app.use(express.json());
app.use(staticMiddleware);
app.use(sessionMiddleware);

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

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
