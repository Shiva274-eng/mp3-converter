import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        Universal Media Converter
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mb-12">
        The ultimate, lightning-fast platform to convert any video or audio to MP3, MP4, GIF, and WAV. Upload local files or paste public links.
      </p>
      
      <div className="flex gap-6">
        <Link to="/converter" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-semibold text-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all duration-300">
          <span className="flex items-center gap-2">
            Start Converting <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        <Link to="/dashboard" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300">
          History Dashboard
        </Link>
      </div>
    </div>
  );
}
