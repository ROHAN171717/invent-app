const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");

const app=express();
dotenv.config();

//MIDDLEWARE
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Home Page");
});



//MONGODB CONNECTION
const MONGO_URL=process.env.MONGO_URL;
mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('CONNECTION SUCCESSFULL...:)');
}).catch((err)=>{
    console.log(err,"<-- error from DB CONNECTION");
    
})


const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server Running on PORT ${PORT}`);
})