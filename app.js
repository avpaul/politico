import express from 'express';
import logger from 'morgan';
import path from 'path';
import ENV from 'dotenv';
import cors from 'cors';
import './server/config/db';

import apiRouter from './server/routes/api';
import userRouter from './server/routes/users';
import indexRouter from './server/routes/index';

ENV.config();

const port = process.env.PORT || '3000';
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(`${__dirname}/UI`)));

app.use('/', indexRouter);
app.use('/api//v1', apiRouter);
app.use('/api/v1/auth', userRouter);

app.use('*', (req, res) => {
    res.status(404).json({
        status: 404,
        error: 'link doesn\'t exit on this server',
    });
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
        .json({
            status: err.status || 500,
            error: err.message,
        });
});


app.listen(port);

export default app;
