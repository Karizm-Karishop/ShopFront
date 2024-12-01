import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import EditShopModal from "../../PopupModels/EditShopModal";
import ConfirmationModal from "../../PopupModels/ConfirmationShopDeleteModal";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks";
import { RootState } from "../../../../Redux/store";
import { showSuccessToast } from "../../../../utilis/ToastProps";
import { categoryThunk } from "../../../../Redux/Slices/CategorySlice";

interface Shop {
  id: number;
  name: string;
  owner: string;
  icon: string;
  banner: string;
  status: "Active" | "Inactive";
  createdDate: string;
  category: number | null;
  address: string;
  contactInfo: string;
  openingHours: string;
  description: string;

}
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MyShops = () => {
  const dispatch= useAppDispatch();
  const categories= useAppSelector((state:RootState)=> state.categories);
  console.log('categories', categories);
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [shops, setShops] = useState<any>([]);
  const shopsPerPage = 5;
  const token = localStorage.getItem('token');
  const handleFetchShops = async () => {
    // Fetching data from the API
    const response = await axios.get(`${BASE_URL}/shops/artist/${user?.user_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
    const data = response.data;
    console.log('data', data.data.shops);
    setShops(data.data.shops);
    console.log('shops', shops);
  }
  useEffect(() => {
    dispatch(categoryThunk());
  }, []);
  const filteredShops = shops.filter(
    (shop: any) =>
      shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleEditClick = (shop: Shop) => {
    setSelectedShop(shop);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShop(null);
  };

  const handleUpdateShop = async (updatedShop: Shop) => {
    console.log("Updated Shop:", updatedShop);
    console.log("Updated Shop:", updatedShop);

  const formData = new FormData();
  // formData.append('shop_name', updatedShop.name);
  // formData.append('icon', updatedShop.icon || ''); // Only append if a file exists
  // formData.append('banner', updatedShop.banner || '');

  if (updatedShop.icon) {
    formData.append("icon", updatedShop.icon);
  }
  if (updatedShop.banner) {
    formData.append("banner", updatedShop.banner);
  }
  formData.append('status', updatedShop.status);
  formData.append('opening_hours', updatedShop.openingHours);
  formData.append('contact_info', updatedShop.contactInfo);
  formData.append('owner', updatedShop.owner);
  formData.append('category_id', updatedShop.category?.toString() || '');
  formData.append('address', updatedShop.address);
  formData.append('description', updatedShop.description);
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
    const update = await axios.put(`http://localhost:3000/api/shops/${updatedShop.id}`,
      {
        formData
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      }
    )
    const response = update.data;
    console.log(response);
    setIsModalOpen(false);
    setSelectedShop(null);
  };
  const handleDeleteClick = (shop:{id:number}) => {
    console.log(shop);
    setSelectedShop(shop);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedShop) {
      const deletion = await axios.delete(`${BASE_URL}/shops/${selectedShop.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      const response = deletion.data;
      console.log(response);
      if (response.success) {
        showSuccessToast(response.message || "deletion successful")
      }
      console.log(`Deleted Shop: ${selectedShop.name}`);
    }
    setSelectedShop(null);
  };

  useEffect(() => {
    handleFetchShops();
  }, [selectedShop]);
  return (
    <section className="mx-auto p-6 font-mono w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Shops</h2>

      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg pr-10"
          placeholder="Search shops by name, owner or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoIosSearch className="absolute text-[25px] right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-gray-900 bg-gray-100 uppercase border-b border-gray-200">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Shop Name</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Banner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentShops.length > 0 ? (
                currentShops.map((shop: any) => (
                  <tr className="text-gray-700" key={shop.shop_id}>
                    <td className="px-4 py-3 border-b">{shop.shop_id}</td>
                    <td className="px-4 py-3 border-b">
                      <img
                        src={shop.icon}
                        alt={`${shop.shop_name} Icon`}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-3 border-b">{shop.shop_name}</td>
                    <td className="px-4 py-3 border-b">{user?.firstName}</td>
                    <td className="px-4 py-3 border-b">
                      <img
                        src={shop.banner}
                        alt={`${shop.name} Banner`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-3 border-b">
                      <span
                        className={`inline-block w-24 text-center py-2 rounded-full ${shop.status === "Active"
                          ? "bg-[#1C4A93] text-white"
                          : "bg-red text-white"
                          }`}
                      >
                        {shop.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">{shop.created_at.replace('T', ' ').slice(0, -8)}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-2">
                        <button className="text-[#1C4A93] hover:text-[#1C4A93] text-lg cursor-pointer"
                          onClick={() => handleEditClick(
                            {
                              id: shop.shop_id,
                              name: shop.shop_name,
                              owner: user?.firstName || '',
                              icon: shop.icon || '',
                              banner: shop.banner || '',
                              status: shop.status,
                              createdDate: shop.created_at,
                              category: shop.category.category_id,
                              openingHours: shop.opening_hours,
                              description: shop.description || '',
                              address: shop.address || '',
                              contactInfo: shop.contact,
                            }
                          )}
                        >
                          <MdModeEdit />
                        </button>
                        <button className="text-red hover:text-red text-lg cursor-pointer"
                          onClick={() => handleDeleteClick(
                            {
                              id: shop.shop_id,
                            }
                          )}
                        >
                          <MdDelete />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 border-b" colSpan={8}>
                    No shops found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-600">
            Showing {indexOfFirstShop + 1} to{" "}
            {Math.min(indexOfLastShop, filteredShops.length)} of{" "}
            {filteredShops.length} shops
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md outline-none ${currentPage === index + 1
                  ? "bg-blue text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-blue hover:text-white"
                  }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        {isModalOpen && (
          <EditShopModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            shopData={selectedShop}
            onSubmit={handleUpdateShop}
          />
        )}
        {isConfirmOpen && (
          <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </section>
  );
};

export default MyShops;
