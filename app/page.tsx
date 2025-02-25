"use client"

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  async function downloadVideo(videoUrl: string) {
    if (!videoUrl) return;
    setIsDownloading(true);
    setError("");

    try {
      const response = await fetch(`/api/download?link=${encodeURIComponent(videoUrl)}`);

      if (!response.ok) {
        throw new Error("Failed to download");
      }

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "video.mp4";

      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading video:", error);
      setError("Failed to download video. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main className="container mx-auto py-12 flex justify-center items-center h-screen text-white">
      <div className="flex flex-wrap items-center flex-col gap-4 p-6 rounded-xl w-full max-w-md ">
        <h1 className="font-bold text-2xl text-center">YTA</h1>
        <p className="text-zinc-400 text-center">open-source youtube video downloader</p>
        <div className="flex gap-2 w-full md:flex-nowrap flex-wrap items-center justify-center">
          <input 
            value={url}
            onChange={(e) => setUrl(e.target.value)} 
            className="py-2 px-3 rounded-xl w-full bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white"
            placeholder="https://www.youtube.com/watch?v=..." 
          />
          <button 
            className="bg-zinc-600 px-4 py-2 rounded-xl text-white flex items-center gap-2 disabled:opacity-50" 
            onClick={() => downloadVideo(url)}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="animate-spin" size={20} /> : "Download"}
          </button>
        </div>
        {isDownloading && <p className="text-zinc-400">Downloading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <a href="https://github.com/aapelix/yta" target="_blank" className="text-white text-sm hover:underline">github</a>
        <a href="https://aapelix.dev" target="_blank" className="text-white text-sm hover:underline">aapelix.dev</a>
      </div>
    </main>
  );
}
