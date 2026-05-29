import { useEffect, useState } from "react";
import PDFUploader from "./components/PDFUploader";
import DocumentList from "./components/DocumentList";
import socket from "./socket";

function App() {
  const [notification, setNotification] = useState(null);

useEffect(() => {
  socket.on("uploadStarted", (data) => {
    setNotification({
      type: "info",
      message: `Upload in progress — processing ${data.count} files in background`,
    });
  });

  socket.on("uploadComplete", (data) => {
    setNotification({
      type: "success",
      message: `${data.count} files uploaded successfully`,
      time: new Date(
        data.timestamp
      ).toLocaleTimeString(),
    });
  });

  return () => {
    socket.off("uploadStarted");
    socket.off("uploadComplete");
  };
}, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl">
          <p className="font-semibold">
            {notification.message}
          </p>

          <p className="text-sm opacity-90">
            {notification.time}
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <PDFUploader />

        <DocumentList />
      </div>
    </div>
  );
}

export default App;