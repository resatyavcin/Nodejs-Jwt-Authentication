const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.DB_STRING, function (err, conn) {
        try {
            console.error('Successfully connected to Database');
        } catch (err) {
            console.error(err);
        }
    });
};