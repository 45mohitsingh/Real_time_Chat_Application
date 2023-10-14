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


import {Box} from "@chakra-ui/layout";
import {ChatState} from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
const ChatPage =()=>{
  const {user} = ChatState();
  return <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box>
      {/*{user && <MyChats/>}
      {user && <ChatBox/>} */}
      </Box>
  </div>;
};

export default ChatPage;