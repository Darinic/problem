import React, { useState, useEffect } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/registration/Registration";
import ProfileCreate from "./components/profile-create/ProfileCreate";
import ProfileList from "./components/profile-list/ProfileList";
import Profile from "./components/profile/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileEdit from "./components/profile-edit/ProfileEdit";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import axios from "axios";



export default () => {
const [isLoggedIn, setIsloggedIn] = useState(false);
const [userId, setUserId] = useState('')

useEffect(() => {
  axios.get('/checkAuth', { withCredentials: true})
  .then(resp => {
    if(resp.data.id) {
      setIsloggedIn(true)
      setUserId(resp.data.id)
    }
  })
}, [])

const handleLoginState = (value) => {
  setIsloggedIn(value)
}

  return (
    <div className="App">
      <Router>
        <Header loggedIn={isLoggedIn}/>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<ProfileList />} />
          <Route path="/profiles/:id" element={<Profile />} />
          <Route path="/login" element={<Login state={handleLoginState} />} />
          {isLoggedIn && (<Route path="/edit" element={<ProfileEdit />} /> )}
          {isLoggedIn && (<Route path="/create-profile" element={<ProfileCreate />} />)}
        </Routes>
      </Router>
    </div>
  );
};
