import { useState } from "react";
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

interface Album {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  artist: string;
  releaseDate: string;
  audioCount: number;
  videoCount: number;
  totalTracks: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
}

const sampleAlbums: Album[] = [
  {
    id: 1,
    title: "Summer Vibes",
    description: "A collection of summer hits",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Various Artists",
    releaseDate: "2024-01-15",
    audioCount: 12,
    videoCount: 3,
    totalTracks: 15,
    totalViews: 250000,
    totalDownloads: 15000,
    totalShares: 5000,
  },
  {
    id: 2,
    title: "Chill Beats",
    description: "Relax with smooth and mellow tracks",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "DJ Serenity",
    releaseDate: "2023-11-20",
    audioCount: 10,
    videoCount: 2,
    totalTracks: 12,
    totalViews: 180000,
    totalDownloads: 12000,
    totalShares: 3000,
  },
  {
    id: 3,
    title: "Rock Legends",
    description: "Greatest rock hits of all time",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Various Rock Bands",
    releaseDate: "2022-05-01",
    audioCount: 15,
    videoCount: 4,
    totalTracks: 19,
    totalViews: 500000,
    totalDownloads: 30000,
    totalShares: 7000,
  },
  {
    id: 4,
    title: "Jazz Classics",
    description: "Timeless jazz standards",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Jazz Masters",
    releaseDate: "2023-02-10",
    audioCount: 14,
    videoCount: 1,
    totalTracks: 15,
    totalViews: 120000,
    totalDownloads: 9000,
    totalShares: 2000,
  },
  {
    id: 5,
    title: "Hip Hop Essentials",
    description: "Essential hip-hop tracks from the last decade",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Hip Hop Icons",
    releaseDate: "2023-06-05",
    audioCount: 16,
    videoCount: 2,
    totalTracks: 18,
    totalViews: 400000,
    totalDownloads: 27000,
    totalShares: 6000,
  },
  {
    id: 6,
    title: "Indie Favorites",
    description: "Top indie tracks of the year",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Indie Stars",
    releaseDate: "2023-08-17",
    audioCount: 11,
    videoCount: 3,
    totalTracks: 14,
    totalViews: 150000,
    totalDownloads: 8000,
    totalShares: 2500,
  },
  {
    id: 7,
    title: "Electronic Essentials",
    description: "Dance and electronic hits",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Electro Beats",
    releaseDate: "2024-02-10",
    audioCount: 13,
    videoCount: 4,
    totalTracks: 17,
    totalViews: 320000,
    totalDownloads: 22000,
    totalShares: 4500,
  },
  {
    id: 8,
    title: "Country Gold",
    description: "Top country hits",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Country Legends",
    releaseDate: "2023-09-25",
    audioCount: 12,
    videoCount: 2,
    totalTracks: 14,
    totalViews: 100000,
    totalDownloads: 6000,
    totalShares: 1500,
  },
  {
    id: 9,
    title: "Latin Hits",
    description: "Popular Latin tracks",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Latin Stars",
    releaseDate: "2023-03-30",
    audioCount: 14,
    videoCount: 3,
    totalTracks: 17,
    totalViews: 290000,
    totalDownloads: 18000,
    totalShares: 4000,
  },
  {
    id: 10,
    title: "Classical Masterpieces",
    description: "Classical compositions from the greats",
    coverImage:
      "https://m.media-amazon.com/images/I/71HR316PilL.__AC_SX300_SY300_QL70_ML2_.jpg",
    artist: "Orchestra of Classics",
    releaseDate: "2022-11-11",
    audioCount: 10,
    videoCount: 2,
    totalTracks: 12,
    totalViews: 200000,
    totalDownloads: 11000,
    totalShares: 3000,
  },
];

const AllAlbums = () => {
  const [albums] = useState<Album[]>(sampleAlbums);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Album | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const albumsPerPage = 5;

  const totalAlbums = albums.length;
  const totalAudio = albums.reduce((sum, album) => sum + album.audioCount, 0);
  const totalVideo = albums.reduce((sum, album) => sum + album.videoCount, 0);
  const totalDownloads = albums.reduce(
    (sum, album) => sum + album.totalDownloads,
    0
  );

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleEdit = (id: number) => {
    console.log(`Editing album ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting album ${id}`);
  };

  const SortIcon = ({ column }: { column: keyof Album }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Boxes */}
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
                onClick={() => handleSort("title")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Album Title
                  <SortIcon column="title" />
                </div>
              </th>
              <th
                onClick={() => handleSort("artist")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Artist
                  <SortIcon column="artist" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audio/Video
              </th>
              <th
                onClick={() => handleSort("releaseDate")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Release Date
                  <SortIcon column="releaseDate" />
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
                    src={album.coverImage}
                    alt={album.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {album.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {album.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {album.artist}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Music className="w-4 h-4 text-blue-500" />
                      {album.audioCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4 text-red-500" />
                      {album.videoCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(album.releaseDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(album.id)}
                      className="p-1 text-[#1C4A93] hover:text-blue-800 hover:bg-blue-50 rounded-full outline-none"
                      title="Edit album"
                    >
                      <MdModeEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(album.id)}
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

      {/* Pagination */}
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
    </div>
  );
};

export default AllAlbums;
