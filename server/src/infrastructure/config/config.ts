import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: parseInt(process.env.PORT as string),
    DB_URL: process.env.DB_URL,
    EMAIL: process.env.EMAIL,
    EMAIL_PASS : process.env.EMAIL_PASS,
    JWT_SECRET : process.env.JWT_SECRET
}

export default config