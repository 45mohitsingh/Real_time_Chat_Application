import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { warning } from 'framer-motion';
import axios from 'axios';
import {useHistory} from "react-router-dom";

const Signup = () => {
    const[show,setShow]=useState(false);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmpassword,setConfirmPassword]=useState();
    const [pic,setPic]=useState();
    const [loading,setLoading]=useState(false);
    const toast = useToast();
    const history = useHistory();
    // handleClick= () =>setShow(!show);
    
    function handleClick(){
        setShow(!show)
    };
    const postDetails =(pics)=>{
        setLoading(true);
        if(pics===undefined){
            toast({
                title: 'Please select an image',
                // description: "We've created your account for you.",
                status: "warning",
                duration: 6000,
                isClosable: true,
              });
              return ; 
        }
        if(pics.type==="image/jpeg"|| pics.type ==="image/png"){
            const data = new FormData()
            data.append("file",pics)
            data.append("upload_preset","chat_app")
            // data.append("cloud_name","drdjiwqa9")
            fetch("https://api.cloudinary.com/v1_1/drdjiwqa9/image/upload",{
                method: "post",
                body: data,
            })
            .then((res) => res.json())
            .then((data)=>{
                // console.log(data)
                setPic(data.url.toString());
                setLoading(false);
            })
            .catch((err)=> {
                console.log(err);
                setLoading(false);
            });
        }
        else{
            toast({
                title: 'Please select an image',
                // description: "We've created your account for you.",
                status: "warning",
                duration: 6000,
                isClosable: true,
              });
              setLoading(false);
              return ;
        }
    };

    const submitHandler= async()=>{
       setLoading(true);
       if(!name || !email || !password || !confirmpassword){
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
       if(password!=confirmpassword){
        toast({
            title: 'Password Do not Match',
            // description: "We've created your account for you.",
            status: 'warning',
            duration: 6000,
            isClosable: true,
          });
          return ;
       }
       try{
        const config ={
            headers: {
               "content-type": "application/json", 
            },
        };
        const {data}= await axios.post("/api/user",{name,email,password,pic},config);
        toast({
            title: 'Registration Succesful',
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
            title: 'Error Occured',
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
     <FormControl id='first-name' isRequired>
    <FormLabel>Name</FormLabel>
    <input
    placeholder='Enter Your Name'
    onChange={(e)=>setName(e.target.value)}></input>
     </FormControl>

     <FormControl id='email' isRequired>
    <FormLabel>Email</FormLabel>
    <input
    placeholder='Enter Your Email'
    onChange={(e)=>setEmail(e.target.value)}></input>
     </FormControl>

     
     <FormControl id='password' isRequired>
    <FormLabel>Password</FormLabel>
    <InputGroup>
    <input
    type={show?'text':'password'}
    placeholder='Password'
    onChange={(e)=>setPassword(e.target.value)}/>
    <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show?"Hide":"Show"}
        </Button>
    </InputRightElement>
</InputGroup>
     </FormControl>

     <FormControl id='password' isRequired>
    <FormLabel>Confirm Password</FormLabel>
    <InputGroup>
    <input
    type={show?'text':'password'}
    placeholder='Confirm Password'
    onChange={(e)=>setConfirmPassword(e.target.value)}/>
    <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
            {show?"Hide":"Show"}
        </Button>
    </InputRightElement>
</InputGroup>
     </FormControl> 

     <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
        type='file'
        p={1.5}
        accept='image/*'
        onChange={(e)=> postDetails(e.target.files[0])}
        ></Input>
     </FormControl>
     <Button
     colorScheme='blue'
     width='100%'
     style={{marginTop:15}}
     onClick={submitHandler}
     isLoading={loading}
     >Sign up</Button>
    </VStack>
  )
}

export default Signup
