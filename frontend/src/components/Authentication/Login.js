import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { warning } from 'framer-motion';
import axios from 'axios';
import {useHistory} from "react-router-dom";

const Login = () => {

    const[show,setShow]=useState(false);
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const toast = useToast();
    const history = useHistory();
    const [loading,setLoading]=useState(false);

    // handleClick= () =>setShow(!show);
    function handleClick(){
        setShow(!show)
    };
    const submitHandler=async()=>{
      setLoading(true);
      if(!email || !password ){
       toast({
           title: 'Please Fill all the Fields',
           // description: "We've created your account for you.",
           status: "warning",
           duration: 6000,
           isClosable: true,
         });
         setLoading(false);
         return;
      }
      try{
       const config ={
           headers: {
              "content-type": "application/json", 
           },
       };
       const {data}= await axios.post("/api/user/login",{email,password},config);
       toast({
           title: 'Login Succesful',
           // description: "We've created your account for you.",
           status: 'success',
           duration: 6000, 
           isClosable: true,
         });
         localStorage.setItem("userinfo",JSON.stringify(data));
         setLoading(false);
         history.push("/chats");
      }catch(error){
        toast({
           title: 'Error occured',
           description: error.response.data.message,
           status: 'error',
           duration: 6000,
           isClosable: true,
         });
         setLoading(false);
      }
    };
  return (
    <VStack spacing={'5px'}>

     <FormControl id='email' isRequired>
    <FormLabel>Email</FormLabel>
    <input
    value={email}
    placeholder='Enter Your Email'
    onChange={(e)=>setEmail(e.target.value)}></input>
     </FormControl>

     
     <FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>
    <input
    type={show?'text':'password'}
    value={password}
    placeholder='Password'
    onChange={(e)=>setPassword(e.target.value)}
    />
    <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show?"Hide":"Show"}
        </Button>
    </InputRightElement>
</InputGroup>
     </FormControl>

     <Button
     colorScheme='blue'
     width='100%'
     style={{marginTop:15}}
     onClick={submitHandler}
     isLoading={loading}
     >Login</Button>
     <Button
     variant='solid'
     colorScheme='red'
     width='100%'
     onClick={() =>{
        setEmail("guest@example.com");
        setPassword("12345678");
     }}
     >Get Guest User Credentials</Button>
    </VStack>
  ) 
  
}

export default Login
