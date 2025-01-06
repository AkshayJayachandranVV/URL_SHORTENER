import mongoose from "mongoose";
import dotenv from 'dotenv';
import config from "../config/config";
dotenv.config();

export const dbConnection = async () => {
    try {
        await mongoose.connect(config.DB_URL || '');
        console.log('database connected');
    } catch (error) {
        console.log('error while connecting database',error)
    }
}
