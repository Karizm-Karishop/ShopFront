import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../../Redux/hooks';
import { RootState } from '../../../../Redux/store';
import { showSuccessToast } from '../../../../utilis/ToastProps';
import { useNavigate } from 'react-router-dom';
import { categoryThunk } from '../../../../Redux/Slices/CategorySlice';
import BeatLoader from 'react-spinners/BeatLoader';


const url = import.meta.env.VITE_BASE_URL;

const AddShopForm: React.FC = () => {
  const [loading, setLoading]= useState(false);
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state: RootState) => state.categories.categories);
  console.log('categories', categories);
  const navigate = useNavigate()
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const [shopName, setShopName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  useEffect(() => {
    dispatch(categoryThunk());
  }, []);
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIcon(e.target.files[0]);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBannerImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('shop_name', shopName);
    formData.append('description', description);
    formData.append('category_id', `${category}`);
    formData.append('artist_id', `${user?.user_id}`);
    formData.append('address', address);
    formData.append('contact_info', contactInfo);
    formData.append('opening_hours', openingHours);
    if (icon) {
      formData.append('icon', icon);
    }
    if (bannerImage) formData.append('banner', bannerImage);
    e.preventDefault();
    console.log({
      shopName,
      icon,
      description,
      category,
      artistId: user?.user_id,
      bannerImage,
      address,
      contactInfo,
      openingHours,
    });

    const response = await axios.post(`${url}/shops`, formData);
    const data = response.data;
    console.log("data", data);
    if (data) {
      setLoading(false);
      showSuccessToast(response.data.message);
      navigate('/dashboard/shop/all')
    }

  };

  return (
    <div className="container mx-auto p-6">
      {/* Shop Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[#1C4A93] text-white rounded shadow">
          <h3 className="font-bold text-lg">Views</h3>
          <p className="text-2xl">1,234</p>
        </div>
        <div className="p-4 bg-[#1C4A93] text-white rounded shadow">
          <h3 className="font-bold text-lg">Total Sales</h3>
          <p className="text-2xl">$12,345</p>
        </div>
        <div className="p-4 bg-[#1C4A93] text-white rounded shadow">
          <h3 className="font-bold text-lg">Orders</h3>
          <p className="text-2xl">567</p>
        </div>
      </div>

      {/* Add Shop Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add Shop</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shop Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>


          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Artist Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={user?.firstName + ' ' + user?.lastName}
              disabled
            />
          </div>
          {/* Banner Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleBannerImageChange}
            />
          </div>

          {/* Shop Icon */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              onChange={handleIconChange}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={category ?? ''}
              onChange={(e) => setCategory(Number(e.target.value))}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Contact Information */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Contact Information (Phone/Email)
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>

          {/* Opening Hours */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Opening Hours
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

        </div>


        <div className="flex flex-col items-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-[30%] bg-[#1C4A93] text-white py-2 rounded-md hover:bg-blue-dark transition"
          >
           {loading? (
                      <BeatLoader color="#ffffff" size={8} />
                    ) : (" Create Shop")}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddShopForm;


