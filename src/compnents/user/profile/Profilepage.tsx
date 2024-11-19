import React, { useState } from "react";
import {
  MessageCircle,
  User,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Book,
  X,
  Menu,
} from "lucide-react";
import BookingList from "./Bookingcard";
import GasBookList from "./Gasbooklist";
import ChatWidget from "./Chatcomponent";
import {
  useAddbookMutation,
  useGetbookQuery,
  useDeletebookMutation,
  useUserchatMutation,
} from "../../../store/slice/Userapislice";
import { toast } from "react-toastify";
import { MenuItemProps } from "../../../interfacetypes/type";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../store/slice/Userapislice";
import { Link, useNavigate } from "react-router-dom";
import { clearUserInfo } from '../../../store/slice/Authslice';
import {FormField,} from "../../../interfacetypes/type"
// Interfaces

 interface Avatar {
  name: string;
}

const Avatar: React.FC<Avatar> = ({ name }) => {
  const getInitials = (name: string) => {
    const splitName = name.split(" ");
    const initials = splitName.map((part) => part[0].toUpperCase()).join("");
    return initials;
  };

  return (
    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
      {getInitials(name)}
    </div>
  );
};

// Main Component
const BookingProfilePage = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setChats] = useState<string>("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [userchat] = useUserchatMutation();
  const [userlogout] = useLogoutMutation();
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    consumerId: "",
    mobile: "",
    address: "",
    company: "",
    gender: "",
  });

  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") || "{}")
    : null;
  const userId = userInfo?.user?._id;

  const [addbook] = useAddbookMutation();
  const [deletebook] = useDeletebookMutation();
  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useGetbookQuery(userId);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addbook(formData).unwrap();
      toast.success("Book added successfully");
      setIsModalOpen(false);
      refetch();
      setFormData({
        name: "",
        consumerId: "",
        mobile: "",
        address: "",
        company: "",
        gender: "",
      });
    } catch (error) {
      toast.error("Failed to add book");
    }
  };

  const fields: FormField[] = [
    { name: "name", label: "Name" },
    { name: "consumerId", label: "Consumer ID" },
    { name: "mobile", label: "Mobile" },
    { name: "address", label: "Address" },
    { name: "company", label: "Company" },
  ];

  const handleDelete = async (bookId: string) => {
    try {
      await deletebook(bookId).unwrap();
      toast.success("Book deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  const MenuItem: React.FC<MenuItemProps> = ({
    Icon,
    label,
    active,
    onClick,
  }) => (
    <button
      onClick={() => {
        onClick();
        setIsMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingList />;
      case "gasbook":
        return (
          <GasBookList
            books={userData?.book || []}
            isLoading={isLoading}
            isError={isError}
            handleDelete={handleDelete}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case "payment":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
            <p className="text-gray-600">Manage your payment methods here</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleChat = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.user._id;
        if (userId) {
          const res = await userchat(userId).unwrap();
          if (res.success === true) {
            setChatId(res.data.chatId);
            setChats(res.data.messages);
            setIsChatOpen(true);
          } else {
            toast.error("Chat initialization failed.");
          }
        } else {
          toast.error("Unable to start chat. User ID not found.");
        }
      } else {
        toast.error("Unable to start chat. User information not found.");
      }
    } catch (error) {
      toast.error("An error occurred while initializing chat.");
    }
  };

  const handlelogout = async () => {
    await userlogout().unwrap();
    dispatch(clearUserInfo());
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    toast.success("logout successfully");
    Navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="max-w-7xl mx-auto p-4">
        <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            ECOGAS
          </Link>
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-full transition-colors ${
                isChatOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
              }`}
              onClick={handleChat}
              aria-label="Toggle chat"
            >
              <MessageCircle size={24} />
            </button>
            <button
              className="md:hidden p-2 rounded-full bg-blue-50 text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <main className="w-full md:w-3/4 bg-white rounded-lg shadow-sm p-6 order-2 md:order-1">
            {renderContent()}
          </main>

          {/* Sidebar */}
          <aside className={`
            fixed md:static top-0 right-0 h-full md:h-auto
            w-64 md:w-1/4 bg-white md:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            z-50 md:z-auto
            order-1 md:order-2
          `}>
            {/* Close button for mobile */}
            <button
              className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </button>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                  <User size={40} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">
                  {userInfo?.user?.username}
                </h2>
                <p className="text-gray-600">{userInfo?.user?.email}</p>
              </div>
            </div>

            <nav className="bg-white rounded-lg shadow-sm p-2">
              <MenuItem
                Icon={Calendar}
                label="My Bookings"
                active={activeTab === "bookings"}
                onClick={() => setActiveTab("bookings")}
              />
              <MenuItem
                Icon={Book}
                label="Gas Book"
                active={activeTab === "gasbook"}
                onClick={() => setActiveTab("gasbook")}
              />
              <MenuItem
                Icon={CreditCard}
                label="Payment Methods"
                active={activeTab === "payment"}
                onClick={() => setActiveTab("payment")}
              />
              <MenuItem
                Icon={Settings}
                label="Settings"
                active={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
              />
              <MenuItem
                Icon={LogOut}
                label="Logout"
                onClick={handlelogout}
                active={undefined}
              />
            </nav>
          </aside>

          {/* Chat Widget */}
          {isChatOpen && chatId && (
            <ChatWidget
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              chatId={chatId}
            />
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Gas Book</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Add Book
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingProfilePage;