import React, { useState } from "react";
import { Upload, Music, Video, X } from "lucide-react";
import { Switch } from "@mui/material";
import { useLocation } from "react-router-dom";

interface MediaFile extends File {
  preview?: string;
  title?: string;
  artist?: string;
  genre?: string;
  duration?: string;
  releaseDate?: string;
  description?: string;
  albumName?: string; 
}

interface MusicPageProps {
  existingAlbums?: string[]; 
}

const MusicPage: React.FC<MusicPageProps> = ({ existingAlbums = [] }) => { // Provide a default empty array
  const location = useLocation();

  const [isMultipleUpload, setIsMultipleUpload] = useState(false);
  const [mediaType, setMediaType] = useState<"audio" | "video">("audio");
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);

  const albumData = location.state?.albumData || {
    title: 'Default Album',
    id: 'dummy-album-id'
  };
  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
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
      const files = Array.from(e.target.files) as MediaFile[];

      if (!isMultipleUpload && files.length > 1) {
        alert("Please select only one file in single upload mode");
        e.target.value = "";
        return;
      }

      const newFiles = files.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
        title: file.name.split('.')[0],
        artist: "",
        genre: "",
        description: "",
        releaseDate: new Date().toISOString().split("T")[0],
        albumName: selectedAlbum || albumData.title 
      }));

      setSelectedFiles((prevFiles) => {
        if (!isMultipleUpload) {
          return [newFiles[0]];
        }
        return [...prevFiles, ...newFiles];
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Complete Album Data:", {
      albumDetails: albumData,
      musicFiles: selectedFiles,
      mediaType,
      isMultipleUpload
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-5">Create Music and add it to an album</h1>

          <select
            value={selectedAlbum} 
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedAlbum(selectedValue);
              setSelectedFiles(prevFiles => 
                prevFiles.map(file => ({
                  ...file,
                  albumName: selectedValue
                }))
              );
            }}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1C4A93] w-full mb-5"
          >
            <option value="">Select Album</option>
            {existingAlbums.map((albumName) => (
              <option key={albumName} value={albumName}>{albumName}</option>
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

            {/* Selected Files List */}
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
                            updateFileMetadata(index, "description", e.target.value)
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#1C4A93] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue"
            >
              Create Music
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;