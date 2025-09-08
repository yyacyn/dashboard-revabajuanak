"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"

interface Product {
    ID: number
    nama_produk: string
    deskripsi: string
    kategori: string
    harga: number
    image?: string
}

interface OrderDetail {
    Produk: Product
    total_produk: number
}

interface ProductSales {
    id: number
    name: string
    description: string
    category: string
    price: number
    image?: string
    quantity: number
}

export default function ProductBestSelling() {
    const [products, setProducts] = useState<ProductSales[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch orders and products data
                const [ordersResponse, productsResponse] = await Promise.all([
                    fetch("https://backend-go-gin-production.up.railway.app/orders"),
                    fetch("https://backend-go-gin-production.up.railway.app/products"),
                ])

                const ordersData = await ordersResponse.json()
                const productsData = await productsResponse.json()

                if (Array.isArray(ordersData.order_details) && Array.isArray(productsData.products)) {
                    // Aggregate product sales
                    const productSales = ordersData.order_details.reduce(
                        (acc: Record<number, ProductSales>, detail: OrderDetail) => {
                            const product = detail.Produk
                            if (product) {
                                if (!acc[product.ID]) {
                                    acc[product.ID] = {
                                        id: product.ID,
                                        name: product.nama_produk,
                                        description: product.deskripsi,
                                        category: product.kategori,
                                        price: product.harga,
                                        image: product.image,
                                        quantity: 0,
                                    }
                                }
                                acc[product.ID].quantity += detail.total_produk
                            }
                            return acc
                        },
                        {},
                    )

                    // Merge with product details from /products API
                    const mergedProducts = productsData.products.map((product: Product) => ({
                        id: product.ID,
                        name: product.nama_produk,
                        description: product.deskripsi,
                        category: product.kategori,
                        price: product.harga,
                        image: product.image,
                        quantity: productSales[product.ID]?.quantity || 0,
                    }))

                    // Sort by quantity sold
                    const sortedProducts: ProductSales[] = mergedProducts
                        .sort((a: ProductSales, b: ProductSales) => b.quantity - a.quantity)
                        .slice(0, 5)

                    setProducts(sortedProducts)
                } else {
                    console.error("Unexpected API response format")
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Best Selling Products</h3>
                    </div>
                </div>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Best Selling Products</h3>
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
                                Image
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-[40%]"
                            >
                                Product Name
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Category
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Price
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Quantity Sold
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="py-3">
                                        <div className="w-20 h-20 rounded overflow-hidden">
                                            <img
                                                src={`https://backend-go-gin-production.up.railway.app/uploads/products/${product.id}/1.jpg`}
                                                alt={product.name}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    ; (e.target as HTMLImageElement).src =
                                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90 w-[40%]">
                                        <div className="font-medium">{product.name}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 w-[15%]">
                                        {product.category}
                                    </TableCell>
                                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 w-[15%]">
                                        {product.price.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </TableCell>
                                    <TableCell className="py-3 text-theme-sm">
                                        <span className="px-2 py-1 rounded-full text-gray-500 text-xs font-medium ">
                                            {product.quantity}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    No products sold yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
