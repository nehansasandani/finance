const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema
const userSchema = mongoose.Schema({
    firstname: {
        required: [true, "First name is required"],
        type: String,
    },
    lastname: {
        required: [true, "Last name is required"],
        type: String,
    },
    email: {
        required: [true, "Email is required"],
        type: String,
        unique: true,
    },
    password: {
        required: [true, "Password is required"],
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password verification method
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Compile schema into model with custom collection name
const User = mongoose.model('User', userSchema, 'finmembers');

module.exports = User;
