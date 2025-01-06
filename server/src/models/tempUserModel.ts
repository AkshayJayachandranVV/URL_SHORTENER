import mongoose from 'mongoose';
import { IUserModel } from '../domain/entities/IAuth';

export interface IUserDocument extends IUserModel, mongoose.Document { }

const tempUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    otp: {
        type: String,
        required: true,
        minlength: 6
    },
    expiresAt: {
        type: Date,
        required: true,
        default: Date.now, 
        expires: 1800
    }
}, {
    timestamps: true  
});

// Create the model
const TempUserModel = mongoose.model<IUserDocument>('TempUserModel', tempUserSchema);

export default TempUserModel;
