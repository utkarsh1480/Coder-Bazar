
import express from 'express'
import {getAllCategory} from './category.controller.js'


const categoryRouter = express.Router();


/**
  * @route /api/category/get-All-category
  * @description get all category
  * @access public
  */

categoryRouter.get('/', getAllCategory);



export default categoryRouter



