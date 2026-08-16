import express from 'express';
import cors  from 'cors'
import helmet from 'helmet'
import prisma from "./lib/prisma.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import notFoundHandler from './middlewares/not-found.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.json({urlencoded: true}))

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Coder's Shop API is running",
  });
});

app.get('/', (req,res) =>{
    res.end("Hello");
})

app.get("/health", async (req, res) => {
  try {
    console.log("1")
    await prisma.$queryRaw`SELECT 1`;
    console.log("2")

    res.json({
      success: true,
      message: "API is healthy",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Service unavailable",
      database: "disconnected",
    });
  }
});


/**
 * description Error HandelingMiddlewRE
 */
app.use(errorHandler);
app.use(notFoundHandler)


export default app;

