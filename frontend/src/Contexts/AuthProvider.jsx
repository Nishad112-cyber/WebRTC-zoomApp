import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../pages/environment";  // correct relative path
import { AuthContext } from "./AuthContext";

const client = axios.create({
  baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    
      let request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === 201) {
        return request.data.message;
      }
    
  };

  const handleLogin = async (username, password) => {
    
      let request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === 200) {
        localStorage.setItem("token", request.data.token);
        router("/home");
      }
    
  };

  const getHistoryOfUser = async () => {
    
      let request = await client.get("/add_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    }
  

  const addToUserHistory = async (meetingCode) => {
    
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request;
    
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );

};