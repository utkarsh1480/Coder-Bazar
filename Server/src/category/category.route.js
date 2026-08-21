
import express from 'express'
import {getAllCategory} from './category.controller.js'
import {requireAuth} from '../middlewares/auth.middleware.js'

const categoryRouter = express.Router();


/**
  * @route /api/category/get-All-category
  * @description get all category
  * @access public
  */

categoryRouter.get('/',requireAuth, getAllCategory);



export default categoryRouter



