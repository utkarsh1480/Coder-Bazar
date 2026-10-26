import express from 'express';
import cors  from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from "node:url";
import prisma from "./lib/prisma.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import notFoundHandler from './middlewares/not-found.middleware.js';
import router from './routes/router.js';
import {apiLimiter} from './middlewares/rate-limit.middleware.js'

const app = express();
const legacyImageDirectory = fileURLToPath(new URL("../uploads/", import.meta.url));


app.use(helmet());
const allowedOrigins = [
  "http://localhost:5174",
  "https://coder-bazar.vercel.app",
  "https://coder-bazar-bqpq-bciqbvfv8-utkarshs-projects-5bbbe440.vercel.app",
  "https://coder-bazar-bqpq-ochre.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json({limit: '100kb'}));
app.use(express.json({urlencoded: true}))
app.use(cookieParser())
app.use(
  '/uploads',
  express.static(legacyImageDirectory, {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use('/api',apiLimiter)
app.use('/api', router);



/**
 * description Error HandelingMiddlewRE
 */
app.use(errorHandler);
app.use(notFoundHandler)


export default app;
