import {createContext, useContext, useEffect, useState} from "react";
import { useHistory, withRouter } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children})=>{
    const [user,setUser]= useState();
    const [SelectedChat,setSelectedChat]=useState([]);
    const [chats, setChats] =useState([]);
    const history = useHistory();

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        
            if(!userInfo) {
                // console.log("enter");
                history.push("/");
                // console.log("exit");
          
            }
            // console.log("transfer t0 home route");   
    },[history]); 
    return (
    <ChatContext.Provider value={{user,setUser, SelectedChat,setSelectedChat, chats, setChats}}>{children}</ChatContext.Provider>
    );
};

export const ChatState =() =>{
    // console.log(useContext(ChatContext));
    return useContext(ChatContext);
};
export default (ChatProvider);