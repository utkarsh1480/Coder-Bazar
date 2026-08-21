import express from 'express'
import {registerUser, login, getMe, logout} from './auth.controller.js'
import {requireAuth} from '../middlewares/auth.middleware.js'
import { } from './auth.controller.js'


const authRouter = express.Router();


/**
 *@route /api/auth/register
 8@description Register user 
 *access public 
 */

 authRouter.post('/register', registerUser)


/**
 *@route /api/auth/login
 *@description authenticate the user 
 *@access public
 */

 authRouter.post('/login', login)


 /**
 *@route /api/auth/logout
 *@description logout the user 
 *@access public
 */

 authRouter.get('/logout',requireAuth, logout)

  /**
 *@route /api/auth/getMe
 *@description Get Current User
 *@access Private
 */

 authRouter.get('/get-Me', requireAuth,  getMe)


export default authRouter;