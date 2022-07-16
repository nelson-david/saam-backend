const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waitlist = new Schema({
    name: String,
    email: String,
    date_joined: Date,
}, {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false
});

module.exports = mongoose.model("Waitlist", waitlist);