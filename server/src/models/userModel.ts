import mongoose from 'mongoose';
import { IUserModel } from '../domain/entities/IAuth';

export interface IUserDocument extends IUserModel, Document { }

const userSchema = new mongoose.Schema({
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
    avatar: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    bio: {
        type: String,
        trime: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User