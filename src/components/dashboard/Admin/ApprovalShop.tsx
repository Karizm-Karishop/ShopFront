/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useState, useEffect } from "react";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { showSuccessToast, showErrorToast } from "../../../utilis/ToastProps";;
import ConfirmationCard from "../../ConfirmationPage/ConfirmationCardToRejectShop"; // Updated Confirmation Modal
import BeatLoader from "react-spinners/BeatLoader";

enum ShopStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

interface Shop {
  shop_id: number;
  shop_name: string;
  artist: {
    firstName: string;
    lastName: string;
  };
  category: {
    category_name: string;
  };
  shop_status: ShopStatus;
  created_at: string;
}

const ShopApprovalTable = () => {
  const token = localStorage.getItem('token');
 
  const [shops, setShops] = useState<Shop[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ShopStatus>("All");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [loadingShopIds, setLoadingShopIds] = useState<{
    approving: number | null,
    rejecting: number | null
  }>({
    approving: null,
    rejecting: null
  });

  const shopsPerPage = 5;
  
  const fetchShops = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/shops`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: shopsPerPage
        }
      });

      if (response.data.success) {
        setShops(response.data.data.shops);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      showErrorToast("Failed to fetch shops");
    }
  };

  useEffect(() => {
    fetchShops();
  }, [currentPage]);

  const filteredShops = shops.filter((shop) => {
    const matchesSearch = 
      shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${shop.artist.firstName} ${shop.artist.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || shop.shop_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  const handleApprove = async (shopId: number) => {
    setLoadingShopIds(prev => ({ ...prev, approving: shopId }));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/approve/${shopId}`, 
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast("Shop approved successfully");
        fetchShops(); 
      }
    } catch (error) {
      console.error("Error approving shop:", error);
      showErrorToast("Failed to approve shop");
    } finally {
      setLoadingShopIds(prev => ({ ...prev, approving: null }));
    }
  };

  const handleReject = async () => {
    if (!selectedShop || !rejectionReason.trim()) {
      showErrorToast("Please provide a rejection reason");
      return;
    }

    setLoadingShopIds(prev => ({ ...prev, rejecting: selectedShop.shop_id }));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/reject/${selectedShop.shop_id}`, 
        { rejection_reason: rejectionReason },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        showSuccessToast("Shop rejected successfully");
        fetchShops();
        setIsConfirmationOpen(false);
        setRejectionReason("");
        setSelectedShop(null);
      }
    } catch (error) {
      console.error("Error rejecting shop:", error);
      showErrorToast("Failed to reject shop");
    } finally {
      setLoadingShopIds(prev => ({ ...prev, rejecting: null }));
    }
  };

  const openRejectModal = (shop: Shop) => {
    setSelectedShop(shop);
    setIsConfirmationOpen(true);
  };

  const closeRejectModal = () => {
    setIsConfirmationOpen(false);
    setSelectedShop(null);
    setRejectionReason("");
  };

  const getStatusClass = (status: ShopStatus) => {
    switch (status) {
      case ShopStatus.APPROVED:
        return "text-green-600 font-bold";
      case ShopStatus.PENDING:
        return "text-yellow-600 font-bold";
      case ShopStatus.REJECTED:
        return "text-red-600 font-bold";
      default:
        return "";
    }
  };

  const totalShops = shops.length;
  const approvedShops = shops.filter((shop) => shop.shop_status === ShopStatus.APPROVED).length;
  const pendingShops = shops.filter((shop) => shop.shop_status === ShopStatus.PENDING).length;
  const rejectedShops = shops.filter((shop) => shop.shop_status === ShopStatus.REJECTED).length;

  return (
    <div className="p-6 font-mono w-full">
      <h2 className="text-2xl font-bold mb-4">Shop Approval Table</h2>

      <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-4 md:grid-cols-2">
        {[
          { label: "Total Shops", count: totalShops },
          { label: "Approved Shops", count: approvedShops },
          { label: "Pending Shops", count: pendingShops },
          { label: "Rejected Shops", count: rejectedShops }
        ].map((card, index) => (
          <div 
            key={index} 
            className="bg-[#1C4A93] p-4 rounded-lg shadow-md items-center flex flex-col justify-center"
          >
            <h3 className="text-[20px] text-white items-center font-bold">{card.label}</h3>
            <p className="text-[30px] text-white font-bold">{card.count}</p>
          </div>
        ))}
      </div>

      <div className="">
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg pr-10"
            placeholder="Search by shop name or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoIosSearch className="absolute text-[25px] right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="w-full items-end justify-end flex flex-col">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="ml-4 p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All</option>
            <option value={ShopStatus.PENDING}>Pending</option>
            <option value={ShopStatus.APPROVED}>Approved</option>
            <option value={ShopStatus.REJECTED}>Rejected</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-md font-semibold uppercase">
                <th className="px-4 py-3">Shop ID</th>
                <th className="px-4 py-3">Shop Name</th>
                <th className="px-4 py-3">Artist Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Submitted</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentShops.length > 0 ? (
                currentShops.map((shop) => (
                  <tr className="text-gray-700" key={shop.shop_id}>
                    <td className="px-4 py-3 border-b">{shop.shop_id}</td>
                    <td className="px-4 py-3 border-b">{shop.shop_name}</td>
                    <td className="px-4 py-3 border-b">
                      {shop.artist.firstName} {shop.artist.lastName}
                    </td>
                    <td className="px-4 py-3 border-b">{shop.category?.category_name || 'N/A'}</td>
                    <td className={`px-4 py-3 border-b ${getStatusClass(shop.shop_status)}`}>
                      {shop.shop_status}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {new Date(shop.created_at).toLocaleDateString()}
                    </td>
                    <td className="border-b flex-row gap-10">
                      {shop.shop_status !== ShopStatus.APPROVED && (
                        <button
                          className="px-4 py-2 bg-green text-white rounded-lg mr-2 w-[120px] outline-none cursor-pointer flex items-center justify-center my-2"
                          onClick={() => handleApprove(shop.shop_id)}
                          disabled={loadingShopIds.approving === shop.shop_id}
                        >
                          {loadingShopIds.approving === shop.shop_id ? (
                            <>
                              <BeatLoader color="white" size={8} className="mr-2" />
                            </>
                          ) : (
                            "Approve"
                          )}
                        </button>
                      )}
                      {shop.shop_status !== ShopStatus.REJECTED && (
                        <button
                          className="px-4 py-2 bg-red text-white rounded-lg w-[120px] outline-none cursor-pointer flex items-center justify-center my-2"
                          onClick={() => openRejectModal(shop)}
                          disabled={loadingShopIds.rejecting === shop.shop_id}
                        >
                          {loadingShopIds.rejecting === shop.shop_id ? (
                            <>
                              <BeatLoader color="white" size={8} className="mr-2" />
                            </>
                          ) : (
                            "Reject"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No shops found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          Showing {indexOfFirstShop + 1} to{" "}
          {Math.min(indexOfLastShop, filteredShops.length)} of{" "}
          {filteredShops.length} Shops
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
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <ConfirmationCard
        isVisible={isConfirmationOpen}
        onClose={closeRejectModal}
        onConfirm={handleReject}
        message="Are you sure you want to reject this shop?"
      >
        <div className="mt-4">
          <label 
            htmlFor="rejection-reason" 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Rejection Reason
          </label>
          <textarea
            id="rejection-reason"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your rejection reason here..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          ></textarea>
        </div>
      </ConfirmationCard>
    </div>
  );
};

export default ShopApprovalTable;