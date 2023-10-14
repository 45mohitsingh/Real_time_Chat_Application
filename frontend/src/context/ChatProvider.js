import {createContext, useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children})=>{
    const [user,setUser]= useState();

    const history = useHistory();

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
          try{
            if(!userInfo) history.push("/chats");
          }catch(error){
            console.log(error);
          }
       
            // console.log("transfer t0 home route");   
    },[history]); 
    return (
    <ChatContext.Provider value={{user,setUser}}>{children}</ChatContext.Provider>
    );
};

export const ChatState =() =>{
    return useContext(ChatContext);
};
export default ChatProvider;