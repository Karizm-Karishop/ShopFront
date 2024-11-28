import axios, { AxiosError } from 'axios';
import { showErrorToast } from '../utilis/ToastProps';

export interface MediaFile extends File {
  preview?: string;
  title?: string;
  artist?: string;
  genre?: string;
  duration?: string;
  releaseDate?: string;
  description?: string;
  albumName?: string;
  uploadedUrl?: string;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadUrlToCloudinary = async (file: File): Promise<string> => {
    console.log('Uploading file:', file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      const secureUrl = response.data.secure_url;
    //   console.log('Upload successful. Secure URL:', secureUrl);
    //   showSuccessToast(`File uploaded successfully!`);
      return secureUrl;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      if (error instanceof AxiosError) {
        showErrorToast(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
      } else {
        showErrorToast('Upload failed due to an unexpected error.');
      }
      return '';
    }
  };


  export const uploadSingleImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      } else {
        throw error;
      }
    }
  };
  
  export const uploadGalleryImages = async (files: File[]): Promise<string[]> => {
    const promises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
          formData
        );
        return response.data.secure_url;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw error;
        } else {
          throw error;
        }
      }
    });
  
    const imageUrls = await Promise.all(promises);
    return imageUrls;
  };
  
  