import express from 'express';
import logger from 'morgan';
import path from 'path';
import './server/config/db';

import apiRouter from './server/routes/api';
import userRouter from './server/routes/users';
import indexRouter from './server/routes/index';

const port = process.env.PORT || '3000';
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(`${__dirname}/UI`)));

app.use('/', indexRouter);
app.use('/v1', apiRouter);
app.use('/auth', userRouter);

app.use('*', (req, res) => {
    res.status(404).json({
        status: 404,
        error: 'link doesn\'t exit on this server',
    });
});

app.listen(port);

export default app;
