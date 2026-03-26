import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Link as LinkIcon, Download, RefreshCw } from 'lucide-react';

export default function Converter() {
  const [activeTab, setActiveTab] = useState('local');
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('mp3');
  const [status, setStatus] = useState('idle'); // idle, converting, done
  const [downloadUrl, setDownloadUrl] = useState('');
  const [url, setUrl] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleConvert = async () => {
    if (!file && activeTab === 'local') return;
    setStatus('converting');

    if (activeTab === 'local') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

      try {
        const response = await fetch('http://localhost:5000/api/convert/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        if (response.ok) {
          setStatus('done');
          setDownloadUrl(`http://localhost:5000${data.fileUrl}`);
        } else {
          alert('Conversion failed: ' + (data.message || data.error));
          setStatus('idle');
        }
      } catch (error) {
        console.error(error);
        alert('Network error. Is the backend server running?');
        setStatus('idle');
      }
    } else if (activeTab === 'link') {
      if (!url) return;
      try {
        const response = await fetch('http://localhost:5000/api/convert/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, format })
        });
        const data = await response.json();
        
        if (response.ok) {
          setStatus('done');
          setDownloadUrl(`http://localhost:5000${data.fileUrl}`);
        } else {
          alert('Conversion failed: ' + (data.message || data.error));
          setStatus('idle');
        }
      } catch (error) {
        console.error(error);
        alert('Network error. Is the backend server running?');
        setStatus('idle');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-8 text-white">Convert Media</h2>
      
      <div className="flex gap-4 mb-8 w-full justify-center">
        <button onClick={() => setActiveTab('local')} className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'local' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/10'}`}>
          Local File
        </button>
        <button onClick={() => setActiveTab('link')} className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'link' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/10'}`}>
          URL Link
        </button>
      </div>

      <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
        {activeTab === 'local' ? (
          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-400 bg-white/5' : 'border-gray-500 hover:border-indigo-400'}`}>
            <input {...getInputProps()} />
            <UploadCloud className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
            {file ? <p className="text-green-400">Selected: {file.name}</p> : <p className="text-gray-300 font-medium">Drag & drop a file here, or click to select</p>}
          </div>
        ) : (
          <div className="py-4">
             <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-2">
                <LinkIcon className="text-gray-400 w-6 h-6 ml-2" />
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube, Facebook, or Instagram link..." 
                  className="bg-transparent border-none flex-1 text-white focus:ring-0 p-2 outline-none" 
                />
             </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Convert to:</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="bg-slate-800 text-white border border-white/20 rounded-lg p-2 outline-none">
               <option value="mp3">MP3</option>
               <option value="wav">WAV</option>
               <option value="mp4">MP4</option>
               <option value="gif">GIF</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            {status === 'done' && (
              <a 
               href={downloadUrl}
               download={`converted.${format}`}
               className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-all flex items-center gap-2 text-white">
                 <Download className="w-5 h-5" /> Download
              </a>
            )}
            <button 
             onClick={handleConvert}
             disabled={status === 'converting' || (activeTab === 'local' && !file)}
             className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2">
               {status === 'converting' ? <RefreshCw className="animate-spin" /> : 'Convert'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
