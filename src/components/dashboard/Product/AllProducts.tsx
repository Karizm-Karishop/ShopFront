import axios from "axios";
import { useEffect, useState } from "react";
import { MdModeEdit, MdDelete } from "react-icons/md";
const AllProducts = () => {
  const [products, setProducts]=useState([]);

  
  const handleFetchProducts=async()=>{
    try{
      const response= await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
      const data= response.data;
      console.log(data.data);
      setProducts(data.data);
      return data;
    }catch(error){
      console.error('Error:', error);
    }
  }
  useEffect(()=>{
    handleFetchProducts();
  },[])
   
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5;
      const totalPages = Math.ceil(products.length / itemsPerPage);
    
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
    
      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);
    
      return (
        <section className="p-8">
          <h1 className="text-xl font-bold mb-6 px-[10px] text-[#000]">
            All Products
          </h1>
    
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Image</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Product Title</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Type</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Category</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Short Description</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Long Description</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Regular Price</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Sale Price</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Quantity</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Unit/Measure</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Tags</th>
                  <th className="px-4 py-2 text-left text-[13px] font-bold text-[#000]">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product: any) => (
                    <tr key={product.product_id}>
                      <td className="px-4 py-2">
                        <img src={product.product_image} alt={product.title} className="w-20 h-20 object-cover" />
                      </td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.tags}</td>
                      <td className="px-4 py-2">{product.category.category_name}</td>
                      <td className="px-4 py-2">{product.shortDesc}</td>
                      <td className="px-4 py-2">{product.longDesc}</td>
                      <td className="px-4 py-2">{product.regular_price}</td>
                      <td className="px-4 py-2">{product.sale_price}</td>
                      <td className="px-4 py-2">{product.quantity}</td>
                      <td className="px-4 py-2">{product.quantity}</td>
                      <td className="px-4 py-2">{product.tags.join(", ")}</td>
                      
                      {/* Action buttons */}
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <button className="text-[#1C4A93] hover:text-[#1C4A93] text-lg cursor-pointer">
                            <MdModeEdit />
                          </button>
                          <button className="text-red hover:text-red text-lg cursor-pointer">
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center px-4 py-2">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    
          <div className="flex justify-between items-center mt-6">
            <div className="text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, products.length)} of {products.length} products
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
        </section>
      );
    };
    
    export default AllProducts;