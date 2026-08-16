import app from './index.js'
import dotenv from 'dotenv'

dotenv.config();


const port = process.env.PORT;
app.listen(port, (req,res) =>{
    console.log(`Server is running at port ${port}`)
})
