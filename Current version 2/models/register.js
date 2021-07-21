const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const regSchema = new mongoose.Schema({
    userid: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        //unique: true
    },
    phone: {
        type: Number,
        require: true,
        //unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }
})

//hashing
regSchema.pre('save', async function(next) {
    console.log("Hashing")
    if (this.isModified('password'));
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, 12);
    console.log(this.password)
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 12);
    console.log(this.confirmpassword)
    console.log("Hashed")
})

// collection
module.exports = new mongoose.model('Register', regSchema);
//const Register = new mongoose.model("Register", regSchema)

//module.exports = Register;