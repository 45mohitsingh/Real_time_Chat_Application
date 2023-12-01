import React, { useEffect, useState } from 'react'
import axios from "axios"
import { ChatState } from '../context/ChatProvider'
import { Text, Box, IconButton, Spinner, FormControl,Input, useToast, effect } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import { getSender , getSenderDetail} from '../config/chatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import { Image } from "@chakra-ui/react"


const ENDPOINT = "http://localhost:3001";
var socket, selectedChatCompare;

const SingleChat = () => {


    const [messages,setMessages]= useState([]);
    const [loading, setLoading]= useState(false);
    const [newMessage,setNewMessage] = useState();
    const toast = useToast();
    const {user,SelectedChat, setSelectedChat}= ChatState();
    const [socketConnected,setSocketConnected]= useState(false);
    const [typing , setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    const fetchMessages= async()=>{
      //_id
      if(!SelectedChat){
        // console.log("not_selected");
        return;
      }
      // console.log(SelectedChat._id);
      try{
        const config ={
          headers: {
           Authorization:`Bearer ${user.token}`,
          },
        };
        setLoading(true);
        const {data} = await axios.get(`/api/message/${SelectedChat._id}`,config);
        setMessages(data);
        //  console.log(data);
        setLoading(false);
        socket.emit('join chat', SelectedChat._id);
        
      }catch(error){
        toast({
          title:"Error occured",
          description: "Failed to load the Message",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom"
        });
      }

    };
 
    useEffect(()=>{
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on('connected',()=> setSocketConnected(true));
      socket.on('typing', ()=>setIsTyping(true));
      console.log("before"+isTyping);
      socket.on("stop typing ", ()=>  setIsTyping(false));
      socket.on("stop typing ", ()=> CheckTyping);
      

      // eslint-disable-next-line
   },[])
    
    const CheckTyping =()=>{
      setIsTyping(false);
      console.log("after"+isTyping)
    }

    useEffect(()=>{
     fetchMessages();

     selectedChatCompare = SelectedChat;
    },[SelectedChat]);

    useEffect(() => {
    // if(SelectedChat._id)console.log(messages) 
    }, [messages]);
   
    useEffect(() => {
      // console.log("this is check" + typing);
      }, [typing]);


    useEffect(()=>{
      socket.on("message recieved",(newMessageRecieved)=>{
   
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
          //give neicaton
        }
        else{
          setMessages([...messages,newMessageRecieved]);
        }
      });
    })

    const sendMessage= async(e)=> {
      if(e.key==="Enter" && newMessage){
        socket.emit("stop typing",SelectedChat._id);
        try {
          const config ={
            headers: {
             "Content-Type": "application/json",
             Authorization:`Bearer ${user.token}`,
            },
          }
          
          const {data}= await axios.post("/api/message",{
            content:newMessage,
            chatId: SelectedChat._id,
          },
          config);
          setNewMessage("");
            // console.log(data);
          
            socket.emit('new message',data);
          setMessages([...messages,data]);
        } catch(error){
          toast({
            title:"Error occured",
            description: "Failed to send the Message",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom"
          });
        }
      }
    }


    const typingHandler= (e)=>{
      setNewMessage(e.target.value);
      
      // Typing INdicator logic
      if(!socketConnected)return;
      let typingHelper=typing;
      if(!typing){
        setTyping(true);
        socket.emit("typing", SelectedChat._id);
      }

      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      typingHelper=typing
      setTimeout(()=>{
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        // console.log("sotp1: "+ timeDiff+ typing);
        
        if(timeDiff >= timerLength && typing){
          socket.emit("stop typing",SelectedChat._id);
          // console.log("sotp2");
          setTyping(false);
        }
   
      },timerLength)
    };
    // if(Array.isArray(SelectedChat) && SelectedChat.length)console.log(SelectedChat);
  return (
    <>
    { (SelectedChat?._id)?(
        <>
         <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton 
            display={{base:"flex", md:"none"}}
            icon={<ArrowBackIcon />}
            onClick={()=>setSelectedChat("")}
            />
            <>
            {getSender(user,SelectedChat.users)}
            <ProfileModal user={getSenderDetail(user,SelectedChat.users)}/>
            </>
          </Text>

          <Box
          className='chatimage'
         display="flex"
         flexDir="column"
         justifyContent="flex-end"
         p={3}
         bg="#E8E8E8"
         w="100%"
         h="100%"
         borderRadius="lg"
         overflowY="hidden"

        >
            {/* <Image
    src=""
    alt="Horizon UI"
  /> */}
      {loading? (
        <Spinner 
          size="xl"
          w={20}
          h={20}
          alignSelf="center"
          margin="auto"
        />
      ):(
       <>
       <div className='messages'>
        <ScrollableChat  messages={messages}/>
        </div>
       </>
      )}
      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
        {/* {isTyping?<div>loading...</div>:<></>} */}
        <Input 
          variant="filled"
          bg="#E0E0E0"
          placeholder="Enter a message.."
          onChange={typingHandler}
          value={newMessage}
        />
      </FormControl>
        </Box>
        </>
    ):(
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
        
      </Box>
    )}
    </>
  )
}

export default SingleChat







