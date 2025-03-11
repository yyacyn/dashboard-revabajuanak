import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    tag: string;
    price: number;
    quantity: number;
    status: string;
    image: string;
}

// Sample data for the table
const initialProducts: Product[] = [
    {
        id: 1,
        name: "Product 1",
        description: "Description 1",
        category: "Category 1",
        tag: "Tag 1",
        price: 100,
        quantity: 10,
        status: "Active",
        image: "/images/product1.jpg",
    },
    {
        id: 2,
        name: "Product 2",
        description: "Description 2",
        category: "Category 2",
        tag: "Tag 2",
        price: 200,
        quantity: 20,
        status: "Pending",
        image: "/images/product2.jpg",
    },
    {
        id: 3,
        name: "Product 3",
        description: "Description 3",
        category: "Category 3",
        tag: "Tag 3",
        price: 300,
        quantity: 30,
        status: "Inactive",
        image: "/images/product3.jpg",
    },
];

export default function ProductsTable() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = (id: number) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddProduct = () => {
        setEditingProduct({
            id: products.length + 1,
            name: "",
            description: "",
            category: "",
            tag: "",
            price: 0,
            quantity: 0,
            status: "Active",
            image: "",
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingProduct) {
            setProducts(
                products.map((product) =>
                    product.id === editingProduct.id ? editingProduct : product
                )
            );
            setEditingProduct(null);
            setIsModalOpen(false);
        }
    };

    const handleCloseModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <div className="p-4  flex items-center justify-between gap-5">
                        <input
                            type="text"
                            className="w-[85%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <Button 
                            onClick={handleAddProduct}
                            className="bg-green-500 hover:bg-green-600 py-[12px]"
                        >
                            <FaPlus className="flex justify-center"/>
                            Add Product
                        </Button>
                    </div>
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Image
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Category
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Tag
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Price
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
                                    Status
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </TableCell>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.description}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.category}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.tag}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.price}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {product.quantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                product.status === "Active"
                                                    ? "success"
                                                    : product.status === "Pending"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleEdit(product)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                                            >
                                                <FaEdit />
                                                
                                            </Button>
                                            <Button 
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                                            >
                                                <FaTrash />
                                                
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Product Modal */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-20">
                    <div className="bg-white p-6 rounded-md shadow-md w-1/2">
                    <h2 className="text-xl font-bold mb-4">{editingProduct.id > products.length ? "Add Product" : "Edit Product"}</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Category</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.category}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        category: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Tag</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.tag}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        tag: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        price: parseFloat(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        quantity: parseInt(e.target.value, 10),
                                    })
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button 
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Save
                            </Button>
                            <Button 
                                onClick={handleCloseModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}