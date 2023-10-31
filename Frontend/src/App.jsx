import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";
import Navigation from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Confirmation from './Components/Register/Confirmation';
import Registro from './Components/Register/Register';
import Home from './Components/Home/Home';
import EditProfile from './Components/EditProfile/EditProfile';
import NoFriendsList from './Components/Friends/NoFriendsList';
import FrientRequestList from './Components/Friends/FrientRequestList';
import Chatbot from './Components/Chatbot/Chatbot';

function App() {
  return (
    <div>
      <Navigation/>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registro/>} />
        <Route path="/confirm" element={<Confirmation/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<EditProfile/>} />
        <Route path="/noFriendsList" element={<NoFriendsList/>} />
        <Route path="/requests" element={<FrientRequestList/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/Chatbot" element={<Chatbot/>} />

      </Routes>
    </div>
  )
}

export default App
