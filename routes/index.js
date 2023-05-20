const express = require('express');

const router = express.Router();
const tourRouter = require('./tourRoutes');
const userRouter = require('./userRoutes');
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./boookingRoutes');

router.use('/tours', tourRouter);
router.use('/users', userRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);

module.exports = router;