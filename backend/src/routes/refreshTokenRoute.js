
import express from 'express'

import { refreshToken } from '../controllers/refreshToken.js'

const refreshTokenRouter=express.Router();

refreshTokenRouter.post('/refresh-token',refreshToken);

export default refreshTokenRouter;