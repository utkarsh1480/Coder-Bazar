import app from './index.js'
import dotenv from 'dotenv'
import { createServer } from "http";
import { initializeSocket } from "./socket/index.js";

const server = createServer(app);
const io = initializeSocket(server);

dotenv.config();


const port = process.env.PORT;
server.listen(port, (req,res) =>{
    console.log(`Server is running at port ${port}`)
})
