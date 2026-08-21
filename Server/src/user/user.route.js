import express from "express";
import {updateProfile, getUserProfile} from './user.controller.js'
import {requireAuth} from '../middlewares/auth.middleware.js'
const userRouter = express.Router();


userRouter.patch('/me',requireAuth, updateProfile )


userRouter.get('/:id', getUserProfile);



export default userRouter;