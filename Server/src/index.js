import express from 'express';
import cors  from 'cors'


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.json({urlencoded: true}))

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Coder's Shop API is running",
  });
});

export default app;

