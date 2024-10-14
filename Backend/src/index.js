import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import connectDB from "./db/dbConnect.js"
import app from "./app.js"


connectDB().then(()=>{
    app.listen(5217 , ()=>
       { console.log(`Server is running on the port : ${process.env.PORT}`)}
    )
})
.catch((err)=>{
    console.log("DB connection failed")
})


