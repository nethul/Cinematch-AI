import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-4 text-slate-300 text-sm leading-relaxed">
          We do not sell your data. Recommendations can be shared at your discretion. Third‑party APIs (Gemini, TMDb) are used to power features; review their policies as applicable.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;


