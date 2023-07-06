const mongoose = require("mongoose");
const unique_validator = require("mongoose-unique-validator");
const validator=require("email-validator");


const userschema= mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true}
});

userschema.plugin(unique_validator);

module.exports = mongoose.model("user", userschema);