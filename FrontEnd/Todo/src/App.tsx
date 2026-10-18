import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Authentications/LoginPage";
import SignupPage from "./components/Authentications/SignupPage";
import LogoutPage from "./components/Authentications/LogoutPage";
import MainPage from "./components/MainComponents/MainPage";
import { useState } from "react";
import OpenedGroupTodo from "./components/MainComponents/OpenedGroupTodo";

function App() {
  const [theme,setTheme] = useState(localStorage.getItem("theme") || "light")
  const [userPanelActive, setUserPanelActive] = useState(false);
  

  
  return (
    <Routes>
      <Route
        path="Main"
        element={
          <MainPage 
           theme={theme} setTheme={setTheme} userPanelActive={userPanelActive}
          setUserPanelActive={setUserPanelActive} />
        }
      />
      <Route index element={<LoginPage theme={theme} setTheme ={setTheme}/>} />
      <Route path="Signup" element={<SignupPage theme={theme} setTheme ={setTheme} />} />
      <Route path={`/Main/group/:categoryIdParam`} element={
      <OpenedGroupTodo 
      
      theme={theme}
      setTheme={setTheme}
      userPanelActive={userPanelActive}
      setUserPanelActive={setUserPanelActive}
       />} />
       <Route path="/Main/Logout" element = {<LogoutPage theme={theme}/>}/>
    </Routes>
  );
}

export default App;
