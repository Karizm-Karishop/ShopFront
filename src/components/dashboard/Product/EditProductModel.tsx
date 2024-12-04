/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React, { useState, ChangeEvent } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { X, ImagePlus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../../Redux/hooks';
import { updateProduct } from '../../../Redux/Slices/addProductSlice';
import { uploadSingleImage, uploadGalleryImages } from '../../../utilis/cloud';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface Product {
  product_id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  product_image: string;
  gallery: string[];
  sales_price: string;
  regular_price: string;
  quantity: number;
  isAvailable: boolean;
  tags: string[];
}

interface FormValues {
  name: string;
  shortDesc: string;
  longDesc: string;
  product_image: string;
  gallery: string[];
  sales_price: string;
  regular_price: string;
  quantity: number;
  isAvailable: boolean;
  tags: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  const dispatch = useAppDispatch();
  const [localImage, setLocalImage] = useState<string | null>(product.product_image);
  const [localGallery, setLocalGallery] = useState<string[]>(product.gallery);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    shortDesc: Yup.string().required('Short description is required'),
    longDesc: Yup.string().required('Long description is required'),
    sales_price: Yup.number()
      .positive('Sales price must be positive')
      .required('Sales price is required'),
    regular_price: Yup.number()
      .positive('Regular price must be positive')
      .required('Regular price is required'),
    quantity: Yup.number()
      .integer('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative')
      .required('Quantity is required'),
    tags: Yup.string(),
  });

  // Image Handlers
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = await uploadSingleImage(e.target.files[0]);
      setLocalImage(imageUrl);
    }
  };

  const handleGalleryImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = await uploadGalleryImages(Array.from(e.target.files));
      setLocalGallery((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setLocalGallery((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  // Form Submit Handler
  const handleSubmit = async (values: FormValues) => {
    const tagsArray = values.tags 
      ? values.tags.split(',').map(tag => tag.trim())
      : [];

    const updatedProductData = {
      ...values,
      product_image: localImage || '',
      gallery: localGallery,
      tags: tagsArray,
    };

    try {
      await dispatch(updateProduct({
        productId: product.product_id, 
        productData: updatedProductData
      })).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update product', error);
    }
  };

  // Prevent modal from closing when clicking inside
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{
            name: product.name,
            shortDesc: product.shortDesc,
            longDesc: product.longDesc,
            product_image: product.product_image,
            gallery: product.gallery,
            sales_price: product.sales_price,
            regular_price: product.regular_price,
            quantity: product.quantity,
            isAvailable: product.isAvailable,
            tags: product.tags.join(', ')
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage 
                    name="name" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <Field
                    type="text"
                    name="shortDesc"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage 
                    name="shortDesc" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                {/* Long Description */}
                <div className="md:col-span-2">
                  <label htmlFor="longDesc" className="block text-sm font-medium text-gray-700">
                    Long Description
                  </label>
                  <Field
                    as="textarea"
                    name="longDesc"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage 
                    name="longDesc" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                {/* Pricing and Quantity */}
                <div>
                  <label htmlFor="regular_price" className="block text-sm font-medium text-gray-700">
                    Regular Price
                  </label>
                  <Field
                    type="number"
                    name="regular_price"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage 
                    name="regular_price" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <label htmlFor="sales_price" className="block text-sm font-medium text-gray-700">
                    Sales Price
                  </label>
                  <Field
                    type="number"
                    name="sales_price"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage 
                    name="sales_price" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <Field
                    type="number"
                    name="quantity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <ErrorMessage 
                    name="quantity" 
                    component="div" 
                    className="text-red-500 text-sm mt-1" 
                  />
                </div>

                {/* Availability */}
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="isAvailable"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                    Is Product Available?
                  </label>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags (Comma Separated)
                  </label>
                  <Field
                    type="text"
                    name="tags"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                {/* Product Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    {localImage ? (
                      <div className="relative">
                        <img 
                          src={localImage} 
                          alt="Product" 
                          className="h-32 w-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setLocalImage(null)}
                          className="absolute top-0 right-0 bg-red text-white rounded-full p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                          <ImagePlus className="h-8 w-8 text-gray-400" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {localGallery.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`} 
                          className="h-32 w-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-0 right-0 bg-red text-white rounded-full p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="cursor-pointer">
                      <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#1C4A93] text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProductModal;