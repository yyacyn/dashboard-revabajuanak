import React, { useState, useEffect, } from "react";
import { Link } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import { FaSyncAlt } from "react-icons/fa"; // Import the refresh icon
// import RecentOrders from "../../ecommerce/RecentOrders";


// Extend jsPDF to include autoTable
// declare module "jspdf" {
//     interface jsPDF {
//         autoTable: typeof autoTable;
//     }
// }

interface OrderDetail {
    id: number;
    order_id: number;
    invoice: string;
    product_name: string;
    quantity: number;
    total_price: number;
    status: string;
    payment_method: string;
    buyer_name: string;
    date: string;
}


export default function OrdersTable() {
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        fetch("https://backend-go-gin-production.up.railway.app/orders")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.order_details)) {
                    // Sort the order_details by the CreatedAt field in descending order
                    const sortedOrderDetails = data.order_details.sort((a: any, b: any) => {
                        return new Date(b.Order.CreatedAt).getTime() - new Date(a.Order.CreatedAt).getTime();
                    });

                    const fetchedOrderDetails = sortedOrderDetails.map((order: any) => ({
                        id: order.ID,
                        order_id: order.Order.ID,
                        invoice: order.Order.invoice,
                        product_name: order.Produk?.nama_produk || "N/A",
                        quantity: order.total_produk,
                        total_price: order.harga_total,
                        status: order.Order.status,
                        payment_method: order.Order.metode_pembayaran,
                        buyer_name: order.Order.User?.UserDetail?.nama || "Unknown",
                        date: new Date(order.Order.CreatedAt).toLocaleDateString(),
                    }));
                    setOrderDetails(fetchedOrderDetails);
                } else {
                    console.error("Unexpected API response format:", data);
                }
            })
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusClick = async (id: number, status: string) => {
        if (status === "pending") {
            try {
                const response = await fetch(`https://backend-go-gin-production.up.railway.app/payment/notification/${id}`, {
                    method: "POST",
                });
                const data = await response.json();
                console.log(data.message);

                // Refresh the table by re-fetching the data
                const refreshedResponse = await fetch("https://backend-go-gin-production.up.railway.app/orders");
                const refreshedData = await refreshedResponse.json();

                if (Array.isArray(refreshedData.order_details)) {
                    const sortedOrderDetails = refreshedData.order_details.sort((a: any, b: any) => {
                        return new Date(b.Order.CreatedAt).getTime() - new Date(a.Order.CreatedAt).getTime();
                    });

                    const updatedOrderDetails = sortedOrderDetails.map((order: any) => ({
                        id: order.ID,
                        invoice: order.Order.invoice,
                        order_id: order.Order.ID,
                        product_name: order.Produk?.nama_produk || "N/A",
                        quantity: order.total_produk,
                        total_price: order.harga_total,
                        status: order.Order.status,
                        payment_method: order.Order.metode_pembayaran,
                        buyer_name: order.Order.User?.UserDetail?.nama || "Unknown",
                        date: new Date(order.Order.CreatedAt).toLocaleDateString(),
                    }));
                    setOrderDetails(updatedOrderDetails);
                }
            } catch (error) {
                console.error("Error updating order status:", error);
            }
        }
    };

    const filteredOrderDetails = orderDetails.filter((detail) =>
        detail.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detail.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detail.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        detail.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrderDetails.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(filteredOrderDetails.length / ordersPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    // const generatePDF = () => {
    //     const doc = new jsPDF();
    //     doc.text(`Orders Report (Page ${currentPage})`, 14, 10);

    //     // Use currentOrders for the current page
    //     const tableData = currentOrders.map((order) => [
    //         order.invoice,
    //         order.product_name,
    //         order.quantity,
    //         `Rp. ${order.total_price.toLocaleString()}`,
    //         order.payment_method,
    //         order.buyer_name,
    //         order.date,
    //         order.status,
    //     ]);

    //     // Generate table in PDF
    //     autoTable(doc, {
    //         head: [["Invoice", "Product Name", "Quantity", "Total Price", "Payment Method", "Buyer Name", "Date", "Status"]],
    //         body: tableData,
    //         startY: 20,
    //     });

    //     // Save the PDF
    //     doc.save(`orders_report_page_${currentPage}.pdf`);
    // };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <div className="p-4 flex justify-between items-center">
                        <input
                            type="text"
                            className="w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {/* <div className="flex items-center gap-2">
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                onClick={generatePDF}
                            >
                                Download Current Page Report
                            </Button>
                        </div> */}
                    </div>
                    <Table className="table-auto w-full">
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Invoice
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Product Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Quantity
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Total Price
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Payment Method
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Buyer Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Date
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y table-auto w-full divide-gray-100 dark:divide-white/[0.05]">
                            {currentOrders.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Link
                                            to={`/invoice/${detail.order_id}`} // Navigate to the invoice details page
                                            className="text-blue-500 hover:underline" target="_blank"
                                        >
                                            {detail.invoice}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {detail.product_name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {detail.quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        Rp. {detail.total_price.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {detail.payment_method}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {detail.buyer_name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {detail.date}
                                    </TableCell>
                                    <TableCell className="py-3 text-theme-sm">
                                        {detail.status === "pending" ? (
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 rounded-full text-white text-xs font-medium bg-yellow-500">
                                                    {detail.status}
                                                </span>
                                                <FaSyncAlt
                                                    className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                                                    onClick={() => handleStatusClick(detail.order_id, detail.status)}
                                                />
                                            </div>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-xs font-medium ${detail.status === "success"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                    }`}
                                            >
                                                {detail.status}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center p-4">
                        <Button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            Previous
                        </Button>
                        <span className="dark:text-white">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="bg-gray-500 hover:bg-gray-600 text-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}