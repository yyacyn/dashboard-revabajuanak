import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { FaSyncAlt } from "react-icons/fa"; // Import the refresh icon

interface OrderDetail {
    id: number; // Order detail ID
    order_id: number; // Order ID
    invoice: string;
    product_name: string;
    quantity: number;
    total_price: number;
    status: string;
    payment_method: string;
    buyer_name: string;
    date: string;
}

export default function RecentOrders() {
    const [recentOrders, setRecentOrders] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = () => {
        setLoading(true);
        fetch("https://backend-go-gin-production.up.railway.app/orders")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.order_details)) {
                    const fetchedOrders = data.order_details.map((order: any) => ({
                        id: order.ID, // Order detail ID
                        order_id: order.Order.ID, // Order ID
                        invoice: order.Order.invoice,
                        product_name: order.Produk?.nama_produk || "N/A",
                        quantity: order.total_produk,
                        total_price: order.harga_total,
                        status: order.Order.status,
                        payment_method: order.Order.metode_pembayaran,
                        buyer_name: order.Order.User?.UserDetail?.nama || "Unknown",
                        date: new Date(order.Order.CreatedAt).toISOString(),
                    }));

                    const sortedOrders: OrderDetail[] = fetchedOrders
                        .sort(
                            (a: OrderDetail, b: OrderDetail) =>
                                new Date(b.date).getTime() - new Date(a.date).getTime()
                        )
                        .slice(0, 5);

                    setRecentOrders(sortedOrders);
                } else {
                    console.error("Unexpected API response format:", data);
                }
            })
            .catch((error) => console.error("Error fetching recent orders:", error))
            .finally(() => setLoading(false));
    };

    const handleStatusClick = async (order_id: number, status: string) => {
        if (status === "pending") {
            try {
                const response = await fetch(`http://localhost:8000/payment/notification/${order_id}`, {
                    method: "POST",
                });
                const data = await response.json();
                console.log(data.message);

                // Refresh the recent orders
                fetchRecentOrders();
            } catch (error) {
                console.error("Error updating order status:", error);
            }
        }
    };

    if (loading) {
        return <p>Loading recent orders...</p>;
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Recent Orders
                    </h3>
                </div>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Invoice
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Product
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Buyer
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Payment Method
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Total Price
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {recentOrders.map((order) => (
                            <TableRow key={order.id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[150px]">
                                        <Link
                                            to={`/invoice/${order.order_id}`} // Navigate to the invoice details page
                                            className="text-blue-500 hover:underline" target="_blank"
                                        >
                                            {order.invoice}
                                        </Link>
                                    </TableCell>
                                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90 w-[30%]">
                                    {order.product_name}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 w-[20%]">
                                    {order.buyer_name}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {order.payment_method}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    Rp. {order.total_price.toLocaleString()}
                                </TableCell>
                                <TableCell className="py-3 text-theme-sm">
                                    {order.status === "pending" ? (
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded-full text-white text-xs font-medium bg-yellow-500">
                                                {order.status}
                                            </span>
                                            <FaSyncAlt
                                                className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                                                onClick={() => handleStatusClick(order.order_id, order.status)}
                                            />
                                        </div>
                                    ) : (
                                        <span
                                            className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                                                order.status === "success"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}