"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface ProductDetail {
    name: string
    quantity: number
    price: number
}

interface InvoiceDetail {
    id: number
    invoice: string
    buyer_name: string
    buyer_address: string
    buyer_city: string
    buyer_province: string
    buyer_postal_code: string
    buyer_phone: string
    products: ProductDetail[]
    total_price: number
    payment_method: string
    status: string
    date: string
}

export default function InvoiceDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        fetch(`https://backend-go-gin-production.up.railway.app/orders`)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.order_details)) {
                    // Filter the order details by order_id
                    const orderDetails = data.order_details.filter((order: any) => order.order_id === Number.parseInt(id || "0"))

                    if (orderDetails.length > 0) {
                        const order = orderDetails[0].Order
                        const buyer = order.User.UserDetail
                        const products = orderDetails.map((detail: any) => ({
                            name: detail.Produk.nama_produk || "Unknown Product",
                            quantity: detail.total_produk,
                            price: detail.harga_satuan,
                        }))

                        setInvoiceDetail({
                            id: order.ID,
                            invoice: order.invoice,
                            buyer_name: buyer.nama,
                            buyer_address: buyer.alamat,
                            buyer_city: buyer.kota,
                            buyer_province: buyer.provinsi,
                            buyer_postal_code: buyer.kodepos,
                            buyer_phone: buyer.telepon,
                            products,
                            total_price: order.total_harga,
                            payment_method: order.metode_pembayaran,
                            status: order.status,
                            date: new Date(order.CreatedAt).toLocaleDateString(),
                        })
                    }
                }
                setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching invoice details:", error)
                setIsLoading(false)
            })
    }, [id])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
            case "completed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="text-gray-500">Loading invoice details...</p>
                </div>
            </div>
        )
    }

    if (!invoiceDetail) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Invoice Not Found</h2>
                    <p className="text-gray-500 mt-2">The requested invoice could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl print:py-2">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <h1 className="text-3xl font-bold">Invoice Details</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Print Invoice
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Invoice #{invoiceDetail.invoice}</h2>
                            <p className="text-gray-500 mt-1">{invoiceDetail.date}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoiceDetail.status)}`}>
                            {invoiceDetail.status}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-3 text-gray-800">Customer Information</h3>
                            <div className="space-y-2">
                                <p className="font-medium">{invoiceDetail.buyer_name}</p>
                                <p>{invoiceDetail.buyer_phone}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-3 text-gray-800">Shipping Address</h3>
                            <p>{invoiceDetail.buyer_address}</p>
                            <p>
                                {invoiceDetail.buyer_city}, {invoiceDetail.buyer_province} {invoiceDetail.buyer_postal_code}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">Order Details</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Product
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Quantity
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Unit Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoiceDetail.products.map((product, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {product.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                Rp. {product.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                Rp. {(product.quantity * product.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td
                                            colSpan={3}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                                        >
                                            Total
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                                            Rp. {invoiceDetail.total_price.toLocaleString()}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        <span className="text-sm text-gray-500">Payment Method: </span>
                        <span className="text-sm font-medium">{invoiceDetail.payment_method}</span>
                    </div>
                    <div className="text-sm text-gray-500">Thank you for your business!</div>
                </div>
            </div>
        </div>
    )
}
