import express from 'express';
import cors  from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import prisma from "./lib/prisma.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import notFoundHandler from './middlewares/not-found.middleware.js';
import router from './routes/router.js';

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.json({urlencoded: true}))
app.use(cookieParser())

app.use('/api', router);



/**
 * description Error HandelingMiddlewRE
 */
app.use(errorHandler);
app.use(notFoundHandler)


export default app;

