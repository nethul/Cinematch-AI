import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Contact Us</h1>
        <p className="mt-4 text-slate-300">Have feedback or partnership ideas? Reach out:</p>
        <ul className="mt-3 text-slate-300 text-sm space-y-2">
          <li>Email: <a className="text-cyan-400 hover:text-cyan-300" href="mailto:support@moviematch.ai">support@moviematch.ai</a></li>
          <li>GitHub: <a className="text-cyan-400 hover:text-cyan-300" href="https://github.com/nethul" target="_blank" rel="noreferrer">@nethul</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;


