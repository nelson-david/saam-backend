const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    fullname: String,
    username: String,
    user_id: String,
    password: String,
    profile_picture: Object,
    gender: String,
    email: String,
    date_joined: Date,
    location: String,
    messages: Array,
    settings: Array,
    confirmation_code: Number,
    balance_info: Object,
}, {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false
});

module.exports = mongoose.model("User", user);