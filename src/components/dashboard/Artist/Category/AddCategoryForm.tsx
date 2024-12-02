/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setName,
  setDescription,
  setCategoryIcon,
  resetcategoryState,
  createcategory,
} from "../../../../Redux/Slices/CategorySlices";
import { RootState, AppDispatch } from "../../../../Redux/store";
import { useAppSelector } from "../../../../Redux/hooks";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../../utilis/ToastProps";

const AddCategoryForm: React.FC = () => {
  const [formMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { category_name, description, category_icon, loading, error } =
    useSelector((state: RootState) => state.category);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      dispatch(setCategoryIcon(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      resetForm();
    }
  }, [loading, error]);

  const resetForm = () => {
    dispatch(resetcategoryState());

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        dispatch(setName(value));
        break;
      case "description":
        dispatch(setDescription(value));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Add more robust validation
    if (!category_name.trim()) {
      showErrorToast('Category name cannot be empty');
      return;
    }
  
    if (!description.trim()) {
      showErrorToast('Description cannot be empty');
      return;
    }
  
    if (!user || !user.user_id) {
      showErrorToast('User information is missing. Please log in again.');
      return;
    }
  
    const result = await dispatch(
      createcategory({
        category_name: category_name.trim(), // Trim whitespace
        description: description.trim(), // Trim whitespace
        category_icon,
        artist_id: user.user_id,
      })
    );
  
    if (createcategory.fulfilled.match(result)) {
      navigate("/dashboard/category/all");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={category_name || ''}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category Icon
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={description || ''}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue 
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1C4A93] hover:bg-blue-700"
                }`}
          >
            {loading ? "Creating Category..." : "Add New Category"}
          </button>
        </div>
        {formMessage && <p className="mt-4 text-green">{formMessage}</p>}
      </form>
    </div>
  );
};

export default AddCategoryForm;