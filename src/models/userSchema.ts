import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    loginAttempts: {
        type: Number
    },
    lastLoginAttempt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    bio: {
        type: String
    },
    avatar: {
        type: String
    }

});

const User = mongoose.model('User', userSchema);

export default { User };
