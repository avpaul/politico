const express = require('express');

const apiRouter = require('./server/routes/api');
const indexRouter = require('./server/routes/index');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/v1', apiRouter);

// catch 404
app.use((req, res) => {
    res.json();
});

module.exports = app;
