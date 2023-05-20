const morgan = require('morgan');
const express = require('express');

const router = require('./routes');

const middleware = app => {

    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.static(`${__dirname}/public`));

    app.use((req, res, next) => {
        console.log('Middleware');
        next();
    });
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });
    app.use('/api/v1', router);
}

module.exports = middleware;