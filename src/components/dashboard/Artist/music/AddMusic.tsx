import React, { useState, useEffect } from "react";
import { Upload, Music, Video, X } from "lucide-react";
import { Switch } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../Redux/store";
import {
  createTracks,
  setCurrentAlbumId,
} from "../../../../Redux/Slices/TrackSlices";
import { uploadUrlToCloudinary } from "../../../../utilis/cloud"; // Adjust path if necessary
import BeatLoader from "react-spinners/BeatLoader";
interface Ialbum {
  id: number;
  album_title: string;
}

interface MediaFile {
  originalFile: File;
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

interface MusicPageProps {
  existingAlbums?: string[];
}

const MusicPage: React.FC<MusicPageProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.tracks);
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();

  const [isMultipleUpload, setIsMultipleUpload] = useState(false);
  const [mediaType, setMediaType] = useState<"audio" | "video">("audio");
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Ialbum | null>(null);
  const [albums, setAlbums] = useState<Ialbum[]>([]);

  const albumData = location.state?.albumData || {
    title: "Default Album",
    id: "dummy-album-id",
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/albums/`)
      .then((response) => {
        setAlbums(response.data.data);
      })
      .catch((err) => console.error("Error fetching albums:", err));
  }, []);

  const handleMultipleUploadToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.checked;
    setIsMultipleUpload(newValue);

    if (!newValue && selectedFiles.length > 1) {
      setSelectedFiles([]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (!isMultipleUpload && files.length > 1) {
        alert("Please select only one file in single upload mode");
        e.target.value = "";
        return;
      }

      const newFiles = files.map((file) => ({
        originalFile: file,
        preview: URL.createObjectURL(file),
        title: file.name.split(".")[0],
        artist: "",
        genre: "",
        description: "",
        releaseDate: new Date().toISOString().split("T")[0],
        albumName: selectedAlbum?.album_title || albumData.title,
        uploadedUrl: "",
      }));

      setSelectedFiles((prevFiles) =>
        isMultipleUpload ? [...prevFiles, ...newFiles] : newFiles
      );
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  const updateFileMetadata = (index: number, field: string, value: string) => {
    setSelectedFiles((files) =>
      files.map((file, i) => (i === index ? { ...file, [field]: value } : file))
    );
  };

  const clearForm = () => {
    setSelectedFiles([]); 
    setMediaType("audio"); 
    setSelectedAlbum(null);
    setIsMultipleUpload(false); 
    // Reset multiple upload mode
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAlbum) {
      alert("Please select an album");
      return;
    }
    setIsUploading(true); 

    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (!file.originalFile) {
            console.error("Invalid file object:", file);
            return null;
          }

          const uploadedUrl = await uploadUrlToCloudinary(file.originalFile);
          if (uploadedUrl) {
            return {
              title: file.title || "",
              artist: file.artist || "",
              genre: file.genre || "",
              release_date:
                file.releaseDate || new Date().toISOString().split("T")[0],
              description: file.description || "",
              file: uploadedUrl,
            };
          }
          return null;
        })
      );

      const validTracks = uploadedFiles.filter((file) => file !== null);

      if (validTracks.length > 0) {
        await dispatch(
          createTracks({
            album_id: selectedAlbum.id,
            tracks: validTracks,
          })
        );
      } else {
        alert("No files were successfully uploaded.");
      }
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setIsUploading(false);
      clearForm();
    }
  };

  const handleAlbumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selected = albums.find((album) => album.id === selectedId) || null;
    setSelectedAlbum(selected);

    if (selected) {
      dispatch(setCurrentAlbumId(selected.id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-5">
            Create Music and add it to an album
          </h1>

          <select
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93] w-full mb-5"
            onChange={handleAlbumChange}
            value={selectedAlbum?.id || ""}
          >
            <option value="">Select Album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.album_title}
              </option>
            ))}
          </select>

          <p className="text-gray-600 mb-6">
            Upload your {mediaType} files for {albumData.title}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Switch to Single or multiple
                </label>
                <div className="relative flex w-20 mr-2 select-none outline-none items-center flex-row justify-center rounded-full shadow-md bg-[#c9cdd4]">
                  <Switch
                    checked={isMultipleUpload}
                    onChange={handleMultipleUploadToggle}
                    color="default"
                    classes={{
                      switchBase: "p-1",
                      checked: "translate-x-6 bg-[#1890ff]",
                      track: "bg-transparent",
                    }}
                    icon={<span className="w-5 h-5 rounded-full bg-white" />}
                    checkedIcon={
                      <span className="w-5 h-5 rounded-full bg-white" />
                    }
                  />
                </div>
                <div className="text-gray-500 mt-1 font-bold text-[14px]">
                  Mode: {isMultipleUpload ? "Multiple" : "Single"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media Type
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      value="audio"
                      checked={mediaType === "audio"}
                      onChange={(e) =>
                        setMediaType(e.target.value as "audio" | "video")
                      }
                    />
                    <span className="ml-2">Audio</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      value="video"
                      checked={mediaType === "video"}
                      onChange={(e) =>
                        setMediaType(e.target.value as "audio" | "video")
                      }
                    />
                    <span className="ml-2">Video</span>
                  </label>
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
              <input
                type="file"
                accept={mediaType === "audio" ? "audio/*" : "video/*"}
                multiple={isMultipleUpload}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-4 cursor-pointer"
              >
                <Upload size={40} className="text-gray-400" />
                <div className="text-sm text-gray-600">
                  Drag and drop your files here or click to browse
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-white text-gray-700 rounded-md border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1C4A93]"
                >
                  Select {mediaType} files
                </button>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selected Files</h3>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {mediaType === "audio" ? (
                          <Music size={40} className="text-[#1C4A93]" />
                        ) : (
                          <Video size={40} className="text-[#1C4A93]" />
                        )}
                      </div>
                      <div className="flex-grow space-y-3">
                        <input
                          type="text"
                          placeholder="Track title"
                          value={file.title}
                          onChange={(e) =>
                            updateFileMetadata(index, "title", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93]"
                        />
                        <textarea
                          placeholder="Track description"
                          value={file.description}
                          onChange={(e) =>
                            updateFileMetadata(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93]"
                        />
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder="Artist"
                            value={file.artist}
                            onChange={(e) =>
                              updateFileMetadata(
                                index,
                                "artist",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93]"
                          />
                          <select
                            value={file.genre}
                            onChange={(e) =>
                              updateFileMetadata(index, "genre", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93]"
                          >
                            <option value="">Select genre</option>
                            <option value="pop">Pop</option>
                            <option value="rock">Rock</option>
                            <option value="jazz">Jazz</option>
                            <option value="classical">Classical</option>
                          </select>
                          <input
                            type="date"
                            value={file.releaseDate}
                            onChange={(e) =>
                              updateFileMetadata(
                                index,
                                "releaseDate",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93]"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-1 text-red hover:bg-red-50 rounded font-bold"
                        onClick={() => removeFile(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="text-center text-blue-500">
                Uploading tracks...
              </div>
            )}
            {error && (
              <div className="text-center text-red-500">Error: {error}</div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading || isUploading}
                aria-label="Submit Form"
                className={`w-full flex justify-center py-2 sm:py-4 ${
                  loading || isUploading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#1C4A93] hover:bg-[#173f7f]"
                } text-white rounded-md text-lg`}
              >
                {isUploading ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  "Create & Upload"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
