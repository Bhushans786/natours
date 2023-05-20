const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB, {
    useNewURLParser: true
}).then(() => console.log('DB connected'));

// Read File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// Data import
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, {
            validateBeforeSave: false
        });
        await Review.create(reviews);
        console.log('Data loaded successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// Delete data fron DB
const deleteAllData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data deleted successfully');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteAllData();
} else {
    console.log('Please specify action : --import or --delete');
    process.exit();
}