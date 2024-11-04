import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    component: React.ComponentType;
  }
  
  const AgentVerifyRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const navigate = useNavigate();
    
    const token = localStorage.getItem("agentToken");
  
    useEffect(() => {
      if (token) {
        navigate("/agent/dashboard");
      }
    }, [token, navigate]);
  
    if (token) {
      return null; 
    }
  
    return <Component />; 
  };
  
  export default AgentVerifyRoute;