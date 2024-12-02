/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Trash2,
  MoreHorizontal,
  Music,
  Video,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../UI/Card";
import { MdModeEdit } from "react-icons/md";
import { RootState, AppDispatch } from "../../../../Redux/store";
import {  useAppSelector } from "../../../../Redux/hooks";

import {
  fetchAllAlbums,
  deleteAlbum,
} from "../../../../Redux/Slices/AblumSlices";
import ConfirmationCard from "../../../ConfirmationPage/ConfirmationCard";
import EditAlbumModal from "./EditAlbumModal";
interface Album {
  id: number;
  album_title: string;
  description?: string;
  cover_image?: string;
  artist?: string;
  created_at: Date;
  updated_at: Date;
  tracks?: any[];
  audioCount?: number;
  videoCount?: number;
  totalDownloads?: number;
}

const AllAlbums = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { albums = [], loading, totalAlbums } = useSelector(
    (state: RootState) => state.album
  );
  const user = useAppSelector((state: RootState) => state.loginIn.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Album | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const albumsPerPage = 5;


  useEffect(() => {
    if (user?.user_id) {
      dispatch(fetchAllAlbums(user.user_id));
    }
  }, [dispatch, user?.user_id]);

  const totalAudio = Array.isArray(albums) 
    ? albums.reduce((sum, album) => sum + (album.tracks?.length || 0), 0)
    : 0;
  const totalVideo = 0;
  const totalDownloads = Array.isArray(albums)
    ? albums.reduce((sum, album) => sum + (album.totalDownloads || 0), 0)
    : 0;

  const filteredAlbums = (Array.isArray(albums) ? albums : []).filter(
    (album) =>
      album.album_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (album.description &&
        album.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const currentAlbums = sortedAlbums.slice(
    (currentPage - 1) * albumsPerPage,
    currentPage * albumsPerPage
  );

  const totalPages = Math.ceil(sortedAlbums.length / albumsPerPage);

  const handleSort = (key: keyof Album) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleEdit = (album: Album) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setCurrentAlbumId(id);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (currentAlbumId !== null) {
      dispatch(deleteAlbum(currentAlbumId));
    }
    setModalVisible(false);
    setCurrentAlbumId(null);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
    setCurrentAlbumId(null);
  };

  const SortIcon = ({ column }: { column: keyof Album }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center">
        <BeatLoader />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1C4A93] flex flex-col justify-center items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-10">
            <CardTitle className="text-sm font-medium text-white">
              Total Albums
            </CardTitle>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAlbums}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C4A93] flex flex-col justify-center items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-10">
            <CardTitle className="text-sm font-medium text-white">
              Total Audio
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAudio}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C4A93] flex flex-col justify-center items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-10">
            <CardTitle className="text-sm font-medium text-white">
              Total Video
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalVideo}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1C4A93] flex flex-col justify-center items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-10">
            <CardTitle className="text-sm font-medium text-white">
              Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalDownloads}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Albums Library</h2>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cover
              </th>
              <th
                onClick={() => handleSort("album_title")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Album Title
                  <SortIcon column="album_title" />
                </div>
              </th>
              <th
                onClick={() => handleSort("description")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Description
                  <SortIcon column="description" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracks
              </th>
              <th
                onClick={() => handleSort("created_at")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Created At
                  <SortIcon column="created_at" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAlbums.map((album) => (
              <tr key={album.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={album.cover_image || "/default-album-cover.png"}
                    alt={album.album_title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {album.album_title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {album.description || "No description"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Music className="w-4 h-4 text-blue-500" />
                      {album.tracks?.length || 0}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(album.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(album)}
                      className="p-1 text-[#1C4A93] hover:text-blue-800 hover:bg-blue-50 rounded-full outline-none"
                      title="Edit album"
                    >
                      <MdModeEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(album.id)}
                      className="p-1 text-red hover:text-red-800 hover:bg-red-50 rounded-full outline-none"
                      title="Delete album"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === i + 1
                ? "bg-[#1C4A93] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ConfirmationCard
        isVisible={isConfirmationModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this album?"
      />
      <EditAlbumModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        albumToEdit={selectedAlbum}
      />
    </div>
  );
};

export default AllAlbums;