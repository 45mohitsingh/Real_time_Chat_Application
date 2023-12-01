import React,{useState} from 'react'
import {Box, Text} from '@chakra-ui/layout'
import { useDisclosure,
  Tooltip ,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner
  } from '@chakra-ui/react';
// import {useDisclosure} from "@chakra-ui/hooks"
import { BellIcon,ChevronDownIcon } from '@chakra-ui/icons'
import {ChatState } from "../../context/ChatProvider"
import ProfileModal from "./ProfileModal"
import {useHistory} from "react-router-dom"
import ChatLoading  from '../ChatLoading';
import UserListItem from "../UserAvatar/UserListItem"
import axios from 'axios';
const SideDrawer = () => {
    const [search, setSearch]= useState("");
    const [searchResult, setSearchResult]=useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat,setLoadingChat]= useState();

    const {user, setSelectedChat, chats,setChats }= ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler =()=>{
      localStorage.removeItem("userInfo");
      history.push("/");
    };
    const toast =useToast();


    const handleSearch = async()=>{
      if(!search){
         toast({
          title:"please Enter something",
          status: "warning",
          duration:5000,
          isClosable: true,
          position: "top-left",
         });
         return;
      }
      try{
        // console.log("try enter 1");
        setLoading(true);

        const config ={
          headers: {
            Authorization: `Bearer ${user.token}`,
        },
      };
      // console.log("try enter 2", search, user.token);
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log("reached");
      setLoading(false);
      setSearchResult(data);
      } catch(error){
         toast({
          title:"Error occured",
          description: error.message,
          status: "error",
          duration:5000,
          isClosable: true,
          position: "bottom-left"
         })
      }
    };


    const accessChat = async(userId) =>{
      // console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(userId);
      const { data } = await axios.post(`/api/chats`, { userId }, config);
         console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    }; 
  return (<>
     <Box
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     bg="white"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth="5px"
     >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} >
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
        ZenChat        </Text>
        <div>
         <Menu>
            <MenuButton p={1}>
               <BellIcon  fontSize="2xl" m={1}/>
            </MenuButton>
            {/* <MenuList></MenuList> */}
         </Menu>
         <Menu>
         <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
           <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
            </MenuButton>
           <MenuList>
            <ProfileModal user={user}>
            <MenuItem>My profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
           </MenuList>
         </Menu>
        </div>
     </Box>
     <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
       <DrawerOverlay/>
        <DrawerContent>
           <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
           <DrawerBody>
          <Box display="flex" pb={2}>
           <Input 
           placeholder="Search by name or email"
           mr={2}
           value={search}
           onChange={(e)=>setSearch(e.target.value)}
           />
           <Button 
           onClick={handleSearch}
           >Go</Button>
          </Box>
          {
          loading?(
            <ChatLoading/>
          ):
          (
            searchResult?.map(user =>(
              <UserListItem 
              key={user._id}
              user={user}
              handleFunction={()=>accessChat(user._id)}
              />
            ))
          )
          }
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
        </DrawerContent>
       
     </Drawer>
   </>);
};

export default SideDrawer
