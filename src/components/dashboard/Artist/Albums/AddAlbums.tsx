import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlbumData {
  title: string;
  description: string;
  coverImage: File | null;
}

const CreateAlbum: React.FC = () => {
  const [albumData, setAlbumData] = useState<AlbumData>({
    title: "",
    description: "",
    coverImage: null
  });
  const [coverPreview, setCoverPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAlbumData(prev => ({ ...prev, coverImage: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAlbumData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Navigate to music page and pass album data
    navigate('/music-page', { 
      state: { 
        albumData: {
          ...albumData,
          coverImagePreview: coverPreview
        } 
      } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Create New Album</h1>
          <p className="text-gray-600 mb-6">
            Create your album details before adding music
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Album Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter album title"
                  value={albumData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Album Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your album..."
                  value={albumData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {coverPreview ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAlbumData(prev => ({ ...prev, coverImage: null }));
                          setCoverPreview("");
                        }}
                        className="absolute -top-2 -right-2 bg-red text-white rounded-full p-1 font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={24} className="text-gray-400" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#1C4A93] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue"
            >
              Next: Add Music
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbum;