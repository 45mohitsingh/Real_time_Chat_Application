//responsible for creating and fetching one on one chat
//current user send us user id and check if chat exist then show else create

const expressAsyncHandler = require("express-async-handler");
const Chat = require('../Models/chatModels');
const User = require('../Models/userModel');
const accessChat = expressAsyncHandler(async(req,res) =>{
    const {userId} = req.body;
    
    if(!userId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    var isChat  = await Chat.find({
        isGroupChat : false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id}}},
            { users: { $elemMatch: { $eq: userId}}},
        ],
    }).populate("users","-password").populate("latestMessage");

    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "name pic email",
    });
    if(isChat.length >0){
        console.log("chat already exist");
        res.send(isChat[0]);
    }
    else{
        console.log("creating chat data");
       var chatData={
        chatName: "sender",
        group: false,
        users: [req.user._id,userId],
       } ;
       try{
          const createChat =await Chat.create(chatData);
          const FullChat = await Chat.findOne({_id: createChat._id}).populate(
            "users",
            "-password"
            );
            console.log("try creating chat data");
            // console.log(FullChat);
          res.status(200).json(FullChat);
       }catch(error){
          res.status(400);
          throw new Error(error.message);
       }
    }

});

const fetchChats= expressAsyncHandler(async(req,res)=>{
    try{
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (results)=>{
            results = await User.populate(results,{
                path: "latestMessage,sender",
                select: "name pic email",
            });
        res.status(200).send(results);
        });
    }catch(error){
     res.status(400);
     throw new Error(error.message);
    }
})
module.exports ={accessChat, fetchChats};