import React, { useState } from 'react';
import { useGetordersQuery } from "../../../store/slice/Userapislice";
import {  
  TruckIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  Download
} from 'lucide-react';
import { Order } from "../../../interfacetypes/type";

const OrderCard: React.FC<{ order: Order; index: number }> = ({ order, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col space-y-3 transform transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-500">Order #{index + 1}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800 truncate">{order.company}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 group">
            <TruckIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-gray-600 truncate group-hover:text-gray-900 transition-colors">{order.address}</span>
          </div>
          
          <div className="flex items-center space-x-2 group">
            <CalendarIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              {new Date(order.expectedat).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 group">
            <CreditCardIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{order.paymentmethod}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-lg font-bold text-green-600">₹{order.price.toFixed(2)}</div>
        
        {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
          <button 
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              isHovered 
                ? 'bg-green-600 text-white shadow-md transform scale-105' 
                : 'bg-green-500 text-white'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Invoice
          </button>
        )}
      </div>
    </div>
  );
};

const OrderListCards: React.FC = () => {
  const userInfoString = localStorage.getItem("userInfo");
  let userId = '';
  
  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      userId = userInfo.user._id;
    } catch (error) {
      console.error("Error parsing user info from localStorage:", error);
    }
  }

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useGetordersQuery(userId);

  const [currentPage, setCurrentPage] = useState(1);
  // Changed to show exactly 3 products per page
  const ordersPerPage = 3;

  if (userLoading) {    
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-200"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-center text-red-500 p-5 bg-red-50 rounded-lg shadow border border-red-100">
        <p className="font-medium">Error loading orders</p>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  const orders = userData?.orders || [];
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm mt-2">Your order history will appear here</p>
        </div>
      ) : (
        <>
          {/* Updated to always use a single column layout for exactly 3 items */}
          <div className="grid grid-cols-1 gap-6">
            {currentOrders.map((order: Order, index: number) => (
              <OrderCard key={order._id} order={order} index={indexOfFirstOrder + index} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium transition-colors ${
                    currentPage === 1 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-50 border-blue-500 text-blue-600 z-10'
                        : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium transition-colors ${
                    currentPage === totalPages 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderListCards;