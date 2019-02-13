const express = require('express');
const logger = require('morgan');

const apiRouter = require('./server/routes/api');
const indexRouter = require('./server/routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/v1', apiRouter);

module.exports = app;
