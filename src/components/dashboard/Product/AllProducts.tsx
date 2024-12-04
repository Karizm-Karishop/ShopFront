import React, { useState, useEffect } from "react";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { RootState } from "../../../Redux/store";
import BeatLoader from "react-spinners/BeatLoader";
import ConfirmationCard from "../../ConfirmationPage/ConfirmationCard";

import {
  Search
} from "lucide-react";
import {
  deleteProduct,
  fetchAllProductswithArtist,
} from "../../../Redux/Slices/addProductSlice";
import EditProductModal from "./EditProductModel";

interface Product {
  product_id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  product_image: string;
  gallery: string[];
  sales_price: string;
  regular_price: string;
  quantity: number;
  isAvailable: boolean;
  tags: string[];
  description?: string; 
}

const AllProducts: React.FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const { products, loading, error } = useAppSelector((state: RootState) => state.product);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchAllProductswithArtist(user.user_id));
    }
  }, [dispatch, user?.user_id]);

  useEffect(() => {
    if (!products) return;

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.shortDesc && product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.longDesc && product.longDesc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.tags && product.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (product.sales_price && product.sales_price.includes(searchTerm)) ||
      (product.regular_price && product.regular_price.includes(searchTerm))
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm]);

  const sortProducts = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredProducts(sortedProducts);
  };

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);



  const handleDeleteClick = (id: number) => {
    setCurrentProductId(id);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (currentProductId !== null) {
      dispatch(deleteProduct(currentProductId));
    }
    setModalVisible(false);
    setCurrentProductId(null);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
    setCurrentProductId(null);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BeatLoader color="#1C4A93" loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold mb-6 px-[10px] text-[#000]">
          All Products
        </h1>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Products (Name, Description, Tags, Price)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('product_image')}
              >
                Image {sortConfig.key === 'product_image' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('name')}
              >
                Product Title {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('shortDesc')}
              >
                Short Description {sortConfig.key === 'shortDesc' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('longDesc')}
              >
                Long Description {sortConfig.key === 'longDesc' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('regular_price')}
              >
                Regular Price {sortConfig.key === 'regular_price' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('sales_price')}
              >
                Sale Price {sortConfig.key === 'sales_price' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('quantity')}
              >
                Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th 
                className="px-4 py-2 text-left text-[13px] font-bold text-[#000] cursor-pointer"
                onClick={() => sortProducts('isAvailable')}
              >
                Availability {sortConfig.key === 'isAvailable' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Tags</th>
              <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.product_id}>
                  <td className="px-4 py-2">
                    <img 
                      src={product.product_image} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.shortDesc}</td>
                  <td className="px-4 py-2">{product.longDesc}</td>
                  <td className="px-4 py-2">${product.regular_price}</td>
                  <td className="px-4 py-2">${product.sales_price}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{product.tags.join(", ")}</td>
                  
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <button 
                      onClick={() => handleEditClick(product)}
                        className="text-[#1C4A93] hover:text-[#1C4A93] text-lg cursor-pointer"
                        title="Edit Product"
                      >
                        <MdModeEdit />
                      </button>
                      <button 
                       onClick={() => handleDeleteClick(product.product_id)}
                        className="text-red hover:text-red text-lg cursor-pointer"
                        title="Delete Product"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center px-4 py-2">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalProducts)} of {totalProducts} products
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md outline-none ${
                currentPage === index + 1
                  ? "bg-[#1C4A93] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#1C4A93] hover:text-white"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <ConfirmationCard
        isVisible={isConfirmationModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this Product?"
      />
            {/* Edit Product Modal */}
            {isEditModalOpen && selectedProduct && (
        <EditProductModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default AllProducts;