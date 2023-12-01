import React from 'react';
import { ChatState } from '../context/ChatProvider';
import {Box} from '@chakra-ui/react';
import SingleChat from './SingleChat';
const ChatBox = () => {

  const {SelectedChat} = ChatState();
  // SelectedChat?console.log("SelectedChat"):console.log("not selected");
  return <Box
  display={{base: SelectedChat._id ? "flex" : "none" , md: "flex"}}
  alignItems="center"
  flexDir="column"
  p={3}
  bg="white"
  w={{base: "100%" , md:"68%"}}
  borderRadius="lg"
  borderWidth="1px"
  >
   <SingleChat />
  </Box>
  
}

export default ChatBox
