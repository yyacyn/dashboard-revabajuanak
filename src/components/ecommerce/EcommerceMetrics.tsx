import { useState, useEffect } from "react";
import { BadgeDollarSign, ShirtIcon } from "lucide-react";
import { PageIcon } from "../../icons";

// Define the Product interface
interface Product {
    jumlah: number;
}

export default function EcommerceMetrics() {
    const [metrics, setMetrics] = useState({
        totalProducts: 0,
        totalOrders: 0,
        ordersThisMonth: 0,
        incomeThisMonth: 0,
    });

    useEffect(() => {
        // Fetch orders data from the API
        fetch("http://localhost:8000/orders")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.order_details)) {
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();
    
                    // Extract unique orders
                    const uniqueOrders = new Map();
                    data.order_details.forEach((detail: { Order: { ID: number; CreatedAt: string; status: string; total_harga: number } }) => {
                        const order = detail.Order;
                        if (!uniqueOrders.has(order.ID)) {
                            uniqueOrders.set(order.ID, order);
                        }
                    });
    
                    const ordersArray = Array.from(uniqueOrders.values());
    
                    // Calculate metrics
                    const totalOrders = ordersArray.length;
    
                    const ordersThisMonth = ordersArray.filter((order) => {
                        const orderDate = new Date(order.CreatedAt);
                        return (
                            orderDate.getMonth() === currentMonth &&
                            orderDate.getFullYear() === currentYear
                        );
                    }).length;
    
                    const incomeThisMonth = ordersArray
                        .filter((order) => {
                            const orderDate = new Date(order.CreatedAt);
                            return (
                                orderDate.getMonth() === currentMonth &&
                                orderDate.getFullYear() === currentYear &&
                                order.status === "success"
                            );
                        })
                        .reduce((total, order) => total + order.total_harga, 0);
    
                    setMetrics((prevMetrics) => ({
                        ...prevMetrics,
                        totalOrders,
                        ordersThisMonth,
                        incomeThisMonth,
                    }));
                } else {
                    console.error("Unexpected API response format:", data);
                }
            })
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);

    useEffect(() => {
        // Fetch products data from the API
        fetch("http://localhost:8000/products")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.products)) {
                    // Calculate total quantity of all products
                    const totalProducts = data.products.reduce(
                        (sum: number, product: Product) => sum + product.jumlah,
                        0
                    );

                    setMetrics((prevMetrics) => ({
                        ...prevMetrics,
                        totalProducts,
                    }));
                } else {
                    console.error("Unexpected API response format:", data);
                }
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {/* Total Products */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <ShirtIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total Products
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {metrics.totalProducts.toLocaleString()}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Total Orders */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <PageIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total Orders
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {metrics.totalOrders.toLocaleString()}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Orders This Month */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <PageIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Orders This Month
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {metrics.ordersThisMonth.toLocaleString()}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Income This Month */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BadgeDollarSign className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Income This Month
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            Rp. {metrics.incomeThisMonth.toLocaleString()}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}