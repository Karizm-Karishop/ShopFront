import React, { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  setTitle, 
  setDescription, 
  setCoverImage,
  updateAlbum, 
  Album
} from '../../../../Redux/Slices/AblumSlices';
import { RootState, AppDispatch } from '../../../../Redux/store';

interface EditAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumToEdit: Album | null;
}

const EditAlbumModal: React.FC<EditAlbumModalProps> = ({ 
  isOpen, 
  onClose, 
  albumToEdit 
}) => {
  const [coverPreview, setCoverPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { title, description, coverImage, loading, error } = useSelector(
    (state: RootState) => state.album
  );

  useEffect(() => {
    if (albumToEdit) {
      dispatch(setTitle(albumToEdit.album_title));
      dispatch(setDescription(albumToEdit.description || ''));
      setCoverPreview(albumToEdit.cover_image || '');
    }
  }, [albumToEdit]);

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
    
    if (albumToEdit) {
      const result = await dispatch(updateAlbum({
        id: albumToEdit.id,
        title,
        description,
        coverImage
      }));

      if (updateAlbum.fulfilled.match(result)) {
        onClose();
      }
    }
  };

  const handleRemoveCoverImage = () => {
    dispatch(setCoverImage(null));
    setCoverPreview("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Album</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1C4A93] hover:bg-blue-700'}`}
          >
            {loading ? 'Updating album...' : 'Update Album'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAlbumModal;