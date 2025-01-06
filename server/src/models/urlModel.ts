import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  urlCode: { type: String, required: true, unique: true },
  owner: { type: String, required: true }, 
  date: { type: Date, default: Date.now },
});

export const Url = mongoose.model('Url', urlSchema);
