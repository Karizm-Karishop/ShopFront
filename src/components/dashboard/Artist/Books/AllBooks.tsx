/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import EditBooksModal from "./EditBookModel";
import { RootState, AppDispatch } from "../../../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook, fetchAllbooks } from "../../../../Redux/Slices/Bookslices";
import ConfirmationCard from "../../../ConfirmationPage/ConfirmationCard";
import BeatLoader from "react-spinners/BeatLoader";

interface Book {
  id: number;
  bookName: string;
  bookTitle: string;
  authorFirstName: string;
  authorLastName: string;
  coverImage: string;
  document: string;
  price: number;
  yearOfPublish: number;
  publishedDate: string;
}

const AllBooks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const booksPerPage = 5;
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);

  const { books = [], loading } = useSelector((state: RootState) => state.book);

  useEffect(() => {
    dispatch(fetchAllbooks());
  }, [dispatch]);

  const filteredBooks = books.filter(
    (book) =>
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${book.authorFirstName} ${book.authorLastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCurrentBookId(id);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (currentBookId !== null) {
      dispatch(deleteBook(currentBookId));
    }
    setModalVisible(false);
    setCurrentBookId(null);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
    setCurrentBookId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <BeatLoader/>
      </div>
    );
  }

  return (
    <section className="mx-auto p-6 font-mono w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Books</h2>

      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg pr-10"
          placeholder="Search books by name, author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoIosSearch className="absolute text-[25px] right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-gray-900 bg-gray-100 uppercase border-b border-gray-200">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Cover Image</th>
                <th className="px-4 py-3">Book Name</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Year of Publish</th>
                <th className="px-4 py-3">Published Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentBooks.length > 0 ? (
                currentBooks.map((book) => (
                  <tr className="text-gray-700" key={indexOfFirstBook.id}>
                    <td className="px-4 py-3 border-b">{book.id}</td>
                    <td className="px-4 py-3 border-b">
                      <img
                        src={
                          book.coverImage || "https://via.placeholder.com/50"
                        }
                        alt={`${book.bookName} Cover`}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-3 border-b">{book.bookName}</td>
                    <td className="px-4 py-3 border-b">{`${book.authorFirstName} ${book.authorLastName}`}</td>
                    <td className="px-4 py-3 border-b">
                      <a
                        href={book.uploadFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Document
                      </a>
                    </td>
                    <td className="px-4 py-3 border-b">${book.price}</td>
                    <td className="px-4 py-3 border-b">{book.yearOfPublish}</td>

                    <td className="px-4 py-3 border-b">
                      {book.publishedDate || "N/A"}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue hover:text-blue-700 text-lg cursor-pointer"
                          onClick={() => handleEditClick(book)}
                        >
                          <MdModeEdit />
                        </button>
                        <button
                          className="text-red hover:text-red-700 text-lg cursor-pointer"
                          onClick={() => handleDeleteClick(book.id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 border-b text-center" colSpan={10}>
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-600">
            Showing {indexOfFirstBook + 1} to{" "}
            {Math.min(indexOfLastBook, filteredBooks.length)} of{" "}
            {filteredBooks.length} books
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded-md outline-none ${
                  currentPage === index + 1
                    ? "bg-[#1C4A93] text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-[#1C4A93] hover:text-white"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <ConfirmationCard
          isVisible={isConfirmationModalVisible}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          message="Are you sure you want to delete this Book?"
        />

        <EditBooksModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          bookEdit={selectedBook}
        />
      </div>
    </section>
  );
};

export default AllBooks;
