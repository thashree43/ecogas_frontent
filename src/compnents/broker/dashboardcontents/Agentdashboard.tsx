import React, { useState, useEffect } from "react";
import {
  
  Activity,
  FileText,
  Car,
  Building,
  LogOut,
  Menu,
  X
} from "lucide-react";
import ProductList from "../Productlistingpage";
import OrderList from "../Orderlistingagent";
import SaleList from "../Saleslist";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ComponentProps } from "../../../interfacetypes/type";
import {
  useAgentlogoutMutation,
  useDashboarddatasQuery,
} from "../../../store/slice/Brokerslice";
import DashboardContent from "../Dashboardcontent";
import Logo from "../../../layouts/Logocomponent"
import {DashboardDatas} from "../../../interfacetypes/type"
// interface DashboardProps {
//   children?: React.ReactNode;
//   className?: string;
// }

// const Card: React.FC<DashboardProps> = ({ children, className = "" }) => (
//   <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
// );



// const CardContent: React.FC<DashboardProps> = ({
//   children,
//   className = "",
// }) => <div className={`p-4 ${className}`}>{children}</div>;

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const getInitials = (name: string) => {
    const splitName = name.split(" ");
    const initials = splitName.map((part) => part[0].toUpperCase()).join("");
    return initials;
  };

  return (
    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
      {getInitials(name)}
    </div>
  );
};

const Agentdashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [logout] = useAgentlogoutMutation();
  const { data: dashboardData, isLoading, error, refetch } = useDashboarddatasQuery();
  const navigate = useNavigate();

  const agent = localStorage.getItem("agentInfo");
  let agentName = "";

  if (agent) {
    try {
      const agentObj = JSON.parse(agent);
      agentName = agentObj.agentname;
    } catch (error) {
      console.error("Failed to parse agent info from localStorage:", error);
    }
  }

  const handleLogout = async () => {
    await logout().unwrap();
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/agent/login");
  };

  useEffect(() => {
    const storedSection = localStorage.getItem("activeSection");
    if (storedSection) {
      setActiveSection(storedSection);
    }
  }, []);

  const handleSidebarClick = (section: string) => {
    if (section === "dashboard") {
      refetch(); // Refetch data when navigating to dashboard
    }
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
    
    // Close mobile sidebar after selection
    setIsMobileSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "company":
        return <ProductList />;
      case "orders":
        return <OrderList />;
      case "sales":
        return <SaleList />;
      case "dashboard":
        if (isLoading) {
          return <div>Loading dashboard data...</div>;
        }

        if (error) {
          return <div>Error loading dashboard data</div>;
        }
          const defaultDashboardData: DashboardDatas = {
            totalSales: 0,
            totalProfit: 0,
            monthlyData: [],
            orders: []
          };
  
          const mergedDashboardData: DashboardDatas = {
            ...defaultDashboardData,
            ...(dashboardData || {})
          };
  
          return <DashboardContent dashboardData={mergedDashboardData} />;       

      default:
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold">
              Content for {activeSection}
            </h2>
            <p>This section is under development</p>
          </div>
        );
    }
  };

  const MobileSidebar = () => (
    <div className={`
      fixed inset-0 z-50 bg-white transform
      ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      transition-transform duration-300 ease-in-out
      lg:hidden
    `}>
      <div className="relative h-full">
        <button 
          className="absolute top-4 right-4 z-60"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <X size={24} />
        </button>
        
        <div className="p-6 overflow-y-auto h-full">
          {/* Logo at the top of sidebar */}
          <Logo />
          
          {/* Avatar and agent's name */}
          <div className="mb-8">
            <Avatar name={agentName} />
            <div className="text-center text-gray-500">{agentName}</div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={Activity}
              text="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => handleSidebarClick("dashboard")}
            />
            <SidebarItem
              icon={Building}
              text="Company"
              active={activeSection === "company"}
              onClick={() => handleSidebarClick("company")}
            />
            <SidebarItem
              icon={Car}
              text="Orders"
              active={activeSection === "orders"}
              onClick={() => handleSidebarClick("orders")}
            />
            <SidebarItem
              icon={FileText}
              text="Sales Report"
              active={activeSection === "sales"}
              onClick={() => handleSidebarClick("sales")}
            />
            <SidebarItem
              icon={LogOut}
              text="Logout"
              active={activeSection === "logout"}
              onClick={() => handleLogout()}
            />
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle Button */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden lg:block w-64 bg-white shadow-lg">
        <div className="p-6">
          <Logo />
          
          <div className="mb-8">
            <Avatar name={agentName} />
            <div className="text-center text-gray-500">{agentName}</div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={Activity}
              text="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => handleSidebarClick("dashboard")}
            />
            <SidebarItem
              icon={Building}
              text="Company"
              active={activeSection === "company"}
              onClick={() => handleSidebarClick("company")}
            />
            <SidebarItem
              icon={Car}
              text="Orders"
              active={activeSection === "orders"}
              onClick={() => handleSidebarClick("orders")}
            />
            <SidebarItem
              icon={FileText}
              text="Sales Report"
              active={activeSection === "sales"}
              onClick={() => handleSidebarClick("sales")}
            />
            <SidebarItem
              icon={LogOut}
              text="Logout"
              active={activeSection === "logout"}
              onClick={() => handleLogout()}
            />
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-4 lg:p-8 mt-12 lg:mt-0">
        {renderContent()}
      </div>
    </div>
  );
};

const SidebarItem: React.FC<ComponentProps> = ({
  icon: Icon,
  text,
  active,
  onClick,
}) => (
  <div
    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer
      ${active ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{text}</span>
  </div>
);

// const StatsCard: React.FC<ComponentProps> = ({ title, value, icon: Icon }) => (
//   <Card>
//     <CardContent className="p-6">
//       <div className="flex items-center space-x-4">
//         <div className="p-3 bg-blue-50 rounded-lg">
//           <Icon size={24} className="text-blue-600" />
//         </div>
//         <div>
//           <div className="text-sm text-gray-500">{title}</div>
//           <div className="text-2xl font-semibold">{value}</div>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

export default Agentdashboard;