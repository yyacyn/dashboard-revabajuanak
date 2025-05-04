import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
// import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

interface Product {
    id: number | string;
    name: string;
    description: string;
    category: string;
    tag: string;
    price: number;
    quantity: number;
    // status: string;
    image: string;
}

export default function ProductsTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    useEffect(() => {
        fetch("http://localhost:8000/products")
            .then((response) => response.json())
            .then((data) => {
                const fetchedProducts = data.products.map((product: any) => ({
                    id: product.ID,
                    name: product.nama_produk,
                    description: product.deskripsi,
                    category: product.kategori,
                    tag: product.tag,
                    price: product.harga,
                    quantity: product.jumlah,
                    // status: "Active", // Assuming all fetched products are active
                    image: product.image,
                }));
                setProducts(fetchedProducts);
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8000/delproducts/${id}`, {
                    method: 'DELETE',
                })
                    .then((response) => {
                        if (response.ok) {
                            setProducts(products.filter((product) => product.id !== id));
                            Swal.fire(
                                'Deleted!',
                                'Your product has been deleted.',
                                'success'
                            );
                        } else {
                            console.error("Error deleting product:", response.statusText);
                        }
                    })
                    .catch((error) => console.error("Error deleting product:", error));
            }
        });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddProduct = () => {
        setEditingProduct({
            id: 0, // Set id to 0 for new product
            name: "",
            description: "",
            category: "",
            tag: "",
            price: 0,
            quantity: 0,
            // status: "Active",
            image: "",
        });
        setIsModalOpen(true);
    };

    const handleFileUpload = async (productId: number, files: FileList | null) => {
        if (!files) return;

        console.log("Uploading files for product ID:", productId); // Debug the product ID
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("images", file); // "images" matches the backend key
        });

        try {
            const response = await fetch(`http://localhost:8000/upload/products/${productId}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                
            } else {
                console.error("Error uploading files:", response.statusText);
                Swal.fire("Error!", "Failed to upload files.", "error");
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            Swal.fire("Error!", "An error occurred while uploading files.", "error");
        }
    };

    const handleSave = () => {
        if (editingProduct) {
            if (editingProduct.id === 0) {
                // Add new product
                fetch("http://localhost:8000/addproducts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nama_produk: editingProduct.name,
                        deskripsi: editingProduct.description,
                        kategori: editingProduct.category,
                        tag: editingProduct.tag,
                        harga: editingProduct.price,
                        jumlah: editingProduct.quantity,
                        image: editingProduct.image || "", // Use existing image or empty
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to add product");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        const productId = data.product.ID;
                        setProducts([...products, { ...editingProduct, id: productId, image: productId.toString() }]);
                        setEditingProduct(null);
                        setIsModalOpen(false);
    
                        // Call handleFileUpload to upload files after adding the product
                        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
                        if (fileInput?.files?.length) {
                            handleFileUpload(productId, fileInput.files).then(() => {
                                // Refresh the product list to update the image
                                fetch("http://localhost:8000/products")
                                    .then((response) => response.json())
                                    .then((data) => {
                                        const fetchedProducts = data.products.map((product: any) => ({
                                            id: product.ID,
                                            name: product.nama_produk,
                                            description: product.deskripsi,
                                            category: product.kategori,
                                            tag: product.tag,
                                            price: product.harga,
                                            quantity: product.jumlah,
                                            image: product.image,
                                        }));
                                        setProducts(fetchedProducts);
                                    });
                            });
                        }
    
                        Swal.fire("Added!", "Your product has been added.", "success");
                    })
                    .catch((error) => {
                        console.error("Error adding product:", error);
                        Swal.fire("Error!", "Failed to add product.", "error");
                    });
            } else {
                // Edit existing product
                fetch(`http://localhost:8000/editproducts/${editingProduct.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nama_produk: editingProduct.name,
                        deskripsi: editingProduct.description,
                        kategori: editingProduct.category,
                        tag: editingProduct.tag,
                        harga: editingProduct.price,
                        jumlah: editingProduct.quantity,
                        image: editingProduct.id.toString(), // Set image to the product ID
                    }),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to edit product");
                        }
                        return response.json();
                    })
                    .then(() => {
                        setProducts(
                            products.map((product) =>
                                product.id === editingProduct.id
                                    ? { ...editingProduct, image: editingProduct.id.toString() }
                                    : product
                            )
                        );
    
                        // Upload the new image if a file is selected
                        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
                        if (fileInput?.files?.length) {
                            handleFileUpload(Number(editingProduct.id), fileInput.files).then(() => {
                                // Refresh the product list to update the image
                                fetch("http://localhost:8000/products")
                                    .then((response) => response.json())
                                    .then((data) => {
                                        const fetchedProducts = data.products.map((product: any) => ({
                                            id: product.ID,
                                            name: product.nama_produk,
                                            description: product.deskripsi,
                                            category: product.kategori,
                                            tag: product.tag,
                                            price: product.harga,
                                            quantity: product.jumlah,
                                            image: product.image,
                                        }));
                                        setProducts(fetchedProducts);
                                    });
                            });
                        }
    
                        setEditingProduct(null);
                        setIsModalOpen(false);
    
                        Swal.fire("Updated!", "Your product has been updated.", "success");
                    })
                    .catch((error) => {
                        console.error("Error editing product:", error);
                        Swal.fire("Error!", "Failed to edit product.", "error");
                    });
            }
        }
    };

    const handleCloseModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <div className="p-4 flex justify-between items-center">
                        <input
                            type="text"
                            className="w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />

                        <Button
                            onClick={handleAddProduct}
                            className="ml-4 bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 py-[10px]"
                        >
                            <FaPlus />
                            Add Product
                        </Button>
                    </div>
                    <Table className="table-auto w-full">
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
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y table-auto w-full divide-gray-100 dark:divide-white/[0.05]">
                            {currentProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="px-0 py-4 w-auto sm:px-6 mx-0 whitespace-nowrap">
                                        <img
                                            src={`http://localhost:8000/uploads/products/${product.image}/1.jpg` || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png";
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="py-2 sm:px-6 text-start text-theme-sm whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[175px] dark:text-white">
                                            {product.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[200px] line-clamp-3 overflow-hidden text-ellipsis">
                                            {product.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[80px]">
                                            {product.category}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[80px]">
                                            {product.tag}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[100px]">
                                            Rp. {product.price}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[50px]">
                                            {product.quantity}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-2 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex gap-1">
                                            <Button
                                                onClick={() => handleEdit(product)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(Number(product.id))}
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

            {/* Edit Product Modal */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-20">
                    <div className="bg-white p-4 rounded-md shadow-md w-1/3"> {/* Adjusted width and padding */}
                        <h2 className="text-xl font-bold mb-4">{editingProduct.id === 0 ? "Add Product" : "Edit Product"}</h2>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Images</label>
                            <input
                                type="file"
                                multiple // Allow multiple file selection
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.files) {
                                        const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                                        setEditingProduct({
                                            ...editingProduct,
                                            image: files.join(", "), // Store file URLs as a comma-separated string
                                        });
                                    }
                                }}
                            />
                        </div>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        description: e.target.value,
                                    })
                                }
                                rows={4}
                            />
                        </div>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Category</label>
                            <input
                                type="text"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.category}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        category: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Tag</label>
                            <input
                                type="text"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.tag}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        tag: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="number"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        price: parseFloat(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div className="mb-2"> {/* Adjusted margin */}
                            <label className="block text-gray-700">Quantity</label>
                            <input
                                type="number"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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