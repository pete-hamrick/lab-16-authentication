const express = require('express');

const app = express();

app.use(express.json());

app.use('/signup', require('./controllers/auth.js'));

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
