import app from './index.js'
import "dotenv/config";


const port = process.env.PORT|| 5000;
app.listen(port, (req,res) =>{
    console.log(`Server is running at port ${port}`)
})
