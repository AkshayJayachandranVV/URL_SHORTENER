import express from 'express';
import {urlRedirectController} from '../controllers/urlRedirectController';

const urlRedirectRouter = express.Router();

urlRedirectRouter.get('/:code',urlRedirectController.urlRedirect);

export default urlRedirectRouter