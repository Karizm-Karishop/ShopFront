/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef,useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { 
  setTitle, 
  setDescription, 
  setCoverImage, 
  createAlbum,
  resetAlbumState
} from '../../../../Redux/Slices/AblumSlices';
import { RootState, AppDispatch } from '../../../../Redux/store';
import { useAppSelector } from '../../../../Redux/hooks';

const CreateAlbum: React.FC = () => {

  const [coverPreview, setCoverPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useAppSelector((state: RootState) => state.loginIn.user);

  const { title, description, coverImage, loading, error } = useSelector(
    (state: RootState) => state.album
  );

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      dispatch(setCoverImage(file));
      setCoverPreview(URL.createObjectURL(file));
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
        switch(name) {
      case 'title':
        dispatch(setTitle(value));
        break;
      case 'description':
        dispatch(setDescription(value));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user || !user.user_id) {
      alert("User information is missing. Please log in again.");
      return;
    }
  
    const result = await dispatch(
      createAlbum({
        title,
        description,
        coverImage,
        artist_id: user.user_id, 
      })
    );
  
    if (createAlbum.fulfilled.match(result)) {
      navigate('/dashboard/music/album/all');
    }
  };
  
  useEffect(() => {
    if (!loading && !error) {
      resetForm();
    }
  }, [loading, error]);

  const resetForm = () => {
    dispatch(resetAlbumState()); 
    
    setCoverPreview("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

    const handleRemoveCoverImage = () => {
      dispatch(setCoverImage(null));
      setCoverPreview("");
    };

    const navigateToAllAlbum =()=>{
      navigate('/dashboard/music/album/all');

    }

    const navigateToAddMusic =()=>{
      navigate('/dashboard/music/create');

    }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex flx-row items-center justify-between">
            <div>

            <h1 className="text-2xl font-bold mb-2">Create New Album</h1>
          <p className="text-gray-600 mb-6">
            Create your album details before adding music
          </p>
            </div>
            <div className="flex flex-row justify-between items-center gap-5 ">
            <button
            onClick={navigateToAllAlbum}
              className=" px-4 py-2 text-[#fff] rounded-md focus:outline-none focus:ring-2 focus:ring-blue bg-[#1C4A93] "
            >
              View Albums
            </button>
            <button
            onClick={navigateToAddMusic}
              className=" px-4 py-2 text-[#fff] rounded-md focus:outline-none focus:ring-2 focus:ring-blue bg-[#1C4A93] "
            >
              Add Music
            </button>
            </div>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {error}
            </div>
          )}
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
                  value={title}
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
                  value={description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                        onClick={handleRemoveCoverImage}
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1C4A93] hover:bg-blue-700'}`}
            >
              {loading ? 'Creating album...' : 'Next: Add Products'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbum;