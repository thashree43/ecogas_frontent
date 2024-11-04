import React, { useState, useEffect } from "react";
import { FaArrowRight, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { useSaleslistsQuery } from "../../store/slice/Adminslice";
import { Agent, Order } from "../../interfacetypes/type";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const SalesListing: React.FC = () => {
  const { data: salesData = [], isLoading, error } = useSaleslistsQuery();
  const [sales, setSales] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [agentsPerPage] = useState<number>(5);
  const [currentOrderPage, setCurrentOrderPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(5);

  useEffect(() => {
    if (salesData) {
      const sortedSales = [...salesData].sort((a, b) => {
        const aTotal = getDeliveredOrders(a.orders).reduce(
          (sum, order) => sum + order.price,
          0
        );
        const bTotal = getDeliveredOrders(b.orders).reduce(
          (sum, order) => sum + order.price,
          0
        );
        return bTotal - aTotal;
      });
      setSales(sortedSales);
    }
  }, [salesData]);

  const getDeliveredOrders = (orders: Order[]) =>
    orders.filter((order) => order.status === "delivered");

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = sales.slice(indexOfFirstAgent, indexOfLastAgent);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastOrder = currentOrderPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const handleShowOrders = (agentId: string) => {
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
    } else {
      setSelectedAgentId(agentId);
      setCurrentOrderPage(1);
    }
  };

  const handleNextOrderPage = () => {
    setCurrentOrderPage((prevPage) => prevPage + 1);
  };

  const handlePrevOrderPage = () => {
    setCurrentOrderPage((prevPage) => prevPage - 1);
  };

  const downloadPDF = (agentId: string) => {
    const agent = sales.find((s) => s._id === agentId);
    if (!agent) return;

    const doc = new jsPDF();
    doc.text(`Orders for ${agent.agentname}`, 14, 15);

    const deliveredOrders = getDeliveredOrders(agent.orders);
    const tableData = deliveredOrders.map((order) => [
      order._id,
      order.company,
      `₹${order.price}`,
      order.expectedat
        ? new Date(order.expectedat).toLocaleDateString()
        : "N/A",
      order.status,
      new Date(order.createdAt ?? "").toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Order ID", "Company", "Amount", "Exp Date", "Status", "Date"]],
      body: tableData,
      startY: 20,
    });

    doc.save(`${agent.agentname}_orders.pdf`);
  };

  const downloadExcel = (agentId: string) => {
    const agent = sales.find((s) => s._id === agentId);
    if (!agent) return;

    const deliveredOrders = getDeliveredOrders(agent.orders);
    const ws = XLSX.utils.json_to_sheet(
      deliveredOrders.map((order) => ({
        "Order ID": order._id,
        Company: order.company,
        Amount: order.price,
        "Exp Date": order.expectedat
          ? new Date(order.expectedat).toLocaleDateString()
          : "N/A",
        Status: order.status,
        Date: new Date(order.createdAt ?? "").toLocaleDateString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `${agent.agentname}_orders.xlsx`);
  };

  if (isLoading) return <p>Loading sales data...</p>;
  if (error) return <p>Error fetching sales data</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Sales Listing (Delivered Orders)
      </h1>

      <table className="w-full table-auto mb-4 text-xs md:text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>Agent</th>
            <th>Pincode</th>
            <th>Sales Amount</th>
            <th># Delivered Orders</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentAgents.map((sale) => {
            const deliveredOrders = getDeliveredOrders(sale.orders);

            return (
              <React.Fragment key={sale._id}>
                <tr className="border-b">
                  <td className="px-2 md:px-4 py-2">{sale.agentname}</td>
                  <td className="px-2 md:px-4 py-2">{sale.pincode}</td>
                  <td className="px-2 md:px-4 py-2">
                    ₹
                    {deliveredOrders
                      .reduce((sum, order) => sum + order.price, 0)
                      .toFixed(2)}
                  </td>
                  <td className="px-2 md:px-4 py-2">
                    {deliveredOrders.length}
                  </td>
                  <td className="px-2 md:px-4 py-2 text-center">
                    <FaArrowRight
                      className="cursor-pointer"
                      onClick={() => handleShowOrders(sale._id)}
                    />
                  </td>
                </tr>
                {selectedAgentId === sale._id && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-2 py-1 md:px-4 md:py-2 bg-gray-50"
                    >
                      <div className="overflow-x-auto">
                        <table className="table-auto w-full text-xs md:text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-2 md:px-4 py-1 md:py-2">
                                Order ID
                              </th>
                              <th className="px-2 md:px-4 py-1 md:py-2">
                                Company
                              </th>
                              <th className="px-2 md:px-4 py-1 md:py-2">
                                Amount
                              </th>
                              <th className="px-2 md:px-4 py-1 md:py-2">
                                Exp Date
                              </th>
                              <th className="px-2 md:px-4 py-1 md:py-2">
                                Status
                              </th>
                              <th className="px-2 md:px-4 py-1 md:py-2">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliveredOrders
                              .slice(indexOfFirstOrder, indexOfLastOrder)
                              .map((order) => (
                                <tr key={order._id} className="border-b">
                                  <td className="px-2 md:px-4 py-1">
                                    {order._id}
                                  </td>
                                  <td className="px-2 md:px-4 py-1">
                                    {order.company}
                                  </td>
                                  <td className="px-2 md:px-4 py-1">
                                    ₹{order.price}
                                  </td>
                                  <td className="px-2 md:px-4 py-1">
                                    {order.expectedat
                                      ? new Date(
                                          order.expectedat
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td className="px-2 md:px-4 py-1">
                                    {order.status}
                                  </td>
                                  <td className="px-2 md:px-4 py-1">
                                    {new Date(
                                      order.createdAt?? ""
                                    ).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={handlePrevOrderPage}
                          className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                          disabled={currentOrderPage === 1}
                        >
                          Previous
                        </button>
                        <button
                          onClick={handleNextOrderPage}
                          className="bg-blue-500 text-white px-2 py-1 rounded-md"
                          disabled={
                            currentOrderPage >=
                            Math.ceil(deliveredOrders.length / ordersPerPage)
                          }
                        >
                          Next
                        </button>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => downloadPDF(sale._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                        >
                          <FaFilePdf className="inline mr-1" /> Download PDF
                        </button>
                        <button
                          onClick={() => downloadExcel(sale._id)}
                          className="bg-green-500 text-white px-2 py-1 rounded-md"
                        >
                          <FaFileExcel className="inline mr-1" /> Download Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          className="btn btn-sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage >= Math.ceil(sales.length / agentsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SalesListing;
