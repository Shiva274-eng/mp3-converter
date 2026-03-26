import React, { useState } from 'react';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">Conversion History</h2>
      
      {history.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 text-center text-gray-400">
          No conversions found. Go to the converter to start!
        </div>
      ) : (
        <div className="space-y-4">
           {/* History items will go here */}
        </div>
      )}
    </div>
  );
}
