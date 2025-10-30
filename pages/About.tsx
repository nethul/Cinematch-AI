import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white">About Us</h1>
        <p className="mt-4 text-slate-300 leading-relaxed">
          Moviematch AI helps you discover films that resonate with your tastes by analyzing tone, pacing, visual style, and narrative depth — not just genres. Built with React, Gemini API, and TMDb.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;


