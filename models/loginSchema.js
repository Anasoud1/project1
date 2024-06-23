const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    telephone: String,
    age: String,
    gender: String,
    country: String
}, { timestamps: true });

const UserLogSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
    token: String,
    customers: [CustomerSchema]
});

const UserLogin = mongoose.model('User', UserLogSchema);

module.exports = UserLogin;