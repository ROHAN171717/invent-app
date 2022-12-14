const express=require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const cors=require("cors");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const userRoute=require("./routes/userRoute");
const errorHandler=require("./middleWare/errorMiddleware");




const app=express();
dotenv.config();

//MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false} ));
app.use(bodyParser.json());


//ROUTES MIDDLEWARE
app.use("/users",userRoute);




//ROUTES
app.get("/",(req,res)=>{
    res.send("Home Page");
});

//ERROR MIDDLEWARE
// app.use(errorHandler);



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