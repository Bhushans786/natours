const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB, {
    useNewURLParser: true
}).then(() => console.log('DB connected'))
// .catch(err => { // 
//     console.log(err);
// });


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log('listening', PORT);
});

// 
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err, err.message);
    server.close(() => {
        process.exit(1);
    });
});