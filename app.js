import express from 'express';
import logger from 'morgan';
import path from 'path';

import apiRouter from './server/routes/api';
import indexRouter from './server/routes/index';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(`${__dirname}/UI`)));

app.use('/', indexRouter);
app.use('/v1', apiRouter);
app.use('*', (req, res) => {
    res.status(404).json({
        status: 404,
        error: 'link doesn\'t exit on this server',
    });
});

module.exports = app;
