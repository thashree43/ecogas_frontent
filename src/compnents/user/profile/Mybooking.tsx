import React, { useState } from 'react';
import { useGetordersQuery } from "../../../store/slice/Userapislice";
import {  
  TruckIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  FileTextIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from 'lucide-react';
import {Order} from "../../../interfacetypes/type"

const OrderCard: React.FC<{ order: Order; index: number }> = ({ order, index }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col space-y-3 transform transition hover:shadow-md">
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium text-gray-500">Order #{index + 1}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {order.status}
      </span>
    </div>

    <div className="space-y-2">
      <h3 className="text-lg font-bold text-gray-800 truncate">{order.company}</h3>
      
      <div className="flex items-center space-x-2">
        <TruckIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600 truncate">{order.address}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <CalendarIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {new Date(order.expectedat).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <CreditCardIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{order.paymentmethod}</span>
      </div>
    </div>

    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
      <div className="text-lg font-bold text-green-600">₹{order.price.toFixed(2)}</div>
      
      {(order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'completed') && (
        <button className="bg-green-500 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-green-600 transition">
          <FileTextIcon className="w-4 h-4 inline-block mr-1" />
          Invoice
        </button>
      )}
    </div>
  </div>
);

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
  const ordersPerPage = 6;

  if (userLoading) {    
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-center text-red-500 p-5 bg-red-50 rounded-lg">
        Error loading orders. Please try again later.
      </div>
    );
  }

  const orders = userData?.orders || [];
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-lg">
          No orders found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentOrders.map((order: Order, index: number) => (
              <OrderCard key={order._id} order={order} index={indexOfFirstOrder + index} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
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