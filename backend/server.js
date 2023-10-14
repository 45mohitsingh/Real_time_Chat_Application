const express=require("express");
const dotenv=require("dotenv");
const {chats} = require("./data");
const connectDB =require("./config/db");
const userRoutes=require('./routes/userRoutes');
const chatsRoutes = require('./routes/chatRoutes');
const {notFound,errorHandler}= require('./middleware/errorMiddleware');

dotenv.config();
connectDB();
const app=express();

app.get("/",(req,res)=>{
    res.send("api working");
});

app.use(express.json());
// app.get("/api/chats",(req,res)=>{
//     res.send(chats);
// });

// app.get("/api/chats/:id",(req,res)=>{
//     // console.log(req);
//     const singleChat=chats.find((ch)=>ch._id===req.params.id);
//     res.send(singleChat);
// });
app.use('/api/user',userRoutes);
app.use('/api/chats',chatsRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT=process.env.PORT || 3000;
app.listen(PORT,console.log(`listining to port 3000 via terminal ${PORT}`));