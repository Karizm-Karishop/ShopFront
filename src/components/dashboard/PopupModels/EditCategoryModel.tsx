import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { updatecategory } from '../../../Redux/Slices/CategorySlices';
import { AppDispatch } from '../../../Redux/store';
interface EditCategoryModelProps {
  category: {
    category_id: number;
    category_name: string;
    description: string;
    category_icon?: string | File | null;
  };
  onClose: () => void;
  onSubmit: () => void;
}

const EditCategoryModel: React.FC<EditCategoryModelProps> = ({ 
  category, 
  onClose, 
  onSubmit 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categoryName, setCategoryName] = useState(category.category_name);
  const [description, setDescription] = useState(category.description);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    typeof category.category_icon === 'string' ? category.category_icon : null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const updateData = {
      id: category.category_id,
      category_name: categoryName,
      description: description,
      category_icon: categoryImage
    };
  
    try {
      await dispatch(updatecategory(updateData)).unwrap();
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Failed to update category', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[100%] md:w-[50%] relative">
        <div className="mx-auto p-6">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
            <button 
              type="button"
              className="absolute top-2 right-2 text-xl" 
              onClick={onClose}
            >
              <MdClose />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  onChange={handleImageChange}
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Category Preview" 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center">
              <button
                type="submit"
                className="w-[30%] bg-[#1C4A93] text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModel;