import React, { useState } from "react";
import { FaHome, FaUsers, FaSignOutAlt, FaBuilding } from "react-icons/fa";
import { RiShoppingBasketFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useAgentlogoutMutation} from "../../../store/slice/Brokerslice"

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [logout] = useAgentlogoutMutation(); 
  const AGENT_STORAGE_KEY = "agentInfo";
  const AGENT_TOKEN_KEY = "agentToken";
  const AGENT_REFRESH_TOKEN_KEY = "agentRefreshToken";
  const AGENT_SESSION_KEY = "agentSpecificKey";

  const agent = localStorage.getItem("agentInfo");
  let agentName = "";
  let agentImage = "";

  if (agent) {
    try {
      const agentObj = JSON.parse(agent);
      agentName = agentObj.agentname;
      agentImage = agentObj.image;
    } catch (error) {
      console.error("Failed to parse agent info from localStorage:", error);
    }
  }

  
  const handleLogout = async () => {
    try {
      // Call the logout API
      await logout().unwrap();

      // Create a list of agent-specific keys to remove
      const agentSpecificKeys = [
        AGENT_STORAGE_KEY,
        AGENT_TOKEN_KEY,
        AGENT_REFRESH_TOKEN_KEY
      ];

      // Remove only agent-related items from localStorage
      agentSpecificKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Remove agent-specific session storage
      sessionStorage.removeItem(AGENT_SESSION_KEY);

      toast.success("Agent logged out successfully");
      navigate("/agent/login");
    } catch (error) {
      console.error("Agent logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  

  const menuItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard", path: "/agent/dashboard" },
    { id: "users", icon: FaUsers, label: "Users", path: "/agent/dashboard/users" },
    { id: "company", icon: FaBuilding, label: "Company", path: "/agent/dashboard/company" },
    { id: "orders", icon: RiShoppingBasketFill, label: "Orders", path: "/agent/dashboard/orders" },
    { id: "sales", icon: RiShoppingBasketFill, label: "Sales", path: "/agent/dashboard/sales" },
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col p-4">
      {/* Agent profile */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={agentImage || "/default-avatar.jpg"}
          alt="Agent Avatar"
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
        <h2 className="text-lg font-semibold">{agentName}</h2>
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center py-3 px-4 rounded-lg cursor-pointer ${
              activeItem === item.id ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => {
              setActiveItem(item.id);
              navigate(item.path);
            }}
          >
            <item.icon className="mr-3 text-xl" />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout button */}
      <div
        className="flex items-center py-3 px-4 mt-auto text-red-400 cursor-pointer hover:bg-red-700 rounded-lg"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-3 text-xl" />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
