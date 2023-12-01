import React from 'react'
import axios from 'axios';
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from '../context/ChatProvider';
import { Box, Stack, Text } from '@chakra-ui/react'
import ChatLoading from './ChatLoading';
import { getSender } from '../config/chatLogics';


const  MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const { SelectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chats", config);
      setChats(data);
      // console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(()=>{
     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
     fetchChats();
  },[])
  
  const err= (chat)=>{
    setSelectedChat(chat);
    // console.log(chat);
    // console.log("aftersetting ",SelectedChat._id);
  }
    // SelectedChat._id?console.log("SelectedChat"):console.log("not selected");

  return (
  <Box
  display={{ base: SelectedChat?._id ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      padding={3}
      bg="white"
      width={{base: "90%", md:"31%"}}
      borderRadius="lg"
      borderWidth="1px">
        <Box
         pb={3}
         px={3}
         fontSize={{ base: "28px", md: "30px" }}
         fontFamily="Work sans"
         display="flex"
         w="100%"
         justifyContent="space-between"
         alignItems="center">
            My chats
        </Box>
  <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden">
            {chats ?(
               <Stack overflowY='scroll'>
                {chats.map((chat)=>(
                  <Box
                  // onClick={() => setSelectedChat(chat)}
                  onClick={() => err(chat)}
                  
                  cursor="pointer"
                  bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={SelectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  >
                   <Text>
                    {getSender(loggedUser,chat.users)}
                   </Text>
                  </Box> 
                ))}
               </Stack>
            ): (
              <ChatLoading/> 
            )} 

  </Box>
  </Box>

  )
}

export default MyChats
