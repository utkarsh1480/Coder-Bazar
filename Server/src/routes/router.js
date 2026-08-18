import express from 'express'
import authRouter from '../auth/auth.routes.js'

const router = express.Router();


/**
 *@route /api/auth
 8@description all Auth Router
 *access public 
 */
 router.use('/auth', authRouter)




export default router;