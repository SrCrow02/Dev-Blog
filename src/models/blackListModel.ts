import mongoose from 'mongoose';
const { Schema } = mongoose;

const blackListSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});

const BlackList = mongoose.model('BlackList', blackListSchema);

export default BlackList;