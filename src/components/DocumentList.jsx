import { useEffect, useState } from "react";
import axios from "axios";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/files/documents"
      );

      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDocument = async (filename) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/files/delete/${filename}`
      );

      setDocuments((prev) =>
        prev.filter((doc) => doc.name !== filename)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete file");
    }
  };

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Uploaded Documents
        </h2>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {documents.length} Files
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No documents uploaded yet
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">📄</div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {doc.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {(doc.size / 1024).toFixed(2)} KB
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(
                      doc.uploadDate
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`http://localhost:5000/api/files/download/${doc.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  View
                </a>

                <button
                  onClick={() =>
                    deleteDocument(doc.name)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}