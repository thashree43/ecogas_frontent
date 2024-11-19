import React from "react";
import { FaBell, FaSignOutAlt, FaHome, FaShoppingCart } from "react-icons/fa";
import { FaUserNinja } from "react-icons/fa6";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../../store/slice/Adminslice";
import Logo from "../../../layouts/Logocomponent";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminSession");
      toast.success("Logout successful");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <div className="w-64 h-screen bg-gray-50 p-6 flex flex-col">
      <div className="mb-6">
        <Logo />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Admin</h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleNavigation("/admin/dashboard")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaHome className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/admin/dashboard/users")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              <FaUserNinja className="w-5 h-5" />
              <span>Users</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/admin/dashboard/agents")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              <MdOutlineSupportAgent className="w-5 h-5" />
              <span>Brokers</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/admin/dashboard/orders")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              <FaShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/admin/dashboard/customexp")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              <FaBell className="w-5 h-5" />
              <span>Customers</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/admin/dashboard/sales")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
            >
              <FaBell className="w-5 h-5" />
              <span>Sales Listing</span>
            </button>
          </li>
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FaSignOutAlt className="w-5 h-5" />
        <span>Log-out</span>
      </button>
    </div>
  );
};

export default Sidebar;