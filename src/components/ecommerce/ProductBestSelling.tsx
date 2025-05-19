import { useState, useEffect } from "react";

interface Product {
    ID: number;
    nama_produk: string;
    deskripsi: string;
    kategori: string;
    harga: number;
    image?: string;
}

interface OrderDetail {
    Produk: Product;
    total_produk: number;
}

interface ProductSales {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    image?: string;
    quantity: number;
}

function ProductBestSelling() {
    const [products, setProducts] = useState<ProductSales[]>([]);
    const [searchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders and products data
                const [ordersResponse, productsResponse] = await Promise.all([
                    fetch("http://localhost:8000/orders"),
                    fetch("http://localhost:8000/products"),
                ]);

                const ordersData = await ordersResponse.json();
                const productsData = await productsResponse.json();

                if (Array.isArray(ordersData.order_details) && Array.isArray(productsData.products)) {
                    // Aggregate product sales
                    const productSales = ordersData.order_details.reduce(
                        (acc: Record<number, ProductSales>, detail: OrderDetail) => {
                            const product = detail.Produk;
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
                                    };
                                }
                                acc[product.ID].quantity += detail.total_produk;
                            }
                            return acc;
                        },
                        {}
                    );

                    // Merge with product details from /products API
                    const mergedProducts = productsData.products.map((product: Product) => ({
                        id: product.ID,
                        name: product.nama_produk,
                        description: product.deskripsi,
                        category: product.kategori,
                        price: product.harga,
                        image: product.image,
                        quantity: productSales[product.ID]?.quantity || 0,
                    }));

                    // Sort by quantity sold
                    const sortedProducts: ProductSales[] = mergedProducts.sort((a: ProductSales, b: ProductSales) => b.quantity - a.quantity).slice(0, 5);

                    setProducts(sortedProducts);
                } else {
                    console.error("Unexpected API response format");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Filter products based on search term
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white shadow-md rounded-xl p-6 dark:bg-white/[0.03] dark:text-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Best Selling Products
                </h2>
            </div>

            <div className="overflow-x-auto">
                {filteredProducts.length > 0 ? (
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-200">
                            <tr>
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Quantity Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3">
                                        <div className="w-12 h-12 rounded overflow-hidden">
                                            <img
                                                src={`http://localhost:8000/uploads/products/${product.id}/1.jpg`}
                                                alt={product.name}
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png";
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-[300px] min-w-[200px]">{product.name}</td>
                                    <td className="px-4 py-3 whitespace-normal break-words max-w-[500px] min-w-[300px]">
                                        {product.description}
                                    </td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3">
                                        {product.price.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </td>
                                    <td className="px-4 py-3">{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        No products sold yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductBestSelling;