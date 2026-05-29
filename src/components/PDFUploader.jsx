import React, { useState, useRef } from "react";
import axios from "axios";
/**
 * PDFUploader Component
 *
 * Responsible for:
 * - Single PDF selection (configurable via prop)
 * - Multiple PDF selection
 * - Drag & drop area with visual feedback
 * - Calling upload API (placeholder fetch implementation)
 */
export default function PDFUploader({
  isMultiple = true,
  uploadEndpoint = "http://localhost:5000/api/files/upload",
}) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  // Process incoming files and filter for PDF types only
  const handleFiles = (incomingFiles) => {
    const pdfFiles = Array.from(incomingFiles)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "Pending",
      }));

    if (isMultiple) {
      setFiles((prev) => [...prev, ...pdfFiles]);
    } else {
      setFiles(pdfFiles.slice(0, 1));
    }
  };

  const handleChange = (e) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    if (files.length > 3) {
  alert(
    `Upload in progress — processing ${files.length} files in background`
  );
}

    try {
      const pendingFiles = files.filter((f) => f.status !== "Complete");
      // Execute individual uploads in parallel
      await Promise.all(
        pendingFiles.map((fileObj) => uploadSingleFile(fileObj)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const uploadSingleFile = async (fileObj) => {
    const formData = new FormData();
    formData.append("pdfs", fileObj.file);

    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, status: "Uploading" } : f,
        ),
      );

      await axios.post(uploadEndpoint, formData, {
        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / (event.total || event.loaded),
          );
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id ? { ...f, progress: percent } : f,
            ),
          );
        },
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id ? { ...f, progress: 100, status: "Complete" } : f,
        ),
      );
    } catch (err) {
      console.error("Upload error", err);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileObj.id ? { ...f, status: "Failed" } : f)),
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        PDF Document Upload
      </h1>

      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer
      ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
      }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple={isMultiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="text-5xl">📄</div>

          <p className="text-lg font-semibold text-gray-700">
            Drag & Drop PDF Files Here
          </p>

          <p className="text-gray-500">or click to browse from your computer</p>

          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {isMultiple ? "Multiple PDF Upload Supported" : "Single PDF Upload"}
          </span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-700 mb-3">Selected Files</h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex flex-col bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 mr-4 overflow-hidden">
                    <p className="font-semibold text-gray-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB •
                      <span
                        className={`ml-1 font-bold ${file.status === "Complete" ? "text-green-600" : file.status === "Failed" ? "text-red-600" : "text-blue-600"}`}
                      >
                        {file.status}
                      </span>
                    </p>
                  </div>

                  <button
                    disabled={isUploading && file.status === "Uploading"}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${file.status === "Failed" ? "bg-red-500" : "bg-blue-600"}`}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={isUploading}
            onClick={onUpload}
            className={`w-full mt-5 py-3 rounded-xl font-semibold text-white transition-all
          ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          >
            {isUploading
              ? "Uploading..."
              : `Upload ${files.length} File${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}
