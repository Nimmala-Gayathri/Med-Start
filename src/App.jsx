import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from "./assets/logo.png"
import { Routes,Route } from "react-router-dom";
import Home from "./componets/Home"
import Address from "./componets/Address";
// import Example from "./componets/Example"

export default function App (){
  return(
    <div>
      <div style={{borderBottom:"1px solid gray",margin:"1rem"}}>
       < Navbar >
         {/* <Container> */}
          <Navbar.Brand href="/" style={{color:"black",fontSize:"2rem",fontWeight:"bolder",margin:"0.5rem"}}>
            <img
              alt=""
              src={logo}
              width="40"
              height="40"
            />{' '}
             MedStart
          </Navbar.Brand>
         {/* </Container> */}
       </Navbar>
      </div>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/address/:id" element={<Address/>}/>
      </Routes>
      {/* {<Example/>} */}
    </div>
  )
}