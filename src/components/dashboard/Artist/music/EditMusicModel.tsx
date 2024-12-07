import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../../Redux/hooks';
import { fetchArtistTracks, updateTrack } from '../../../../Redux/Slices/TrackSlices';
import { IoClose, IoCloudUpload } from 'react-icons/io5';
import { uploadUrlToCloudinary } from '../../../../utilis/cloud';
import { useAppSelector } from '../../../../Redux/hooks';
import { RootState } from '../../../../Redux/store';

interface Music {
  id: number;
  title: string;
  artist: string;
  genre: string;
  release_date: string;
  media_url?: string;
  description?: string;
}

interface EditTrackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  musicToEdit: Music | null;
}

const EditTrackPopup: React.FC<EditTrackPopupProps> = ({ 
    isOpen, 
    onClose, 
    musicToEdit 
  }) => { 
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const [formData, setFormData] = useState<Partial<Music>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);

  useEffect(() => {
    if (musicToEdit) {
      setFormData({
        id: musicToEdit.id,
        title: musicToEdit.title,
        artist: musicToEdit.artist,
        genre: musicToEdit.genre,
        release_date: musicToEdit.release_date,
        description: musicToEdit.description,
        media_url: musicToEdit.media_url
      });
      setCloudinaryUrl(musicToEdit.media_url || null);
    }
  }, [musicToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadUrlToCloudinary(file);
        setCloudinaryUrl(uploadedUrl);
        setFormData(prev => ({
          ...prev,
          media_url: uploadedUrl
        }));
      } catch (error) {
        console.error('File upload failed', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.id) {
      try {
        // Use cloudinaryUrl if available, otherwise fall back to existing media_url
        const mediaUrlToSubmit = cloudinaryUrl || formData.media_url;

        await dispatch(updateTrack({
          id: formData.id,
          title: formData.title,
          artist: formData.artist,
          genre: formData.genre,
          release_date: formData.release_date,
          description: formData.description,
          media_url: mediaUrlToSubmit
        })).unwrap();
        
        if (user?.user_id) {
          dispatch(fetchArtistTracks(user.user_id));
        }
        
        onClose();
      } catch (error) {
        console.error('Failed to update track', error);
      }
    }
  };

  if (!isOpen) return null;

  const renderMediaPreview = () => {
    const previewUrl = cloudinaryUrl || formData.media_url;
    if (!previewUrl) return null;

    const isAudio = previewUrl.toLowerCase().match(/\.(mp3|wav|ogg|m4a)$/);
    const isVideo = previewUrl.toLowerCase().match(/\.(mp4|avi|mov|wmv)$/);

    if (isAudio) {
      return (
        <audio 
          controls 
          src={previewUrl} 
          className="w-full mt-2"
        >
          Your browser does not support the audio element.
        </audio>
      );
    }

    if (isVideo) {
      return (
        <video 
          controls 
          src={previewUrl} 
          className="w-full mt-2"
        >
          Your browser does not support the video element.
        </video>
      );
    }

    return (
      <img 
        src={previewUrl} 
        alt="Media Preview" 
        className="w-full h-48 object-cover mt-2 rounded"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Track</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Track Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C4A93] focus:ring focus:ring-[#1C4A93]/50"
              required
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
              Artist
            </label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C4A93] focus:ring focus:ring-[#1C4A93]/50"
              required
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C4A93] focus:ring focus:ring-[#1C4A93]/50"
              required
            />
          </div>

          <div>
            <label htmlFor="release_date" className="block text-sm font-medium text-gray-700">
              Release Date
            </label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              value={formData.release_date || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C4A93] focus:ring focus:ring-[#1C4A93]/50"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C4A93] focus:ring focus:ring-[#1C4A93]/50"
            />
          </div>

          <div>
            <label htmlFor="media_url" className="block text-sm font-medium text-gray-700">
              Media URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                id="media_url"
                name="media_url"
                value={formData.media_url || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1C4A93] focus:ring focus:ring-[#1C4A93]/50"
              />
              <label className="mt-1">
                <input
                  type="file"
                  accept="audio/*,video/*,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span 
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1C4A93] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C4A93] ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <IoCloudUpload className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </span>
              </label>
            </div>
          </div>

          {renderMediaPreview()}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1C4A93] text-white rounded-md hover:bg-[#2563eb]"
            >
              Update Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTrackPopup;