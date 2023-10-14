import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import ChatProvider from "./context/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
 <BrowserRouter> 
  <ChakraProvider>
    <App />     
  </ChakraProvider>
  </BrowserRouter>
  </ChatProvider>
);

//Challenge. Render all the notes inside notes.js as a seperate Note
//component.
