import express from 'express';
import {urlController} from '../controllers/urlController';
import authencticateToken from '../../interface/middlewares/authMiddleware';

const urlRouter = express.Router();

urlRouter.post('/urlShorten',authencticateToken('user'),urlController.urlShorten);

export default urlRouter