import React, { useState } from 'react';
import { MapPin, Package, CalendarIcon, CreditCardIcon, FileTextIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useGetordersQuery } from "../../../store/slice/Userapislice";
import { generateInvoice } from '../../../constant/Invoiceservice';
import { Order } from "../../../interfacetypes/type";

const BookingCard: React.FC<{ order: Order; index: number }> = ({ order, index }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleInvoiceDownload = async () => {
        setIsGenerating(true);
        try {
            const pdfDoc = generateInvoice(order);
            pdfDoc.download(`Invoice-${order._id}.pdf`);
        } catch (error) {
            console.error('Error generating invoice:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg duration-300 overflow-hidden p-4">
            <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col space-y-3 flex-grow">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500">Booking #{index + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Completed' ? 'bg-green-50 text-green-600' :
                            order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-blue-50 text-blue-600'
                        }`}>
                            {order.status}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{order.company}</h3>
                    <div className="text-gray-500 text-sm space-y-2">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span className="line-clamp-2">{order.address}</span>
                        </div>
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{new Date(order.expectedat).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center">
                            <CreditCardIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            <span>{order.paymentmethod}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row md:flex-col justify-between items-end md:min-w-[140px] md:text-right space-y-2 md:space-y-4">
    <div className="flex flex-col items-start md:items-end">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-xl font-bold text-green-600">₹{order.price}</span>
    </div>
    {order.status.toLowerCase() === "delivered" && (
        <button
            onClick={handleInvoiceDownload}
            disabled={isGenerating}
            className={`${
                isGenerating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 w-full`}
        >
            <FileTextIcon className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Invoice'}
        </button>
    )}
</div>

            </div>
        </div>
    );
};

const BookingList: React.FC = () => {
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
    const ordersPerPage = 5;

    if (userLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    if (userError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 text-center">
                <div className="text-red-600 font-semibold">Error loading bookings</div>
                <p className="text-red-500 text-sm mt-1">Please try again later</p>
            </div>
        );
    }

    const orders = userData?.orders || [];
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">My Bookings</h2>
                <div className="text-sm text-gray-500">
                    Total Bookings: {orders.length}
                </div>
            </div>
            
            {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 md:p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bookings Found</h3>
                    <p className="text-gray-500">You haven't made any bookings yet.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {currentOrders.map((order: Order, index: number) => (
                            <BookingCard key={order._id} order={order} index={indexOfFirstOrder + index} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 overflow-x-auto">
                            <nav className="flex items-center space-x-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md border ${
                                        currentPage === 1 
                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } transition-colors duration-200`}
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                
                                <div className="flex space-x-1 overflow-x-auto max-w-[calc(100vw-120px)] md:max-w-none">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-2 rounded-md font-medium text-sm ${
                                                currentPage === i + 1 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            } transition-colors duration-200`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md border ${
                                        currentPage === totalPages 
                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } transition-colors duration-200`}
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BookingList;