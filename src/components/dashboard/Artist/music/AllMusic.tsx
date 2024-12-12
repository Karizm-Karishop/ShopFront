import  { useState, useEffect } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../../Redux/hooks";
import { RootState } from "../../../../Redux/store";
import { fetchArtistTracks,deleteTrack } from "../../../../Redux/Slices/TrackSlices"; // Adjust import path as needed
import BeatLoader from "react-spinners/BeatLoader";
import ConfirmationCard from "../../../ConfirmationPage/ConfirmationCard";
import EditMusicModal from './EditMusicModel'
interface Music {
  id: number;
  title: string;
  artist: string;
  genre: string;
  release_date: string;
  media_url?: string;
  description?: string;
  price?: number;
  duration?: string;
}

const AllMusicTable = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const { tracks, loading, error } = useAppSelector((state: RootState) => state.tracks);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const musicPerPage = 5;
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const [currentMusicId, setCurrentMusicId] = useState<number | null>(null);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchArtistTracks(user.user_id));
    }
  }, [dispatch, user?.user_id]);

  const musicList: Music[] = tracks.map((track) => ({
    id: track.id || track.track_id || 0,
    title: track.title,
    artist: track.artist,
    genre: track.genre,
    release_date: track.release_date,
    media_url: track.media_url,
    description: track.description,
  }));

  const filteredMusic = musicList.filter(
    (music) =>
      music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      music.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMusic = currentPage * musicPerPage;
  const indexOfFirstMusic = indexOfLastMusic - musicPerPage;
  const currentMusic = filteredMusic.slice(indexOfFirstMusic, indexOfLastMusic);
  const totalPages = Math.ceil(filteredMusic.length / musicPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleDeleteClick = (id: number) => {
    setCurrentMusicId(id);
    setModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentMusicId !== null) {
      await dispatch(deleteTrack(currentMusicId));
      if (user?.user_id) {
        dispatch(fetchArtistTracks(user.user_id)); 
      }
    }
    setModalVisible(false);
    setCurrentMusicId(null);
  };
  
  const handleDeleteCancel = () => {
    setModalVisible(false);
    setCurrentMusicId(null);
  };
  const handleEdit = (music: Music) => {
    setSelectedMusic(music);
    setIsEditModalOpen(true);
  };
  if (loading) {
    return <BeatLoader className="text-center py-4"/>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mx-auto p-6 font-mono w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Tracks</h2>

      <div className="relative mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg pr-10"
          placeholder="Search tracks by name, artist, or genre..."
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
                <th className="px-4 py-3">Track Name</th>
                <th className="px-4 py-3">Artist</th>
                <th className="px-4 py-3">Genre</th>
                <th className="px-4 py-3">View Track</th>
                <th className="px-4 py-3">Release Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentMusic.length > 0 ? (
                currentMusic.map((music) => (
                  <tr className="text-gray-700" key={music.id}>
                    <td className="px-4 py-3 border-b">{music.id}</td>
                    <td className="px-4 py-3 border-b">{music.title}</td>
                    <td className="px-4 py-3 border-b">{music.artist}</td>
                    <td className="px-4 py-3 border-b">{music.genre}</td>
                    <td className="px-4 py-3 border-b">
                      {music.media_url && (
                        <a
                          href={music.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1C4A93] hover:underline"
                        >
                          View Track
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b">{music.release_date}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-2">
                        <button className="text-[#1C4A93] hover:text-[#537ec5]"
                           onClick={() => handleEdit(music)}
                        >
                          <MdModeEdit size={20} />
                        </button>
                        <button 
                        onClick={() => handleDeleteClick(music.id)}
                         className="text-red hover:text-red-700">
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-center" colSpan={7}>
                    No tracks found.
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
      <ConfirmationCard
        isVisible={isConfirmationModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this Music?"
      />
      <EditMusicModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        musicToEdit={selectedMusic}
      />
    </div>
    
  );
};

export default AllMusicTable;
