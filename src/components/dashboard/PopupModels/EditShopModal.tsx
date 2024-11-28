import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { useAppSelector } from '../../../Redux/hooks';
import { RootState } from '../../../Redux/store';
interface Shop {
    id: number;
    name: string;
    owner: string;
    icon: any;
    banner: any;
    status: "Active" | "Inactive";
    createdDate: string;
    category: number | null;
    address: string;
    contactInfo: string;
    openingHours: string;
    description: string;
  }
  
interface EditShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopData: Shop | null;
  onSubmit: (updatedShop: Shop) => void;
}

const EditShopModal: React.FC<EditShopModalProps> = ({ isOpen, onClose, shopData, onSubmit }) => {
  const categories= useAppSelector((state: RootState)=> state.categories.categories);
  const [shopName, setShopName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [banner, setBannerImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  useEffect(() => {
    if (shopData) {
      setShopName(shopData.name);
      setDescription(shopData.description);
      setCategory(shopData.category);
      setBannerImage(shopData.banner);
      setIcon(shopData.icon);
      setAddress(shopData.address);
      setContactInfo(shopData.contactInfo);
      setOpeningHours(shopData.openingHours);
    }
  }, [shopData, icon]);

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    if (shopData) {
      
      onSubmit({
        ...shopData,
        name: shopName,
        description,
        banner,
        icon,
        category,
        address,
        contactInfo,
        openingHours,
       
      });
    }
  };

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

  if (!isOpen || !shopData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] md:w-[50%] relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
          <MdClose />
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Shop</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shop Name */}
            <div className="mb-4">
              <label className="block text-sm">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm">Category</label>
              <select
                value={category ?? ''}
                onChange={(e) => setCategory(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_name}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Banner Image */}
           
            <div className="mb-4">
            {banner&&
               ( <img
                  src={shopData.banner|| banner}
                  alt="Shop Icon"
                  className="w-10 h-10 object-cover rounded"
                />)
              }
              <label className="block text-sm">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded"
                onChange={handleBannerImageChange}
              />
            </div>

            {/* Icon */}
            <div className="mb-4">
              {icon&&
               ( <img
                  src={shopData.icon}
                  alt="Shop Icon"
                  className="w-10 h-10 object-cover rounded"
                />)
              }
              <label className="block text-sm">Icon</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded"
                onChange={handleIconChange}
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Contact Info */}
            <div className="mb-4">
              <label className="block text-sm">Contact Info</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>


          </div>
                      {/* Opening Hours */}
                      <div className="mb-4">
              <label className="block text-sm">Opening Hours</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-[#1C4A93] text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShopModal;
