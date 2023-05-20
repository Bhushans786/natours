const path = require('path');
const express = require('express');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const middleware = app => {

    app.use(cors());
    app.enable('trust proxy ');

    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'views'));

    // global middleware

    // Serving static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Set security HTTP headers
    app.use(helmet());

    // Logging
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // API limiter
    const limiter = ratelimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: 'Too many request from this IP, please try again in an hour'
    });
    app.use('/api', limiter);

    // Body parser, reading data from body into req.body
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use(cookieParser());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization against XSS
    app.use(xss());

    // Prevent parameter pollution
    app.use(
        hpp({
            whitelist: [
                'duration',
                'ratingsQuantity',
                'ratingsAverage',
                'maxGroupSize',
                'difficulty',
                'price'
            ]
        })
    );

    app.use(compression());

    // Testing middleware
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });
}

module.exports = middleware;