import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import EditCategoryModel from "../../PopupModels/EditCategoryModel";
import { RootState, AppDispatch } from "../../../../Redux/store";
import { useAppSelector } from "../../../../Redux/hooks";
import BeatLoader from "react-spinners/BeatLoader";
import ConfirmationCard from "../../../ConfirmationPage/ConfirmationCard";

import {
  fetchAllCategoriesByArtist,
  Category as CategoryType,
  deletecategory,
} from "../../../../Redux/Slices/CategorySlices";

const AllCategories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchAllCategoriesByArtist(user.user_id));
    }
  }, [dispatch, user?.user_id]);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.category_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category_id: number) => {
    setCurrentCategoryId(category_id);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (currentCategoryId !== null) {
      dispatch(deletecategory(currentCategoryId));
    }
    setModalVisible(false);
    setCurrentCategoryId(null);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
    setCurrentCategoryId(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center">
        <BeatLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-red-500">
        <p>Error loading categories: {error}</p>
      </div>
    );
  }

  // Render empty state
  if (categories.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">All Categories</h1>
        <p className="text-gray-500">
          No categories found. Create your first category!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Categories</h1>
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search categories..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Icon</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentItems.map((category) => (
              <tr
                key={category.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {category.id}
                </td>
                <td className="py-3 px-6 text-left">
                  {category.category_name}
                </td>

                <td className="py-3 px-6 text-left">
                  {category.category_icon ? (
                    <img
                      src={
                        typeof category.category_icon === "string"
                          ? category.category_icon
                          : URL.createObjectURL(category.category_icon)
                      }
                      alt={category.category_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Icon</span>
                  )}
                </td>
                <td className="py-3 px-6 text-left">{category.description}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue hover:text-blue-700 text-lg cursor-pointer"
                    >
                      <MdModeEdit className="w-5 h-5" color="#1C4A93" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(category.category_id)}
                      className="text-red hover:text-red-700 text-lg cursor-pointer"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
          {filteredCategories.length} entries
        </div>
        <div className="flex">
          {Array.from(
            { length: Math.ceil(filteredCategories.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue text-white" : "bg-gray"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
      <ConfirmationCard
        isVisible={isConfirmationModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this category?"
      />
      {/* Modal */}
      {isModalOpen && selectedCategory && (
        <EditCategoryModel
          category={selectedCategory}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AllCategories;
