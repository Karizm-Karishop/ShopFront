import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../Redux/store";
import { updateBook } from "../../../../Redux/Slices/Bookslices";
import { uploadUrlToCloudinary } from "../../../../utilis/cloud";
import BeatLoader from "react-spinners/BeatLoader";
import { useAppSelector } from '../../../../Redux/hooks';

interface Book {
  id: number;
  bookName: string;
  bookTitle: string;
  authorFirstName: string;
  authorLastName: string;
  coverImage: string;
  uploadFile: string;
  price: number;
  yearOfPublish: number;
  publishedDate: string;
  pageNumber: number;
  description: string;
}

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookEdit: Book | null;
}

const EditBookModel: React.FC<EditBookModalProps> = ({ 
  isOpen, 
  onClose, 
  bookEdit 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useAppSelector((state: RootState) => state.book);
  const user = useAppSelector((state: RootState) => state.loginIn.user);

  const [bookData, setBookData] = useState({
    id: 0,
    bookName: "",
    bookTitle: "",
    authorFirstName: "",
    authorLastName: "",
    publishedDate: "",
    price: "",
    yearOfPublish: "",
    pageNumber: "",
    description: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [documentPreview, setDocumentPreview] = useState<string>("");

  // Populate form when book is selected for editing
  useEffect(() => {
    if (bookEdit) {
      setBookData({
        id: bookEdit.id,
        bookName: bookEdit.bookName,
        bookTitle: bookEdit.bookTitle,
        authorFirstName: bookEdit.authorFirstName,
        authorLastName: bookEdit.authorLastName,
        publishedDate: bookEdit.publishedDate,
        price: bookEdit.price.toString(),
        yearOfPublish: bookEdit.yearOfPublish.toString(),
        pageNumber: bookEdit.pageNumber.toString(),
        description: bookEdit.description,
      });
      setCoverImagePreview(bookEdit.coverImage || "");
      setDocumentPreview(bookEdit.uploadFile || "");
    }
  }, [bookEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'document') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === 'cover') {
        setCoverImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
      } else {
        setUploadFile(file);
        setDocumentPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.user_id) {
      alert("User information is missing. Please log in again.");
      return;
    }

    try {
      let coverImageUrl = coverImagePreview;
      if (coverImage) {
        coverImageUrl = await uploadUrlToCloudinary(coverImage);
      }

      let documentUrl = documentPreview;
      if (uploadFile) {
        documentUrl = await uploadUrlToCloudinary(uploadFile);
      }

      const submissionData = {
        id: bookData.id,
        bookName: bookData.bookName,
        bookTitle: bookData.bookTitle,
        authorFirstName: bookData.authorFirstName,
        authorLastName: bookData.authorLastName,
        publishedDate: bookData.publishedDate,
        coverImage: coverImageUrl,
        uploadFile: documentUrl,
        price: parseFloat(bookData.price),
        yearOfPublish: parseInt(bookData.yearOfPublish),
        pageNumber: parseInt(bookData.pageNumber),
        description: bookData.description,
        artist_id: user.user_id,
      };

      await dispatch(updateBook(submissionData));
      onClose();
    } catch (uploadError) {
      console.error("Error uploading files or updating book:", uploadError);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Book</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Name */}
            <div>
              <label className="block mb-2">Book Name</label>
              <input
                type="text"
                name="bookName"
                value={bookData.bookName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Book Title */}
            <div>
              <label className="block mb-2">Book Title</label>
              <input
                type="text"
                name="bookTitle"
                value={bookData.bookTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Author First Name */}
            <div>
              <label className="block mb-2">Author First Name</label>
              <input
                type="text"
                name="authorFirstName"
                value={bookData.authorFirstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Author Last Name */}
            <div>
              <label className="block mb-2">Author Last Name</label>
              <input
                type="text"
                name="authorLastName"
                value={bookData.authorLastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block mb-2">Cover Image</label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'cover')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {coverImagePreview && (
                <img 
                  src={coverImagePreview} 
                  alt="Cover Preview" 
                  className="mt-2 h-20 w-20 object-cover rounded"
                />
              )}
            </div>

            {/* Document Upload */}
            <div>
              <label className="block mb-2">Upload Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'document')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {documentPreview && (
                <a 
                  href={documentPreview} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-2 text-blue-500 hover:underline block"
                >
                  View Current Document
                </a>
              )}
            </div>

            {/* Published Date */}
            <div>
              <label className="block mb-2">Published Date</label>
              <input
                type="date"
                name="publishedDate"
                value={bookData.publishedDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={bookData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
                step="0.01"
              />
            </div>

            {/* Year of Publish */}
            <div>
              <label className="block mb-2">Year of Publish</label>
              <input
                type="number"
                name="yearOfPublish"
                value={bookData.yearOfPublish}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Page Number */}
            <div>
              <label className="block mb-2">Page Number</label>
              <input
                type="number"
                name="pageNumber"
                value={bookData.pageNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={bookData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                rows={5}
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C4A93] text-white px-20 py-2 rounded-lg hover:bg-[#1C4A93] flex items-center justify-center"
            >
              {loading ? (
                <BeatLoader color="white" size={10} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModel;