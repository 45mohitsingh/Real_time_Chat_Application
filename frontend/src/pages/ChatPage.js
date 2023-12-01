// import React, { useEffect , useState} from 'react'
// import axios from "axios";

// const ChatPage = () => {
//     const [chats,setChats]=useState([]);
//     const fetchChats=async ()=>{
//         const {data}= await axios.get("/api/chats");
//         console.log(data);
//         setChats(data);

//     };
//     useEffect(()=>{
//         fetchChats()
//     },[])
//   return (
//     <div>
//     {chats.map(chat=>(<div key={chat._id}>{chat.chatName}</div>))}
//     </div>
//   );
// }

// export default ChatPage

import { Box, Flex, Spacer } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
const ChatPage = () => {
  const { user } = ChatState();
  // console.log(user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      {/* <Flex> */}
      <Box p="10px"  w="100%"  display="flex" justifyContent="space-between" h="90%">
        {user && <MyChats />}
        {user && <ChatBox />}
        </Box>
      {/* </Flex> */}
    </div>
  );
};

export default ChatPage;
