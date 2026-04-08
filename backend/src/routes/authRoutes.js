
import express from 'express'
import { login, logout, register } from '../controllers/AuthUser.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { getAllUsers } from '../controllers/getAllUsers.js';
import { editProfile } from '../controllers/editProfile.js';
import upload from '../middleware/upload.js';

export const authRouter=express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login)
authRouter.post('/logout',protectUser,logout)

authRouter.get('/users',protectUser,getAllUsers)
authRouter.put('/edit-details',protectUser,upload.single("photo"),editProfile)
