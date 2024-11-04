import React, { useState, useMemo, useCallback } from "react";
import { useGetfullordersQuery } from "../../store/slice/Adminslice";
import { Order, OrderResponse } from "../../interfacetypes/type";
import debounce from 'lodash.debounce';

const OrderList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data } = useGetfullordersQuery<{ data: OrderResponse }>();
  const ordersPerPage = 5;

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setSearch(searchTerm);
        setCurrentPage(1);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const filteredOrders = useMemo(() => {
    return data?.orders?.filter(
      (order: Order) =>
        order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.mobile.toString().includes(search)
    ) || [];
  }, [data?.orders, search]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Columns to show on mobile (most important ones)
  const mobileColumns = ['No', 'Name', 'Mobile', 'Status'];

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">Order List</h2>
      <input
        type="text"
        placeholder="Search by name or mobile"
        onChange={handleSearch}
        className="w-full mb-4 p-2 border rounded"
      />
      
      {/* Mobile View */}
      <div className="block md:hidden">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              {mobileColumns.map((column) => (
                <th key={column} className="p-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.map((order: Order, index: number) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-2 text-sm text-gray-900">{indexOfFirstOrder + index + 1}</td>
                <td className="p-2 text-sm text-gray-900">{order.name}</td>
                <td className="p-2 text-sm text-gray-900">{order.mobile}</td>
                <td className="p-2 text-sm text-gray-900">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">ConsumerID</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Exp-Date</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.map((order: Order, index: number) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-900">{indexOfFirstOrder + index + 1}</td>
                <td className="p-3 text-sm text-gray-900">{order.name}</td>
                <td className="p-3 text-sm text-gray-900">{order.consumerid}</td>
                <td className="p-3 text-sm text-gray-900">{order.address}</td>
                <td className="p-3 text-sm text-gray-900">{order.mobile}</td>
                <td className="p-3 text-sm text-gray-900">{order.company}</td>
                <td className="p-3 text-sm text-gray-900">{order.price}</td>
                <td className="p-3 text-sm text-gray-900">{order.paymentmethod}</td>
                <td className="p-3 text-sm text-gray-900">
                  {new Date(order.expectedat).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm text-gray-900">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 px-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm rounded ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm rounded ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderList;