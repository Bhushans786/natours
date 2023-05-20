const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes');
const AppError = require('./utils/appError');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const middleware = require('./middleware');
const bookingController = require('./controllers/bookingController');

const app = express();

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    // bodyParser.raw({ type: 'application/json' }),
    bookingController.webhookCheckout
);

middleware(app);


// View Router
app.use('/', viewRouter);
// Api Router
app.use('/api/v1', router);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Invalid route: ${req.originalUrl}`
    // });

    // const err = new Error(`Invalid route: ${req.originalUrl}`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Invalid route: ${req.originalUrl}`, 404))
});

app.use(globalErrorHandler);

module.exports = app;