import { useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

interface Music {
  id: number;
  musicName: string;
  albumName: string;
  artistFirstName: string;
  artistLastName: string;
  releaseDate: string;
  uploadMusicFile: string | null;
  uploadVideoFile: string | null;
  description: string;
  price: number;
  genre: string;
  duration: string;
}

const musicList: Music[] = [
  {
    id: 1,
    musicName: "Song of Hope",
    albumName: "Hope Album",
    artistFirstName: "John",
    artistLastName: "Doe",
    releaseDate: "2024-06-01",
    uploadMusicFile: "https://example.com/music1.mp3",
    uploadVideoFile: "https://example.com/video1.mp4",
    description: "A hopeful and uplifting song",
    price: 9.99,
    genre: "Pop",
    duration: "3:45",
  },
  {
    id: 2,
    musicName: "Echoes of Love",
    albumName: "Heartbeats",
    artistFirstName: "Emily",
    artistLastName: "Smith",
    releaseDate: "2023-11-15",
    uploadMusicFile: "https://example.com/music2.mp3",
    uploadVideoFile: "https://example.com/video2.mp4",
    description: "A soulful ballad about love",
    price: 12.99,
    genre: "R&B",
    duration: "4:10",
  }
];

const AllMusicTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const musicPerPage = 5;

  const filteredMusic = musicList.filter(
    (music) =>
      music.musicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.albumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${music.artistFirstName} ${music.artistLastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastMusic = currentPage * musicPerPage;
  const indexOfFirstMusic = indexOfLastMusic - musicPerPage;
  const currentMusic = filteredMusic.slice(indexOfFirstMusic, indexOfLastMusic);
  const totalPages = Math.ceil(filteredMusic.length / musicPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="mx-auto p-6 font-mono w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Music</h2>

      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg pr-10"
          placeholder="Search music by name, album, or artist..."
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
                <th className="px-4 py-3">Music Name</th>
                <th className="px-4 py-3">Album Name</th>
                <th className="px-4 py-3">Artist</th>
                <th className="px-4 py-3">View Track</th>

                <th className="px-4 py-3">Release Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentMusic.length > 0 ? (
                currentMusic.map((music) => (
                  <tr className="text-gray-700" key={music.id}>
                    <td className="px-4 py-3 border-b">{music.id}</td>
                    <td className="px-4 py-3 border-b">{music.musicName}</td>
                    <td className="px-4 py-3 border-b">{music.albumName}</td>
                    <td className="px-4 py-3 border-b">
                      {music.artistFirstName} {music.artistLastName}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {music.uploadMusicFile && (
                        <a
                          href={music.uploadMusicFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1C4A93] hover:underline"
                        >
                          View Track
                        </a>
                      )}
                    </td>

                    <td className="px-4 py-3 border-b">{music.releaseDate}</td>
                    <td className="px-4 py-3 border-b">${music.price}</td>
                    <td className="px-4 py-3 border-b">{music.genre}</td>
                    <td className="px-4 py-3 border-b">{music.duration}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-2">
                        <button className="text-[#1C4A93] hover:text-[#537ec5]">
                          <MdModeEdit size={20} />
                        </button>
                        <button className="text-red hover:text-red-700">
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-center" colSpan={9}>
                    No music found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end space-x-1">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 ${
              currentPage === index + 1
                ? "bg-[#1C4A93] text-white outline-none"
                : "bg-gray-200 text-gray-700 outline-none"
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default AllMusicTable;
