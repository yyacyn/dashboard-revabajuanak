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
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        fetch("https://backend-go-gin-production.up.railway.app/products")
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


    const [isQtyModalOpen, setIsQtyModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [sizeQuantities, setSizeQuantities] = useState({
        XS: 0,
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
    });

    const openQuantityModal = (productId: number) => {
        setSelectedProductId(productId);
        setIsQtyModalOpen(true);

        // Fetch existing quantities for the product
        fetch(`https://backend-go-gin-production.up.railway.app/products/${productId}/sizes`)
            .then((response) => response.json())
            .then((data) => {
                // Map the sizes from the response to the sizeQuantities state
                const quantities = data.sizes.reduce((acc: any, size: any) => {
                    acc[size.Ukuran] = size.Stok;
                    return acc;
                }, { XS: 0, S: 0, M: 0, L: 0, XL: 0 }); // Default values for all sizes

                setSizeQuantities(quantities);
            })
            .catch((error) => console.error("Error fetching quantities:", error));
    };

    const getSizeId = (size: string): number => {
        const sizeMap: { [key: string]: number } = {
            XS: 1,
            S: 2,
            M: 3,
            L: 4,
            XL: 5,
        };
        return sizeMap[size] || 0; // Default to 0 if the size is not found
    };

    const handleSaveQuantities = () => {
        if (selectedProductId) {
            const payload = Object.entries(sizeQuantities).map(([size, quantity]) => ({
                ukuran_id: getSizeId(size), // Map size name to size ID
                stok: quantity,
            }));

            console.log("Payload being sent:", payload); // Log the payload

            fetch(`https://backend-go-gin-production.up.railway.app/products/${selectedProductId}/sizes`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    console.log("Response status:", response.status); // Log the response status
                    if (!response.ok) {
                        console.error("Response text:", response.statusText); // Log the response text
                        throw new Error("Failed to update quantities");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Response data:", data); // Log the response data
                    setIsQtyModalOpen(false);
                    Swal.fire("Updated!", "Quantities have been updated.", "success");

                    // Refetch the products to update the list
                    fetch("https://backend-go-gin-production.up.railway.app/products")
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
                        })
                        .catch((error) => console.error("Error refetching products:", error));
                })
                .catch((error) => {
                    console.error("Error updating quantities:", error);
                    Swal.fire("Error!", "Failed to update quantities.", "error");
                });
        }
    };

    const handleCloseQtyModal = () => {
        setIsQtyModalOpen(false);
        setSelectedProductId(null);
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
                fetch(`https://backend-go-gin-production.up.railway.app/delproducts/${id}`, {
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

    const handleAddProduct = () => {
        setEditingProduct({
            id: 0, // Set id to 0 for new product
            name: "",
            description: "",
            category: "",
            tag: "N/A",
            price: 0,
            quantity: 0,
            image: "",
        });
        setImagePreviews([]); // Reset previews
        setIsModalOpen(true);
    };

    const handleEdit = async (product: Product) => {
        setEditingProduct(product);

        const imageUrls: string[] = [];
        let index = 1;

        while (true) {
            const imageUrl = `https://backend-go-gin-production.up.railway.app/uploads/products/${product.id}/${index}.jpg`;

            // Check if the image exists by attempting to fetch it
            try {
                const response = await fetch(imageUrl, { method: "HEAD" });
                if (!response.ok) {
                    break; // Stop if the image does not exist
                }
                imageUrls.push(imageUrl); // Add the valid image URL to the list
            } catch {
                break; // Stop if there's an error fetching the image
            }

            index++;
        }

        setImagePreviews(imageUrls); // Populate previews with available images
        setIsModalOpen(true);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const previews = files.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews); // Set previews
            setEditingProduct({
                ...editingProduct!,
                image: files.map((file) => file.name).join(", "), // Store file names
            });
        }
    };

    const handleFileUpload = async (productId: number, files: FileList | null) => {
        if (!files) return;

        console.log("Uploading files for product ID:", productId); // Debug the product ID
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("images", file); // "images" matches the backend key
        });

        try {
            const response = await fetch(`https://backend-go-gin-production.up.railway.app/upload/products/${productId}`, {
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
                fetch("https://backend-go-gin-production.up.railway.app/addproducts", {
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
                                fetch("https://backend-go-gin-production.up.railway.app/products")
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
                fetch(`https://backend-go-gin-production.up.railway.app/editproducts/${editingProduct.id}`, {
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
                                fetch("https://backend-go-gin-production.up.railway.app/products")
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
                                {/* <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Size
                                </TableCell> */}
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
                                    Total Qty
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
                                            src={`https://backend-go-gin-production.up.railway.app/uploads/products/${product.image}/1.jpg` || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"}
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
                                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[80px]">
                                            {product.tag}
                                        </div>
                                    </TableCell> */}
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="whitespace-normal break-words max-w-[100px]">
                                            Rp. {product.price}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 whitespace-normal break-words">
                                        <div className="flex items-center gap-2">
                                            <span className="whitespace-normal break-words max-w-[50px]">
                                                {product.quantity}
                                            </span>
                                            <Button
                                                onClick={() => openQuantityModal(Number(product.id))}
                                                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center p-1"
                                            >
                                                <FaEdit />
                                            </Button>
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md shadow-md w-full max-w-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProduct.id === 0 ? "Add Product" : "Edit Product"}
                        </h2>
                        <div className="mb-2">
                            <label className="block text-gray-700">Images</label>
                            <input
                                type="file"
                                multiple
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleFileInputChange}
                            />
                            <div className="flex gap-2 mt-2 overflow-x-auto max-w-full p-2 border rounded-md">
                                {imagePreviews.map((preview, index) => (
                                    <div
                                        key={index}
                                        className="relative w-40 h-40 flex-shrink-0 rounded overflow-hidden border"
                                    >
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-2">
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
                        <div className="mb-2">
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
                        <div className="mb-2">
                            <label className="block text-gray-700">Category</label>
                            <select
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingProduct.category}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setEditingProduct({
                                        ...editingProduct,
                                        category: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Category</option>
                                <option value="baju">Baju</option>
                                <option value="celana">Celana</option>
                                <option value="baju bayi">Baju Bayi</option>
                            </select>
                        </div>
                        <div className="mb-2">
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

            {isQtyModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-20">
                    <div className="bg-white p-4 rounded-md shadow-md w-1/3">
                        <h2 className="text-xl font-bold mb-4">Edit Quantities</h2>
                        {Object.keys(sizeQuantities).map((size) => (
                            <div key={size} className="mb-2">
                                <label className="block text-gray-700">{size}</label>
                                <input
                                    type="number"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={sizeQuantities[size as keyof typeof sizeQuantities]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setSizeQuantities({
                                            ...sizeQuantities,
                                            [size]: parseInt(e.target.value, 10),
                                        })
                                    }
                                />
                            </div>
                        ))}
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={handleSaveQuantities}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={handleCloseQtyModal}
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